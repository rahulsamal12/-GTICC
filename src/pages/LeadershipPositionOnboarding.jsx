import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../api/client';
import CountryCodeSelect from '../components/CountryCodeSelect';
import TimezoneSelect from '../components/TimezoneSelect';
import { suggestTimezoneFromLocation, getTimezoneOptions } from '../data/timezones';

const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function LeadershipPositionOnboarding() {
  const [formData, setFormData] = useState({
    fullName: '',
    officialEmail: '',
    countryCode: '',
    mobileWhatsApp: '',
    cityCountry: '',
    timeZoneGmt: '',
    currentDesignation: '',
    organizationFirm: '',
    website: '',
    primaryIndustryDomain: '',
    otherIndustryDomain: '',
    strategicEngagement: [],
    geographicMarkets: [],
    linkedInUrl: '',
    executiveSummary: '',
    candidateName: '',
    attestationDate: getTodayDate(),
    digitalSignature: '',
    attestationOfficialEmail: '',
    attestationCheck: false,
    termsAccepted: false,
    privacyAcknowledged: false,
    termsAcceptedAt: '',
    privacyAcknowledgedAt: '',
    legalVersion: 'v1.0-2026',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submissionReference, setSubmissionReference] = useState('');
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Profile & Supporting Documents state (optional)
  const [documents, setDocuments] = useState({
    profilePhoto: null,
    professionalCert: null,
  });
  const [docErrors, setDocErrors] = useState({
    profilePhoto: '',
    professionalCert: '',
  });

  useEffect(() => {
    document.title = 'Leadership & Position Screening Questionnaire | GTICC';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'GTICC Leadership & Position Screening Questionnaire — Confidential Vetting & Strategic Affiliation Assessment Form.'
      );
    }

    // Restore draft form state if navigating back from legal pages
    const savedDraft = sessionStorage.getItem('gticc_lpo_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error('Failed to parse saved LPO draft:', err);
      }
    }

    // Check if Terms of Use or Privacy Policy were explicitly accepted on dedicated pages
    const termsAcceptedFlag = sessionStorage.getItem('gticc_terms_accepted');
    const termsTimestamp = sessionStorage.getItem('gticc_terms_accepted_at');
    if (termsAcceptedFlag === 'true') {
      setFormData((prev) => ({
        ...prev,
        termsAccepted: true,
        termsAcceptedAt: termsTimestamp || prev.termsAcceptedAt || new Date().toISOString(),
      }));
      setErrors((prev) => ({ ...prev, termsAccepted: '' }));
    }

    const privacyAcknowledgedFlag = sessionStorage.getItem('gticc_privacy_acknowledged');
    const privacyTimestamp = sessionStorage.getItem('gticc_privacy_acknowledged_at');
    if (privacyAcknowledgedFlag === 'true') {
      setFormData((prev) => ({
        ...prev,
        privacyAcknowledged: true,
        privacyAcknowledgedAt: privacyTimestamp || prev.privacyAcknowledgedAt || new Date().toISOString(),
      }));
      setErrors((prev) => ({ ...prev, privacyAcknowledged: '' }));
    }
  }, []);

  // Save current form inputs to sessionStorage whenever changed so applicant can navigate freely
  useEffect(() => {
    try {
      sessionStorage.setItem('gticc_lpo_draft', JSON.stringify(formData));
    } catch {
      // ignore quota limits
    }
  }, [formData]);

  const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileUpload = (docKey, file) => {
    if (!file) return;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const isExtensionValid = ALLOWED_EXTENSIONS.includes(ext);
    const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type) || file.type === '';

    if (!isExtensionValid && !isMimeValid) {
      setDocErrors((prev) => ({
        ...prev,
        [docKey]: 'Invalid file format. Only PDF, JPG, JPEG, and PNG files are accepted.',
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setDocErrors((prev) => ({
        ...prev,
        [docKey]: `File exceeds maximum allowed size of 5 MB (selected: ${formatFileSize(file.size)}).`,
      }));
      return;
    }

    setDocErrors((prev) => ({ ...prev, [docKey]: '' }));
    setDocuments((prev) => ({
      ...prev,
      [docKey]: {
        file,
        name: file.name,
        size: file.size,
        formattedSize: formatFileSize(file.size),
        type: file.type,
      },
    }));
  };

  const handleFileRemove = (docKey) => {
    setDocuments((prev) => ({ ...prev, [docKey]: null }));
    setDocErrors((prev) => ({ ...prev, [docKey]: '' }));
    const inputEl = document.getElementById(`lpo-${docKey}-input`);
    if (inputEl) inputEl.value = '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => {
        const next = { ...prev, [name]: value };

        // Automatically suggest timezone based on selected city & country
        if (name === 'cityCountry' && value.trim()) {
          const suggestedIana = suggestTimezoneFromLocation(value);
          if (suggestedIana) {
            const allTz = getTimezoneOptions();
            const match = allTz.find((t) => t.iana === suggestedIana);
            if (match) {
              next.timeZoneGmt = match.value;
            }
          }
        }

        return next;
      });
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'cityCountry' && errors.timeZoneGmt) {
      setErrors((prev) => ({ ...prev, timeZoneGmt: '' }));
    }
  };

  const handleTimezoneChange = (val) => {
    setFormData((prev) => ({ ...prev, timeZoneGmt: val }));
    if (errors.timeZoneGmt) {
      setErrors((prev) => ({ ...prev, timeZoneGmt: '' }));
    }
  };

  const handleEngagementToggle = (option) => {
    setFormData((prev) => {
      const exists = prev.strategicEngagement.includes(option);
      if (exists) {
        setErrors((errs) => ({ ...errs, strategicEngagement: '' }));
        return {
          ...prev,
          strategicEngagement: prev.strategicEngagement.filter((item) => item !== option),
        };
      }
      if (prev.strategicEngagement.length >= 2) {
        setErrors((errs) => ({
          ...errs,
          strategicEngagement: 'Maximum 2 selections allowed.',
        }));
        return prev;
      }
      setErrors((errs) => ({ ...errs, strategicEngagement: '' }));
      return {
        ...prev,
        strategicEngagement: [...prev.strategicEngagement, option],
      };
    });
  };

  const handleMarketsToggle = (option) => {
    setFormData((prev) => {
      const exists = prev.geographicMarkets.includes(option);
      const updated = exists
        ? prev.geographicMarkets.filter((item) => item !== option)
        : [...prev.geographicMarkets, option];
      return { ...prev, geographicMarkets: updated };
    });
    if (errors.geographicMarkets) {
      setErrors((prev) => ({ ...prev, geographicMarkets: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Legal Name & Professional Honorific is required.';
    }

    if (!formData.officialEmail.trim()) {
      errs.officialEmail = 'Official Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
      errs.officialEmail = 'Please enter a valid email address.';
    }

    if (!formData.countryCode.trim()) {
      errs.countryCode = 'Country code is required.';
    }

    if (!formData.mobileWhatsApp.trim()) {
      errs.mobileWhatsApp = 'Mobile / WhatsApp number is required.';
    }

    if (!formData.cityCountry.trim()) {
      errs.cityCountry = 'City & Country is required.';
    }

    if (!formData.timeZoneGmt.trim()) {
      errs.timeZoneGmt = 'Time Zone (GMT) is required.';
    }

    if (!formData.currentDesignation.trim()) {
      errs.currentDesignation = 'Current Designation is required.';
    }

    if (!formData.organizationFirm.trim()) {
      errs.organizationFirm = 'Organization / Firm is required.';
    }

    if (formData.website.trim()) {
      try {
        new URL(
          formData.website.startsWith('http://') || formData.website.startsWith('https://')
            ? formData.website
            : `https://${formData.website}`
        );
      } catch {
        errs.website = 'Please enter a valid website URL.';
      }
    }

    if (!formData.primaryIndustryDomain) {
      errs.primaryIndustryDomain = 'Please select a primary industry / sector domain.';
    } else if (
      formData.primaryIndustryDomain === 'Other Specialized Domain' &&
      !formData.otherIndustryDomain.trim()
    ) {
      errs.otherIndustryDomain = 'Please specify your specialized domain.';
    }

    if (formData.strategicEngagement.length === 0) {
      errs.strategicEngagement = 'Please select at least one strategic engagement focus (maximum 2).';
    } else if (formData.strategicEngagement.length > 2) {
      errs.strategicEngagement = 'Maximum 2 selections allowed.';
    }

    if (formData.geographicMarkets.length === 0) {
      errs.geographicMarkets = 'Please select at least one geographic market of commercial influence.';
    }

    if (formData.linkedInUrl.trim()) {
      try {
        new URL(
          formData.linkedInUrl.startsWith('http://') || formData.linkedInUrl.startsWith('https://')
            ? formData.linkedInUrl
            : `https://${formData.linkedInUrl}`
        );
      } catch {
        errs.linkedInUrl = 'Please enter a valid LinkedIn URL.';
      }
    }

    if (!formData.executiveSummary.trim()) {
      errs.executiveSummary = 'Brief executive summary is required (minimum 10 characters).';
    } else if (formData.executiveSummary.trim().length < 10) {
      errs.executiveSummary = 'Executive summary must be at least 10 characters long.';
    }

    if (!formData.candidateName.trim()) {
      errs.candidateName = 'Candidate Name is required.';
    }

    if (!formData.attestationDate) {
      errs.attestationDate = 'Date is required.';
    }

    if (!formData.digitalSignature.trim()) {
      errs.digitalSignature = 'Digital Signature is required.';
    }

    if (!formData.attestationOfficialEmail.trim()) {
      errs.attestationOfficialEmail = 'Official Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.attestationOfficialEmail)) {
      errs.attestationOfficialEmail = 'Please enter a valid email address.';
    }

    if (!formData.attestationCheck) {
      errs.attestationCheck = 'You must confirm the attestation declaration.';
    }

    if (!formData.termsAccepted) {
      errs.termsAccepted = 'You must read and agree to the GTICC Terms of Use.';
    }

    if (!formData.privacyAcknowledged) {
      errs.privacyAcknowledged = 'You must read and acknowledge the GTICC Privacy Policy.';
    }

    setErrors(errs);
    return errs;
  };

  const fieldElementMap = {
    fullName: 'lpo-fullName',
    officialEmail: 'lpo-email',
    countryCode: 'lpo-countryCode',
    mobileWhatsApp: 'lpo-mobile',
    cityCountry: 'lpo-cityCountry',
    timeZoneGmt: 'lpo-timezone',
    currentDesignation: 'lpo-designation',
    organizationFirm: 'lpo-firm',
    website: 'lpo-website',
    primaryIndustryDomain: 'lpo-industry',
    otherIndustryDomain: 'lpo-otherDomain',
    strategicEngagement: 'lpo-strategicEngagement',
    geographicMarkets: 'lpo-geographicMarkets',
    linkedInUrl: 'lpo-linkedIn',
    executiveSummary: 'lpo-summary',
    candidateName: 'lpo-candName',
    attestationDate: 'lpo-date',
    digitalSignature: 'lpo-digSig',
    attestationOfficialEmail: 'lpo-attEmail',
    attestationCheck: 'lpo-attestationCheck',
    termsAccepted: 'lpo-terms-label',
    privacyAcknowledged: 'lpo-privacy-label',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setUpdateSuccessMessage('');
    const validationErrors = validate();
    const errorKeys = Object.keys(validationErrors);

    if (errorKeys.length === 0) {
      setIsSubmitting(true);
      try {
        let profilePhotoUrl = documents.profilePhoto?.existingUrl || null;
        let profilePhotoName = documents.profilePhoto?.existingName || null;
        let professionalCertUrl = documents.professionalCert?.existingUrl || null;
        let professionalCertName = documents.professionalCert?.existingName || null;

        // Upload Profile Photograph if a new file was attached
        if (documents.profilePhoto?.file) {
          const photoData = new FormData();
          photoData.append('file', documents.profilePhoto.file);
          photoData.append('docType', 'profile_photo');
          const photoRes = await fetch(getApiUrl('/upload'), {
            method: 'POST',
            body: photoData,
          });
          const photoJson = await photoRes.json();
          if (photoRes.ok && photoJson.fileUrl) {
            profilePhotoUrl = photoJson.fileUrl;
            profilePhotoName = photoJson.fileName || documents.profilePhoto.name;
          }
        }

        // Upload Professional Licence / Certification if a new file was attached
        if (documents.professionalCert?.file) {
          const certData = new FormData();
          certData.append('file', documents.professionalCert.file);
          certData.append('docType', 'professional_cert');
          const certRes = await fetch(getApiUrl('/upload'), {
            method: 'POST',
            body: certData,
          });
          const certJson = await certRes.json();
          if (certRes.ok && certJson.fileUrl) {
            professionalCertUrl = certJson.fileUrl;
            professionalCertName = certJson.fileName || documents.professionalCert.name;
          }
        }

        const submissionPayload = {
          ...formData,
          profilePhotoUrl,
          profilePhotoName,
          professionalCertUrl,
          professionalCertName,
        };

        const targetEndpoint = isModifyMode && submissionReference
          ? `/onboarding/leadership/${submissionReference}`
          : '/onboarding/leadership';
        const targetMethod = isModifyMode && submissionReference ? 'PUT' : 'POST';

        const response = await fetch(getApiUrl(targetEndpoint), {
          method: targetMethod,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionPayload),
        });

        const result = await response.json();

        if (!response.ok) {
          if (result.details && Array.isArray(result.details) && result.details.length > 0) {
            const serverFieldErrors = {};
            result.details.forEach((d) => {
              if (d.field) {
                serverFieldErrors[d.field] = d.message;
              }
            });
            setErrors((prev) => ({ ...prev, ...serverFieldErrors }));
            const firstServerField = result.details[0].field;
            const targetElId = fieldElementMap[firstServerField];
            const targetEl = targetElId ? document.getElementById(targetElId) : null;
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              if (typeof targetEl.focus === 'function') targetEl.focus();
            }
          }
          throw new Error(result.error || 'Server error occurred while storing submission.');
        }

        const refId = result.referenceId || submissionReference;
        if (!refId) {
          throw new Error('Database acknowledgment received without valid official reference ID.');
        }

        // Update cached documents in state with saved URLs so further modifies retain them
        if (profilePhotoUrl) {
          setDocuments((prev) => ({
            ...prev,
            profilePhoto: {
              ...(prev.profilePhoto || {}),
              file: null,
              name: profilePhotoName || 'Profile Photograph',
              existingUrl: profilePhotoUrl,
              existingName: profilePhotoName,
            },
          }));
        }
        if (professionalCertUrl) {
          setDocuments((prev) => ({
            ...prev,
            professionalCert: {
              ...(prev.professionalCert || {}),
              file: null,
              name: professionalCertName || 'Professional Licence / Certificate',
              existingUrl: professionalCertUrl,
              existingName: professionalCertName,
            },
          }));
        }

        setSubmissionReference(refId);
        setFormSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Failed to persist leadership application to backend:', err);
        setServerError(err.message || 'Unable to connect to the secure submission backend. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const firstErrorField = errorKeys[0];
      const targetElementId = fieldElementMap[firstErrorField];
      const targetElement = targetElementId ? document.getElementById(targetElementId) : null;

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof targetElement.focus === 'function') {
          targetElement.focus();
        }
      } else {
        setTimeout(() => {
          const firstErrorEl = document.querySelector('.onboarding-error');
          if (firstErrorEl) {
            firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50);
      }
    }
  };

  const industryDomainOptions = [
    'International Trade & Cross-Border Supply Chain',
    'Technology, Artificial Intelligence & Digital Infrastructure',
    'Advanced Manufacturing, Aerospace & Industrial Machinery',
    'Banking, Private Equity, Venture Capital & Asset Management',
    'Healthcare, Biotechnology & Life Sciences',
    'Clean Energy, Mining, Commodities & Infrastructure',
    'Diplomatic Affairs, Government Relations & International Law',
    'Other Specialized Domain',
  ];

  const strategicEngagementOptions = [
    'Direct Investor / Capital Deployment (Allocating funds to vetted cross-border ventures)',
    'Global Trade Facilitator & Deal Originator (Connecting buyers, sellers & trade partners)',
    'Strategic Corporate Partner (Expanding organizational alliances & joint ventures)',
    'Industry Advisory & Thought Leadership (Guiding sector policies & executive councils)',
    'Diplomatic & Bilateral Trade Envoy (Liaising with government ministries & trade bodies)',
  ];

  const geographicMarketOptions = [
    'North America (USA & Canada)',
    'Middle East & GCC Region (UAE, Saudi Arabia, Qatar, etc.)',
    'Europe & United Kingdom',
    'South Asia (India, Bangladesh, Sri Lanka, etc.)',
    'East Asia & Southeast Asia (ASEAN, Japan, South Korea)',
    'Latin America & Caribbean',
    'Sub-Saharan & North Africa',
  ];

  const inlineStyles = `
    /* Scope card and section to remove yellow/gold overlay & heavy glow */
    .gticc-questionnaire-card {
      background: #171D25 !important;
      border: 1px solid #2A3649 !important;
      border-radius: 12px !important;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45) !important;
      overflow: visible !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }
    .gticc-questionnaire-card::after,
    .gticc-questionnaire-card:hover::after {
      display: none !important;
      content: none !important;
      opacity: 0 !important;
    }
    .gticc-questionnaire-card:hover {
      transform: none !important;
      border-color: #3B4B63 !important;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55) !important;
    }
    .gticc-questionnaire-section {
      background: #081321 !important;
      background-image: linear-gradient(180deg, #081321 0%, #060E18 100%) !important;
    }
    .gticc-questionnaire-hero::before {
      display: none !important;
      content: none !important;
      opacity: 0 !important;
    }

    .lpo-success-box {
      background: #171D25;
      border: 1px solid rgba(214, 164, 59, 0.4);
      border-radius: 8px;
      padding: 36px 30px;
      text-align: center;
      margin-top: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
    .lpo-success-box h4 { color: #D6A43B; font-weight: 700; margin-bottom: 12px; font-size: 24px; line-height: 1.3; }
    .lpo-success-box p { color: #F5F5F5; font-size: 15px; line-height: 1.6; margin-bottom: 12px; }

    /* Informational Panels: solid dark navy */
    .lpo-notice-box {
      background: #0D1B2A !important;
      border-left: 3px solid #D6A43B !important;
      border-top: 1px solid #233147 !important;
      border-right: 1px solid #233147 !important;
      border-bottom: 1px solid #233147 !important;
      padding: 20px 24px;
      border-radius: 4px;
      margin-bottom: 24px;
      color: #F5F5F5 !important;
      font-size: 15px;
      line-height: 1.7;
    }
    .lpo-meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      background: #0D1B2A;
      border: 1px solid #233147;
      border-radius: 6px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .lpo-meta-item {
      font-size: 13.5px;
      line-height: 1.5;
      color: #AAB4C3;
    }
    .lpo-meta-item strong {
      color: #D6A43B;
      display: block;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
      font-weight: 700;
    }

    .lpo-section-title {
      color: #D6A43B;
      font-size: 16.5px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      border-bottom: 1px solid #233147;
      padding-bottom: 8px;
      margin-bottom: 12px;
      margin-top: 32px;
      line-height: 1.45;
    }
    .lpo-q-label {
      color: #F5F5F5;
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 6px;
      line-height: 1.45;
      display: block;
    }
    .lpo-q-desc {
      color: #AAB4C3;
      font-size: 14.5px;
      margin-bottom: 16px;
      line-height: 1.65;
      font-weight: 400;
    }
    .lpo-check-group {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .lpo-check-label {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      padding: 11px 14px;
      border-radius: 6px;
      border: 1px solid #2A3649;
      background: #202936;
      transition: background 0.2s, border-color 0.2s;
      color: #F5F5F5;
      font-size: 13.5px;
      line-height: 1.5;
    }
    .lpo-check-label:hover {
      background: #283344;
      border-color: #3B4B63;
    }
    .lpo-check-label.checked {
      background: #263345;
      border-color: #D6A43B;
      color: #F5F5F5;
    }
    .lpo-check-label input[type="checkbox"] {
      margin-top: 3px;
      accent-color: #D6A43B;
      width: 17px;
      height: 17px;
      flex-shrink: 0;
      cursor: pointer;
    }
    .onboarding-error {
      color: #ff6b6b;
      font-size: 12.5px;
      margin-top: 5px;
      font-weight: 500;
      line-height: 1.4;
    }
    .lpo-decl-label {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      cursor: pointer;
      color: #F5F5F5;
      font-size: 13.5px;
      line-height: 1.6;
    }
    .lpo-decl-label input[type="checkbox"] {
      margin-top: 3px;
      accent-color: #D6A43B;
      width: 17px;
      height: 17px;
      flex-shrink: 0;
    }

    /* Native select and text controls: Dark charcoal #202936 with subtle grey borders #2A3649 */
    .lpo-form select,
    .lpo-form select.form-control {
      color: #F5F5F5 !important;
      -webkit-text-fill-color: #F5F5F5 !important;
      font-size: 13.5px !important;
      line-height: 1.5 !important;
      padding: 10px 42px 10px 14px !important;
      min-height: 46px !important;
      height: auto !important;
      appearance: auto !important;
      -webkit-appearance: auto !important;
      background: #202936 !important;
      border: 1px solid #2A3649 !important;
      border-radius: 8px !important;
    }
    .lpo-form select option {
      color: #000000 !important;
      background-color: #ffffff !important;
      font-size: 13.5px !important;
      padding: 6px 10px !important;
    }
    .lpo-form select option:checked {
      background-color: #e5e5e5 !important;
    }
    .lpo-form .form-control {
      background: #202936 !important;
      border: 1px solid #2A3649 !important;
      color: #F5F5F5 !important;
      padding: 10px 14px !important;
      border-radius: 8px !important;
      font-size: 13.5px !important;
      line-height: 1.5 !important;
    }
    .lpo-form .form-control::placeholder {
      font-size: 13px !important;
      color: #AAB4C3 !important;
      opacity: 0.8 !important;
    }
    .lpo-form .form-control:focus {
      background: #232D3B !important;
      border-color: #D6A43B !important;
      box-shadow: 0 0 0 3px rgba(214, 164, 59, 0.15) !important;
      color: #F5F5F5 !important;
    }
    .field-sublabel {
      font-size: 13.5px;
      font-weight: 500;
      color: #F5F5F5;
      margin-bottom: 5px;
      display: block;
      line-height: 1.4;
    }
    .lpo-form .onboarding-submit-btn {
      font-size: 14.5px !important;
      font-weight: 600 !important;
      letter-spacing: 0.5px;
      min-height: 50px !important;
      padding: 12px 24px !important;
      background-color: #D6A43B !important;
      border-color: #D6A43B !important;
      color: #081321 !important;
    }
    .lpo-form .onboarding-submit-btn:hover {
      background-color: #E0B34E !important;
      border-color: #E0B34E !important;
      color: #081321 !important;
    }
    .gticc-disclaimer-card {
      background: #0D1B2A !important;
      border-left: 4px solid #D6A43B !important;
      border-top: 1px solid #233147 !important;
      border-right: 1px solid #233147 !important;
      border-bottom: 1px solid #233147 !important;
      border-radius: 8px !important;
    }
    .gticc-email-link {
      color: #F2C45D !important;
      text-decoration: underline !important;
      text-underline-offset: 3px !important;
      text-decoration-thickness: 1px !important;
      font-weight: 500 !important;
      transition: color 0.2s ease, text-decoration-color 0.2s ease;
    }
    .gticc-email-link:hover,
    .gticc-email-link:focus {
      color: #FFFFFF !important;
      text-decoration-color: #F2C45D !important;
    }

    /* Document upload styling */
    .onboarding-upload-dropzone {
      border: 1.5px dashed #2A3649;
      background: #182230;
      border-radius: 8px;
      padding: 20px 18px;
      text-align: center;
      transition: border-color 0.2s ease, background 0.2s ease;
      position: relative;
    }
    .onboarding-upload-dropzone:hover {
      border-color: #D6A43B;
      background: #1C2737;
    }
    .onboarding-upload-dropzone.has-file {
      border-color: #3B82F6;
      background: rgba(59, 130, 246, 0.05);
    }
    .onboarding-file-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #202936;
      border: 1px solid #2A3649;
      border-radius: 6px;
      padding: 10px 14px;
      margin-top: 10px;
    }
    .onboarding-file-name {
      color: #F5F5F5;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 260px;
    }
    .onboarding-file-size {
      color: #AAB4C3;
      font-size: 11.5px;
      margin-left: 6px;
    }
    .onboarding-file-remove-btn {
      background: transparent;
      border: 1px solid #ef4444;
      color: #ef4444;
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .onboarding-file-remove-btn:hover {
      background: #ef4444;
      color: #ffffff;
    }
    .onboarding-file-replace-btn {
      background: transparent;
      border: 1px solid #D6A43B;
      color: #D6A43B;
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .onboarding-file-replace-btn:hover {
      background: #D6A43B;
      color: #081321;
    }
  `;

  return (
    <div className="site-content gticc-membership-page">
      <style>{inlineStyles}</style>

      {/* Hero Banner */}
      <section
        className="gticc-hero gticc-hero--fullscreen gticc-questionnaire-hero"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(8, 19, 33, 0.94), rgba(6, 14, 24, 0.97)), url("/membership_banner.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
        }}
      >
        <div className="container text-center">
          <span className="sub-title">GTICC | GLOBAL TRADE &amp; INVESTMENT COMMERCIAL COMMUNITY (GTICC.COM)</span>
          <h1 className="title" style={{ fontSize: '42px', fontWeight: '800', margin: '0 auto 16px auto' }}>
            LEADERSHIP &amp; POSITION SCREENING QUESTIONNAIRE
          </h1>
          <p className="responsive-lead-text text-white-50" style={{ maxWidth: '840px', margin: '0 auto 26px auto' }}>
            Confidential Vetting &amp; Strategic Affiliation Assessment Form — Assisting the GTICC Executive Council in evaluating candidate leadership experience, sector expertise, geographic influence, and governance alignment.
          </p>
          <div className="gticc-actions mt-2" style={{ justifyContent: 'center' }}>
            <a href="#lpo-form" className="btn">Begin Questionnaire</a>
            <Link to="/membership/apply" className="btn btn-ghost">Membership Apply</Link>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="lpo-form" className="space-ptb bg-dark rounded-section gticc-questionnaire-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-9">
              {formSubmitted ? (
                <div className="lpo-success-box">
                  <h4>Nomination Successfully Recorded</h4>
                  <p>
                    Thank you, <strong>{formData.candidateName || formData.fullName}</strong>.
                    Your leadership and strategic position onboarding nomination has been securely submitted and stored in the GTICC Executive Database.
                  </p>
                  {submissionReference && (
                    <p style={{ color: '#D6A43B', fontSize: '14px', fontFamily: 'monospace', margin: '12px 0' }}>
                      Official Nomination Reference ID: <strong>{submissionReference}</strong>
                    </p>
                  )}
                  <p style={{ color: '#AAB4C3', fontSize: '15px' }}>
                    Document purpose: Leadership Candidate Screening &amp; Strategic Affiliation.
                  </p>
                  <div className="lpo-notice-box" style={{ maxWidth: '650px', margin: '20px auto', textAlign: 'left' }}>
                    <p style={{ margin: 0 }}>
                      <strong>Executive Review Status:</strong> Your nomination is queued for confidential screening by the GTICC Executive Governance Committee. For communications regarding this submission, please contact the Secretariat at{' '}
                      <a href="mailto:gticcofficial@gmail.com" className="gticc-email-link">
                        gticcofficial@gmail.com
                      </a> quoting your reference ID.
                    </p>
                  </div>
                  <button
                    className="btn mt-3"
                    onClick={() => {
                      setIsModifyMode(true);
                      setServerError('');
                      setFormSubmitted(false);
                      setTimeout(() => {
                        const formEl = document.getElementById('lpo-form');
                        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    Review or Modify Form
                  </button>
                </div>
              ) : (
                <form
                  className="gticc-card lpo-form gticc-questionnaire-card"
                  onSubmit={handleSubmit}
                  style={{ border: '1px solid #2A3649', padding: '36px 30px' }}
                  noValidate
                >
                  {isModifyMode && submissionReference && (
                    <div style={{ background: 'rgba(214, 164, 59, 0.12)', border: '1px solid #D6A43B', color: '#F2C45D', padding: '14px 18px', borderRadius: '6px', marginBottom: '22px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <strong>Review &amp; Modify Mode:</strong> You are editing your submitted nomination (<span style={{ fontFamily: 'monospace' }}>{submissionReference}</span>). All your previously submitted values have been loaded. Modify any details and click &ldquo;Update &amp; Save Changes&rdquo; below.
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormSubmitted(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{ background: 'transparent', border: '1px solid #D6A43B', color: '#D6A43B', padding: '4px 12px', borderRadius: '4px', fontSize: '12.5px', cursor: 'pointer' }}
                      >
                        Return to Confirmation
                      </button>
                    </div>
                  )}
                  {serverError && (
                    <div style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
                      <strong>Submission Alert:</strong> {serverError}
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <span style={{ color: '#D6A43B', fontSize: '11.5px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                      GTICC | GLOBAL TRADE &amp; INVESTMENT COMMERCIAL COMMUNITY (GTICC.COM)
                    </span>
                    <h2 className="text-white mt-1 mb-2" style={{ fontSize: '23px', fontWeight: '800', lineHeight: 1.3 }}>
                      LEADERSHIP &amp; POSITION SCREENING QUESTIONNAIRE
                    </h2>
                    <p style={{ color: '#AAB4C3', fontSize: '14.5px', margin: 0, lineHeight: 1.5 }}>
                      Confidential Vetting &amp; Strategic Affiliation Assessment Form
                    </p>
                  </div>

                  {/* Document Metadata Strip */}
                  <div className="lpo-meta-grid">
                    <div className="lpo-meta-item">
                      <strong>Document Purpose</strong>
                      Leadership Candidate Screening &amp; Onboarding
                    </div>
                    <div className="lpo-meta-item">
                      <strong>Target Completion Time</strong>
                      Under 2 Minutes (8 Questions)
                    </div>
                    <div className="lpo-meta-item">
                      <strong>Governance Body</strong>
                      GTICC Executive Secretariat
                    </div>
                    <div className="lpo-meta-item">
                      <strong>Deployment Format</strong>
                      Fillable Client Form + Google Form / Web
                    </div>
                  </div>

                  {/* Governance Policy Box */}
                  <div className="lpo-notice-box">
                    <h5 style={{ color: '#D6A43B', fontSize: '14.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                      GTICC Governance &amp; Nomination Policy
                    </h5>
                    <p style={{ margin: 0 }}>
                      Official positions, bilateral envoy mandates, and committee leadership within GTICC are conferred directly by the Executive Council based on verified executive background, regional commercial influence, and ethical standing. This confidential questionnaire enables the Secretariat to evaluate candidate domain expertise and bilateral reach so the Council can identify the most effective leadership capacity or advisory portfolio.
                    </p>
                  </div>

                  {/* Section 1 Instructions */}
                  <div style={{ borderBottom: '1px solid #233147', paddingBottom: '16px', marginBottom: '10px' }}>
                    <h3 className="text-white mb-2" style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '0.5px' }}>
                      SECTION 1: APPLICANT SCREENING QUESTIONNAIRE
                    </h3>
                    <p style={{ color: '#F5F5F5', fontSize: '13.5px', margin: '0 0 6px 0', lineHeight: 1.6 }}>
                      Candidates are invited to provide accurate professional details, current affiliations, and sector accomplishments. All information submitted is held under strict executive confidentiality and used exclusively for committee screening and governance vetting.
                    </p>
                    <p style={{ color: '#AAB4C3', fontSize: '13px', fontStyle: 'italic', margin: 0, lineHeight: 1.55 }}>
                      &ldquo;Please complete the following 8 questions. This document may be filled out electronically or via hard copy and submitted directly to the GTICC Secretariat at{' '}
                      <a href="mailto:gticcofficial@gmail.com" className="gticc-email-link">
                        gticcofficial@gmail.com
                      </a>.&rdquo;
                    </p>
                  </div>

                  {/* Question 1 */}
                  <div className="lpo-section-title">
                    Question 1: Full Legal Name &amp; Professional Honorific
                  </div>
                  <p className="lpo-q-desc">
                    Enter your complete legal name including any applicable professional or academic honorifics (e.g., Dr., Eng., Amb., Prof., Mr., Ms.) for official registry and vetting documentation.
                  </p>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="lpo-fullName" className="field-sublabel">
                        Full Name <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="lpo-fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g., Dr. Jane Doe / Eng. John Smith"
                        required
                      />
                      {errors.fullName && <p className="onboarding-error">{errors.fullName}</p>}
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div className="lpo-section-title">
                    Question 2: Primary Contact Information
                  </div>
                  <p className="lpo-q-desc">
                    Provide direct professional contact details, including an official corporate or institutional email and mobile number with international dialing code for confidential Secretariat correspondence.
                  </p>
                  <div className="row g-3" style={{ position: 'relative', zIndex: 40 }}>
                    <div className="col-md-5">
                      <label htmlFor="lpo-email" className="field-sublabel">
                        Official Email <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="lpo-email"
                        name="officialEmail"
                        type="email"
                        value={formData.officialEmail}
                        onChange={handleChange}
                        placeholder="executive@institution.org"
                        required
                      />
                      {errors.officialEmail && <p className="onboarding-error">{errors.officialEmail}</p>}
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="lpo-countryCode" className="field-sublabel">
                        Country Code <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <CountryCodeSelect
                        id="lpo-countryCode"
                        name="countryCode"
                        value={formData.countryCode}
                        hasError={Boolean(errors.countryCode)}
                        onChange={(dialCode) => {
                          setFormData((prev) => ({ ...prev, countryCode: dialCode }));
                          if (errors.countryCode) {
                            setErrors((prev) => ({ ...prev, countryCode: '' }));
                          }
                        }}
                        required
                      />
                      {errors.countryCode && <p className="onboarding-error">{errors.countryCode}</p>}
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="lpo-mobile" className="field-sublabel">
                        Mobile / WhatsApp <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="lpo-mobile"
                        name="mobileWhatsApp"
                        type="tel"
                        value={formData.mobileWhatsApp}
                        onChange={handleChange}
                        placeholder="Mobile or WhatsApp number"
                        required
                      />
                      {errors.mobileWhatsApp && <p className="onboarding-error">{errors.mobileWhatsApp}</p>}
                    </div>
                  </div>

                  {/* Question 3 */}
                  <div className="lpo-section-title">
                    Question 3: Current Base Location &amp; Operating Time Zone
                  </div>
                  <p className="lpo-q-desc">
                    State your primary residential or operational headquarters city and country, along with your GMT offset to coordinate cross-border committee deliberations.
                  </p>
                  <div className="row g-3">
                    <div className="col-md-7">
                      <label htmlFor="lpo-cityCountry" className="field-sublabel">
                        City &amp; Country <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="lpo-cityCountry"
                        name="cityCountry"
                        type="text"
                        value={formData.cityCountry}
                        onChange={handleChange}
                        placeholder="e.g., London, United Kingdom / Dubai, UAE"
                        required
                      />
                      {errors.cityCountry && <p className="onboarding-error">{errors.cityCountry}</p>}
                    </div>
                    <div className="col-md-5">
                      <label htmlFor="lpo-timezone" className="field-sublabel">
                        Time Zone (GMT) <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <TimezoneSelect
                        id="lpo-timezone"
                        name="timeZoneGmt"
                        value={formData.timeZoneGmt}
                        onChange={handleTimezoneChange}
                        hasError={!!errors.timeZoneGmt}
                        required
                        placeholder="Select operating time zone..."
                      />
                      {errors.timeZoneGmt && <p className="onboarding-error">{errors.timeZoneGmt}</p>}
                    </div>
                  </div>

                  {/* Question 4 */}
                  <div className="lpo-section-title">
                    Question 4: Current Primary Organization &amp; Executive Designation
                  </div>
                  <p className="lpo-q-desc">
                    State your principal commercial firm, academic institution, or governance body, along with your current leadership title and organizational website.
                  </p>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="lpo-designation" className="field-sublabel">
                        Current Designation <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="lpo-designation"
                        name="currentDesignation"
                        type="text"
                        value={formData.currentDesignation}
                        onChange={handleChange}
                        placeholder="e.g., Chief Executive Officer, Senior Partner"
                        required
                      />
                      {errors.currentDesignation && <p className="onboarding-error">{errors.currentDesignation}</p>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lpo-firm" className="field-sublabel">
                        Organization / Firm <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="lpo-firm"
                        name="organizationFirm"
                        type="text"
                        value={formData.organizationFirm}
                        onChange={handleChange}
                        placeholder="Principal organization or institution"
                        required
                      />
                      {errors.organizationFirm && <p className="onboarding-error">{errors.organizationFirm}</p>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="lpo-website" className="field-sublabel">
                        Website
                      </label>
                      <input
                        className="form-control"
                        id="lpo-website"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://www.organization.com (optional)"
                      />
                      {errors.website && <p className="onboarding-error">{errors.website}</p>}
                    </div>
                  </div>

                  {/* Question 5 */}
                  <div className="lpo-section-title">
                    Question 5: Primary Industry / Sector Domain
                  </div>
                  <p className="lpo-q-desc">
                    Select the domain representing your deepest professional specialization to determine relevant working council, sector committee, or advisory panel alignment.
                  </p>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="lpo-industry" className="field-sublabel">
                        Primary Industry / Sector Domain <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <select
                        className="form-control"
                        id="lpo-industry"
                        name="primaryIndustryDomain"
                        value={formData.primaryIndustryDomain}
                        onChange={handleChange}
                        required
                      >
                        <option value="">— Select Industry Domain —</option>
                        {industryDomainOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.primaryIndustryDomain && <p className="onboarding-error">{errors.primaryIndustryDomain}</p>}
                    </div>
                    {formData.primaryIndustryDomain === 'Other Specialized Domain' && (
                      <div className="col-12">
                        <label htmlFor="lpo-otherDomain" className="field-sublabel">
                          Other Specialized Domain: <span style={{ color: '#D6A43B' }}>*</span>
                        </label>
                        <input
                          className="form-control"
                          id="lpo-otherDomain"
                          name="otherIndustryDomain"
                          type="text"
                          value={formData.otherIndustryDomain}
                          onChange={handleChange}
                          placeholder="Please specify your specialized domain"
                          required
                        />
                        {errors.otherIndustryDomain && <p className="onboarding-error">{errors.otherIndustryDomain}</p>}
                      </div>
                    )}
                  </div>

                  {/* Question 6 */}
                  <div className="lpo-section-title">
                    Question 6: Nature of Strategic Engagement &amp; Commercial Value Focus
                  </div>
                  <p className="lpo-q-desc">
                    Select up to two areas where your leadership, capital relationships, or advisory contributions can deliver maximum strategic value within the GTICC international ecosystem.
                  </p>
                  <div className="row g-3">
                    <div className="col-12">
                      <label id="lpo-strategicEngagement" className="field-sublabel">
                        Strategic Engagement Focus (Max 2) <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <div className="lpo-check-group mt-1">
                        {strategicEngagementOptions.map((opt) => {
                          const checked = formData.strategicEngagement.includes(opt);
                          const disabled = !checked && formData.strategicEngagement.length >= 2;
                          return (
                            <label
                              key={opt}
                              className={`lpo-check-label${checked ? ' checked' : ''}`}
                              style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleEngagementToggle(opt)}
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.strategicEngagement && <p className="onboarding-error">{errors.strategicEngagement}</p>}
                    </div>
                  </div>

                  {/* Question 7 */}
                  <div className="lpo-section-title">
                    Question 7: Key Geographic Markets of Commercial Influence
                  </div>
                  <p className="lpo-q-desc">
                    Select the international jurisdictions where you maintain active executive relationships, institutional networks, or verified market access to support bilateral missions.
                  </p>
                  <div className="row g-3">
                    <div className="col-12">
                      <label id="lpo-geographicMarkets" className="field-sublabel">
                        Geographic Markets of Influence <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <div className="lpo-check-group mt-1">
                        {geographicMarketOptions.map((opt) => {
                          const checked = formData.geographicMarkets.includes(opt);
                          return (
                            <label key={opt} className={`lpo-check-label${checked ? ' checked' : ''}`}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleMarketsToggle(opt)}
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.geographicMarkets && <p className="onboarding-error">{errors.geographicMarkets}</p>}
                    </div>
                  </div>

                  {/* Question 8 */}
                  <div className="lpo-section-title">
                    Question 8: Executive Summary &amp; Professional Profile Reference
                  </div>
                  <p className="lpo-q-desc">
                    Provide a verified LinkedIn profile link or a concise 2-3 sentence overview of your career milestones, industry leadership, and cross-border commercial experience.
                  </p>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="lpo-linkedIn" className="field-sublabel">
                        LinkedIn URL (Optional)
                      </label>
                      <input
                        className="form-control"
                        id="lpo-linkedIn"
                        name="linkedInUrl"
                        type="url"
                        value={formData.linkedInUrl}
                        onChange={handleChange}
                        placeholder="https://www.linkedin.com/in/profile-name"
                      />
                      {errors.linkedInUrl && <p className="onboarding-error">{errors.linkedInUrl}</p>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="lpo-summary" className="field-sublabel">
                        Brief Executive Summary <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <textarea
                        className="form-control"
                        id="lpo-summary"
                        name="executiveSummary"
                        rows="4"
                        value={formData.executiveSummary}
                        onChange={handleChange}
                        placeholder="Summarize your executive background, sector focus, and cross-border commercial track record in 2-3 sentences."
                        required
                      />
                      {errors.executiveSummary && <p className="onboarding-error">{errors.executiveSummary}</p>}
                    </div>
                  </div>

                  {/* Profile & Supporting Documents */}
                  <div className="lpo-section-title" style={{ marginTop: '40px' }}>
                    Profile &amp; Supporting Documents
                  </div>
                  <p className="lpo-q-desc" style={{ marginBottom: '14px' }}>
                    Upload supporting documentation for your leadership profile. Both uploads are strictly optional and assist the GTICC Governance Secretariat in expediting vetting and committee assignment.
                  </p>
                  <div className="row g-3">
                    {/* Profile Photograph */}
                    <div className="col-md-6">
                      <label className="field-sublabel">
                        Profile Photograph <span style={{ color: '#AAB4C3', fontWeight: 'normal', fontSize: '12px' }}>(Optional)</span>
                      </label>
                      <input
                        type="file"
                        id="lpo-profilePhoto-input"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload('profilePhoto', e.target.files?.[0])}
                      />
                      {!documents.profilePhoto ? (
                        <div
                          className="onboarding-upload-dropzone"
                          onClick={() => document.getElementById('lpo-profilePhoto-input')?.click()}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '26px', color: '#D6A43B', marginBottom: '8px', display: 'block' }}></i>
                          <div style={{ color: '#F5F5F5', fontSize: '13px', fontWeight: '600' }}>
                            Upload profile photo (if available)
                          </div>
                          <div style={{ color: '#AAB4C3', fontSize: '11.5px', marginTop: '4px' }}>
                            PDF, JPG, JPEG, or PNG &bull; Max 5 MB
                          </div>
                        </div>
                      ) : (
                        <div className="onboarding-file-card">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <i className="fa-solid fa-file-image" style={{ color: '#D6A43B', fontSize: '18px', flexShrink: 0 }}></i>
                            <div style={{ minWidth: 0 }}>
                              <div className="onboarding-file-name" title={documents.profilePhoto.name}>
                                {documents.profilePhoto.name}
                              </div>
                              <span className="onboarding-file-size">({documents.profilePhoto.formattedSize})</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="onboarding-file-replace-btn"
                              onClick={() => document.getElementById('lpo-profilePhoto-input')?.click()}
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              className="onboarding-file-remove-btn"
                              onClick={() => handleFileRemove('profilePhoto')}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                      {docErrors.profilePhoto && <p className="onboarding-error">{docErrors.profilePhoto}</p>}
                    </div>

                    {/* Professional Licence / Certification */}
                    <div className="col-md-6">
                      <label className="field-sublabel">
                        Professional Licence / Certification <span style={{ color: '#AAB4C3', fontWeight: 'normal', fontSize: '12px' }}>(Optional)</span>
                      </label>
                      <input
                        type="file"
                        id="lpo-professionalCert-input"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload('professionalCert', e.target.files?.[0])}
                      />
                      {!documents.professionalCert ? (
                        <div
                          className="onboarding-upload-dropzone"
                          onClick={() => document.getElementById('lpo-professionalCert-input')?.click()}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '26px', color: '#D6A43B', marginBottom: '8px', display: 'block' }}></i>
                          <div style={{ color: '#F5F5F5', fontSize: '13px', fontWeight: '600' }}>
                            Upload relevant professional licences or certificates (if available)
                          </div>
                          <div style={{ color: '#AAB4C3', fontSize: '11.5px', marginTop: '4px' }}>
                            PDF, JPG, JPEG, or PNG &bull; Max 5 MB
                          </div>
                        </div>
                      ) : (
                        <div className="onboarding-file-card">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <i className="fa-solid fa-file-lines" style={{ color: '#D6A43B', fontSize: '18px', flexShrink: 0 }}></i>
                            <div style={{ minWidth: 0 }}>
                              <div className="onboarding-file-name" title={documents.professionalCert.name}>
                                {documents.professionalCert.name}
                              </div>
                              <span className="onboarding-file-size">({documents.professionalCert.formattedSize})</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="onboarding-file-replace-btn"
                              onClick={() => document.getElementById('lpo-professionalCert-input')?.click()}
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              className="onboarding-file-remove-btn"
                              onClick={() => handleFileRemove('professionalCert')}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                      {docErrors.professionalCert && <p className="onboarding-error">{docErrors.professionalCert}</p>}
                    </div>
                  </div>

                  {/* Candidate Attestation & Submission */}
                  <div className="lpo-section-title" style={{ marginTop: '40px' }}>
                    CANDIDATE ATTESTATION &amp; SUBMISSION
                  </div>
                                    <p className="lpo-q-desc" style={{ marginBottom: '12px' }}>
                    Please review your responses carefully. By completing this declaration, you attest to the accuracy of your submitted executive credentials and authorize confidential evaluation by the GTICC Governance Committee.
                  </p>
                  <div className="lpo-notice-box" style={{ background: '#0D1B2A' }}>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#ffffff' }}>
                      &ldquo;I hereby confirm that the information provided is accurate and grant GTICC permission to evaluate my background for organizational affiliation and leadership engagement.&rdquo;
                    </p>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="lpo-candName" className="field-sublabel">
                        Candidate Name <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="lpo-candName"
                        name="candidateName"
                        type="text"
                        value={formData.candidateName}
                        onChange={handleChange}
                        placeholder="Full candidate name"
                        required
                      />
                      {errors.candidateName && <p className="onboarding-error">{errors.candidateName}</p>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lpo-date" className="field-sublabel">
                        Date <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="lpo-date"
                        name="attestationDate"
                        type="date"
                        value={formData.attestationDate}
                        onChange={handleChange}
                        required
                      />
                      {errors.attestationDate && <p className="onboarding-error">{errors.attestationDate}</p>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lpo-digSig" className="field-sublabel">
                        Digital Signature <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="lpo-digSig"
                        name="digitalSignature"
                        type="text"
                        value={formData.digitalSignature}
                        onChange={handleChange}
                        placeholder="Type full legal name as digital signature"
                        required
                      />
                      {errors.digitalSignature && <p className="onboarding-error">{errors.digitalSignature}</p>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lpo-attEmail" className="field-sublabel">
                        Official Email <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="lpo-attEmail"
                        name="attestationOfficialEmail"
                        type="email"
                        value={formData.attestationOfficialEmail}
                        onChange={handleChange}
                        placeholder="executive@institution.org"
                        required
                      />
                      {errors.attestationOfficialEmail && <p className="onboarding-error">{errors.attestationOfficialEmail}</p>}
                    </div>

                    <div className="col-12 mt-2">
                      <label className="lpo-decl-label">
                        <input
                          type="checkbox"
                          id="lpo-attestationCheck"
                          name="attestationCheck"
                          checked={formData.attestationCheck}
                          onChange={handleChange}
                          required
                        />
                        <span>
                          I hereby confirm that the information provided is accurate and grant GTICC permission to evaluate my background for organizational affiliation and leadership engagement.
                        </span>
                      </label>
                      {errors.attestationCheck && <p className="onboarding-error">{errors.attestationCheck}</p>}
                    </div>

                    {/* Mandatory Legal Consent Checkbox 1: Terms of Use */}
                    <div className="col-12 mt-2">
                      <label id="lpo-terms-label" className="lpo-decl-label">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              termsAccepted: val,
                              termsAcceptedAt: val ? (prev.termsAcceptedAt || new Date().toISOString()) : '',
                            }));
                            if (errors.termsAccepted) setErrors((prev) => ({ ...prev, termsAccepted: '' }));
                          }}
                          required
                        />
                        <span>
                          I have read and agree to the{' '}
                          <Link
                            to="/terms-of-use?from=leadership&return=/leadership-onboarding%23lpo-terms-label"
                            style={{ color: '#D4AF37', textDecoration: 'underline', fontWeight: 600 }}
                            onClick={() => {
                              try {
                                sessionStorage.setItem('gticc_lpo_draft', JSON.stringify(formData));
                              } catch { /* ignore */ }
                            }}
                          >
                            GTICC Terms of Use
                          </Link>
                          .
                        </span>
                      </label>
                      {errors.termsAccepted && <p className="onboarding-error">{errors.termsAccepted}</p>}
                    </div>

                    {/* Mandatory Legal Consent Checkbox 2: Privacy Policy */}
                    <div className="col-12 mt-2">
                      <label id="lpo-privacy-label" className="lpo-decl-label">
                        <input
                          type="checkbox"
                          name="privacyAcknowledged"
                          checked={formData.privacyAcknowledged}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              privacyAcknowledged: val,
                              privacyAcknowledgedAt: val ? (prev.privacyAcknowledgedAt || new Date().toISOString()) : '',
                            }));
                            if (errors.privacyAcknowledged) setErrors((prev) => ({ ...prev, privacyAcknowledged: '' }));
                          }}
                          required
                        />
                        <span>
                          I have read and acknowledge the{' '}
                          <Link
                            to="/privacy-policy?from=leadership&return=/leadership-onboarding%23lpo-privacy-label"
                            style={{ color: '#D4AF37', textDecoration: 'underline', fontWeight: 600 }}
                            onClick={() => {
                              try {
                                sessionStorage.setItem('gticc_lpo_draft', JSON.stringify(formData));
                              } catch { /* ignore */ }
                            }}
                          >
                            GTICC Privacy Policy
                          </Link>
                          .
                        </span>
                      </label>
                      {errors.privacyAcknowledged && <p className="onboarding-error">{errors.privacyAcknowledged}</p>}
                    </div>

                    <div className="col-12 mt-4">
                      <button className="btn onboarding-submit-btn" type="submit" style={{ width: '100%', minHeight: '50px' }} disabled={isSubmitting}>
                        {isSubmitting
                          ? (isModifyMode ? 'Updating Nomination in Database...' : 'Recording Nomination in Database...')
                          : (isModifyMode ? 'Update & Save Changes' : 'Submit Leadership Screening Questionnaire')}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Disclaimer */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div
            className="gticc-card gticc-disclaimer-card"
            style={{ borderLeft: '4px solid #D6A43B', background: '#0D1B2A', borderTop: '1px solid #233147', borderRight: '1px solid #233147', borderBottom: '1px solid #233147' }}
          >
            <p className="gticc-small-disclaimer" style={{ fontSize: '14.5px', color: '#a4b0be', margin: 0 }}>
              <strong>Disclaimer:</strong> Official positions and committee leadership within GTICC are conferred directly by the Executive Council based on candidate domain expertise, regional influence, and commercial track record. Submission of this form constitutes an expression of interest for confidential vetting and does not guarantee appointment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
