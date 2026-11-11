import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../api/client';
import CountryCodeSelect from '../components/CountryCodeSelect';

const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function BusinessMembershipOnboarding() {
  useEffect(() => {
    document.title = 'Business & Corporate Membership Onboarding Questionnaire | GTICC';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'GTICC Business & Corporate Membership Onboarding Questionnaire — International Trade Screening & Commercial Matchmaking Assessment.'
      );
    }

    // Restore draft form state if navigating back from legal pages
    const savedDraft = sessionStorage.getItem('gticc_bmo_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error('Failed to parse saved BMO draft:', err);
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
      sessionStorage.setItem('gticc_bmo_draft', JSON.stringify(formData));
    } catch {
      // ignore quota limits
    }
  }, [formData]);

  const [formData, setFormData] = useState({
    legalEntityName: '',
    corporateWebsite: '',
    repFullName: '',
    corporateTitle: '',
    corporateEmail: '',
    countryCode: '',
    directPhone: '',
    hqCityCountry: '',
    additionalLocations: '',
    primaryIndustrySector: '',
    otherIndustrySector: '',
    primaryBusinessModel: '',
    annualTurnover: '',
    eximStatus: '',
    targetMarkets: [],
    tradeObjectives: [],
    authOfficerName: '',
    authCorporateTitle: '',
    authCorporateEmail: '',
    authSubmissionDate: getTodayDate(),
    authSignatureSeal: '',
    affirmation: false,
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
    const inputEl = document.getElementById(`bmo-${docKey}-input`);
    if (inputEl) inputEl.value = '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleTargetMarketsToggle = (option) => {
    setFormData((prev) => {
      const exists = prev.targetMarkets.includes(option);
      const updated = exists
        ? prev.targetMarkets.filter((item) => item !== option)
        : [...prev.targetMarkets, option];
      return { ...prev, targetMarkets: updated };
    });
    if (errors.targetMarkets) {
      setErrors((prev) => ({ ...prev, targetMarkets: '' }));
    }
  };

  const handleTradeObjectivesToggle = (option) => {
    setFormData((prev) => {
      const exists = prev.tradeObjectives.includes(option);
      if (exists) {
        setErrors((errs) => ({ ...errs, tradeObjectives: '' }));
        return {
          ...prev,
          tradeObjectives: prev.tradeObjectives.filter((item) => item !== option),
        };
      }
      if (prev.tradeObjectives.length >= 2) {
        setErrors((errs) => ({
          ...errs,
          tradeObjectives: 'Maximum 2 selections allowed.',
        }));
        return prev;
      }
      setErrors((errs) => ({ ...errs, tradeObjectives: '' }));
      return {
        ...prev,
        tradeObjectives: [...prev.tradeObjectives, option],
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.legalEntityName.trim()) errs.legalEntityName = 'Legal Entity Name is required.';
    if (!formData.corporateWebsite.trim()) {
      errs.corporateWebsite = 'Corporate Website URL is required.';
    } else {
      try {
        new URL(
          formData.corporateWebsite.startsWith('http://') || formData.corporateWebsite.startsWith('https://')
            ? formData.corporateWebsite
            : `https://${formData.corporateWebsite}`
        );
      } catch {
        errs.corporateWebsite = 'Please enter a valid website URL.';
      }
    }

    if (!formData.repFullName.trim()) errs.repFullName = 'Representative Full Name is required.';
    if (!formData.corporateTitle.trim()) errs.corporateTitle = 'Corporate Title / Role is required.';

    if (!formData.corporateEmail.trim()) {
      errs.corporateEmail = 'Corporate Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.corporateEmail)) {
      errs.corporateEmail = 'Please provide a valid corporate email address.';
    }

    if (!formData.countryCode.trim()) errs.countryCode = 'Country code is required.';
    if (!formData.directPhone.trim()) errs.directPhone = 'Direct Phone / WhatsApp is required.';

    if (!formData.hqCityCountry.trim()) errs.hqCityCountry = 'HQ City & Country is required.';

    if (!formData.primaryIndustrySector) {
      errs.primaryIndustrySector = 'Please select a primary industry sector.';
    } else if (formData.primaryIndustrySector === 'Other Sector Domain' && !formData.otherIndustrySector.trim()) {
      errs.otherIndustrySector = 'Please specify your sector domain.';
    }

    if (!formData.primaryBusinessModel) {
      errs.primaryBusinessModel = 'Please select a business model.';
    }

    if (!formData.annualTurnover) {
      errs.annualTurnover = 'Please select an annual turnover tier.';
    }

    if (!formData.eximStatus) {
      errs.eximStatus = 'Please select your EXIM licensing & trade status.';
    }

    if (formData.targetMarkets.length === 0) {
      errs.targetMarkets = 'Please select at least one target international market.';
    }

    if (formData.tradeObjectives.length === 0) {
      errs.tradeObjectives = 'Please select at least one trade objective (maximum 2).';
    } else if (formData.tradeObjectives.length > 2) {
      errs.tradeObjectives = 'Maximum 2 selections allowed.';
    }

    if (!formData.authOfficerName.trim()) errs.authOfficerName = 'Authorized Officer Name is required.';
    if (!formData.authCorporateTitle.trim()) errs.authCorporateTitle = 'Corporate Title is required.';
    if (!formData.authCorporateEmail.trim()) {
      errs.authCorporateEmail = 'Corporate Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.authCorporateEmail)) {
      errs.authCorporateEmail = 'Please provide a valid email address.';
    }
    if (!formData.authSubmissionDate) errs.authSubmissionDate = 'Submission Date is required.';
    if (!formData.authSignatureSeal.trim()) errs.authSignatureSeal = 'Authorized Signature & Company Seal is required.';
    if (!formData.affirmation) errs.affirmation = 'You must affirm the corporate authorization declaration.';
    if (!formData.termsAccepted) errs.termsAccepted = 'You must read and agree to the GTICC Terms of Use.';
    if (!formData.privacyAcknowledged) errs.privacyAcknowledged = 'You must read and acknowledge the GTICC Privacy Policy.';

    setErrors(errs);
    return errs;
  };

  const fieldElementMap = {
    legalEntityName: 'bmo-legalName',
    corporateWebsite: 'bmo-website',
    repFullName: 'bmo-repName',
    corporateTitle: 'bmo-corpTitle',
    corporateEmail: 'bmo-corpEmail',
    countryCode: 'bmo-countryCode',
    directPhone: 'bmo-directPhone',
    hqCityCountry: 'bmo-hqCityCountry',
    primaryIndustrySector: 'bmo-industry',
    otherIndustrySector: 'bmo-otherSector',
    primaryBusinessModel: 'bmo-bizModel',
    annualTurnover: 'bmo-turnover',
    eximStatus: 'bmo-exim',
    targetMarkets: 'bmo-targetMarkets-heading',
    tradeObjectives: 'bmo-tradeObjectives-heading',
    authOfficerName: 'bmo-authOfficer',
    authCorporateTitle: 'bmo-authTitle',
    authCorporateEmail: 'bmo-authEmail',
    authSubmissionDate: 'bmo-authDate',
    authSignatureSeal: 'bmo-signature',
    affirmation: 'bmo-affirmation-label',
    termsAccepted: 'bmo-terms-label',
    privacyAcknowledged: 'bmo-privacy-label',
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
          ? `/onboarding/business/${submissionReference}`
          : '/onboarding/business';
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
        console.error('Failed to persist business application to backend:', err);
        setServerError(err.message || 'Unable to connect to the secure submission backend. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Find the first invalid field by form order
      const firstErrorField = errorKeys[0];
      const targetElementId = fieldElementMap[firstErrorField];
      const targetElement = targetElementId ? document.getElementById(targetElementId) : null;

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof targetElement.focus === 'function') {
          targetElement.focus();
        }
      } else {
        // Fallback to error element after microtask render
        setTimeout(() => {
          const firstErrorEl = document.querySelector('.onboarding-error');
          if (firstErrorEl) {
            firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50);
      }
    }
  };

  const industrySectorOptions = [
    'Aerospace, Defense, Space & Aviation Technology',
    'Advanced Manufacturing, Precision Engineering & Industrial Machinery',
    'Information Technology, Enterprise Software & Artificial Intelligence',
    'Agri-Food Processing, Food & Agricultural Commodities',
    'Healthcare, Medical Devices, Pharmaceuticals & Biotech',
    'Clean Energy, Power, Infrastructure & Natural Resources',
    'Logistics, Global Supply Chain, Freight & Maritime Transport',
    'Consumer Goods, Textiles, Fashion & Retail Trade',
    'Other Sector Domain',
  ];

  const businessModelOptions = [
    'B2B Finished Products & Capital Equipment Manufacturer',
    'Contract Manufacturing, OEM / ODM & Raw Material Processing',
    'B2B Professional Services, Engineering & Technical Consulting',
    'Enterprise SaaS & Digital Technology Provider',
    'Import / Export Merchant, Trading House & Regional Distributor',
  ];

  const turnoverOptions = [
    'Under $1 Million USD (Early Growth / Startup Venture)',
    '$1 Million – $5 Million USD (Established Emerging Enterprise)',
    '$5 Million – $20 Million USD (Mid-Market Commercial Player)',
    '$20 Million – $50 Million USD (Large Corporate / Scale Enterprise)',
    'Over $50 Million USD (Multinational / Enterprise Conglomerate)',
  ];

  const eximStatusOptions = [
    'Yes — Fully licensed and actively exporting / importing globally',
    'Yes — Valid export-import license, currently seeking new trade routes',
    'In Process — Licensing application or documentation currently underway',
    'Domestic Only — Seeking GTICC advisory to acquire EXIM certification',
  ];

  const targetMarketOptions = [
    'North America (United States, Canada, Mexico)',
    'Middle East & GCC (UAE, Saudi Arabia, Qatar, Oman)',
    'European Union & United Kingdom',
    'East Asia & Southeast Asia (ASEAN, Japan, South Korea)',
    'South Asia (India, Bangladesh, Sri Lanka)',
    'Latin America & Caribbean',
    'Sub-Saharan & North Africa',
  ];

  const tradeObjectiveOptions = [
    'Identify verified international buyers, importers & authorized distributors',
    'Secure cross-border joint venture, equity investment or FDI capital',
    'Navigate foreign market customs compliance, trade tariffs & legal standards',
    'Participate in high-level bilateral trade delegations & overseas expos',
    'Access GTICC executive business leadership network & bilateral chambers',
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

    .onboarding-success-box {
      background: #171D25;
      border: 1px solid rgba(214, 164, 59, 0.4);
      border-radius: 8px;
      padding: 36px 30px;
      text-align: center;
      margin-top: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
    .onboarding-success-box h4 { color: #D6A43B; font-weight: 700; margin-bottom: 12px; font-size: 24px; line-height: 1.3; }
    .onboarding-success-box p { color: #F5F5F5; font-size: 15px; line-height: 1.6; margin-bottom: 12px; }

    /* Informational Panels: solid dark navy */
    .onboarding-notice-box {
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
    .onboarding-meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      background: #0D1B2A;
      border: 1px solid #233147;
      border-radius: 6px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .onboarding-meta-item {
      font-size: 13.5px;
      line-height: 1.5;
      color: #AAB4C3;
    }
    .onboarding-meta-item strong {
      color: #D6A43B;
      display: block;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
      font-weight: 700;
    }

    .onboarding-section-title {
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
    .onboarding-q-label {
      color: #F5F5F5;
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 6px;
      line-height: 1.45;
      display: block;
    }
    .onboarding-q-desc {
      color: #AAB4C3;
      font-size: 14.5px;
      margin-bottom: 16px;
      line-height: 1.65;
      font-weight: 400;
    }
    .onboarding-check-group {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .onboarding-check-label {
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
    .onboarding-check-label:hover {
      background: #283344;
      border-color: #3B4B63;
    }
    .onboarding-check-label.checked {
      background: #263345;
      border-color: #D6A43B;
      color: #F5F5F5;
    }
    .onboarding-check-label input[type="checkbox"] {
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
    .onboarding-decl-label {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      cursor: pointer;
      color: #F5F5F5;
      font-size: 13.5px;
      line-height: 1.6;
    }
    .onboarding-decl-label input[type="checkbox"] {
      margin-top: 3px;
      accent-color: #D6A43B;
      width: 17px;
      height: 17px;
      flex-shrink: 0;
    }

    /* Native select and text controls: Dark charcoal #202936 with subtle grey borders #2A3649 */
    .gticc-form select,
    .gticc-form select.form-control {
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
    .gticc-form select option {
      color: #000000 !important;
      background-color: #ffffff !important;
      font-size: 13.5px !important;
      padding: 6px 10px !important;
    }
    .gticc-form select option:checked {
      background-color: #e5e5e5 !important;
    }
    .gticc-form .form-control {
      background: #202936 !important;
      border: 1px solid #2A3649 !important;
      color: #F5F5F5 !important;
      padding: 10px 14px !important;
      border-radius: 8px !important;
      font-size: 13.5px !important;
      line-height: 1.5 !important;
    }
    .gticc-form .form-control::placeholder {
      font-size: 13px !important;
      color: #AAB4C3 !important;
      opacity: 0.8 !important;
    }
    .gticc-form .form-control:focus {
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
    .gticc-form .onboarding-submit-btn {
      font-size: 14.5px !important;
      font-weight: 600 !important;
      letter-spacing: 0.5px;
      min-height: 50px !important;
      padding: 12px 24px !important;
      background-color: #D6A43B !important;
      border-color: #D6A43B !important;
      color: #081321 !important;
    }
    .gticc-form .onboarding-submit-btn:hover {
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
            BUSINESS &amp; CORPORATE MEMBERSHIP ONBOARDING QUESTIONNAIRE
          </h1>
          <p className="responsive-lead-text text-white-50" style={{ maxWidth: '840px', margin: '0 auto 26px auto' }}>
            International Trade Screening &amp; Commercial Matchmaking Assessment — Designed to help GTICC evaluate enterprise profile, trade objectives, commercial capabilities, target markets, and strategic bilateral collaboration opportunities.
          </p>
          <div className="gticc-actions mt-2" style={{ justifyContent: 'center' }}>
            <a href="#onboarding-form" className="btn">Begin Questionnaire</a>
            <Link to="/membership/apply" className="btn btn-ghost">Membership Apply</Link>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="onboarding-form" className="space-ptb bg-dark rounded-section gticc-questionnaire-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-9">
              {formSubmitted ? (
                <div className="onboarding-success-box">
                  <h4>Application Successfully Recorded</h4>
                  <p>
                    Thank you, <strong>{formData.authOfficerName || formData.repFullName}</strong>.
                    Your business membership onboarding application for <strong>{formData.legalEntityName}</strong> has been securely submitted and logged in the GTICC Screening Database.
                  </p>
                  {submissionReference && (
                    <p style={{ color: '#D6A43B', fontSize: '14px', fontFamily: 'monospace', margin: '12px 0' }}>
                      Official Reference ID: <strong>{submissionReference}</strong>
                    </p>
                  )}
                  <p style={{ color: '#AAB4C3', fontSize: '15px' }}>
                    Document purpose: Business Entity Trade Screening &amp; Membership Assessment.
                  </p>
                  <div className="onboarding-notice-box" style={{ maxWidth: '650px', margin: '20px auto', textAlign: 'left' }}>
                    <p style={{ margin: 0 }}>
                      <strong>Executive Review Status:</strong> Your questionnaire is now pending review by the GTICC International Trade Screening Committee. For inquiries, you may contact{' '}
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
                        const formEl = document.getElementById('onboarding-form');
                        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    Review or Modify Form
                  </button>
                </div>
              ) : (
                <form
                  className="gticc-card gticc-form gticc-questionnaire-card"
                  onSubmit={handleSubmit}
                  style={{ border: '1px solid #2A3649', padding: '36px 30px' }}
                  noValidate
                >
                  {isModifyMode && submissionReference && (
                    <div style={{ background: 'rgba(214, 164, 59, 0.12)', border: '1px solid #D6A43B', color: '#F2C45D', padding: '14px 18px', borderRadius: '6px', marginBottom: '22px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <strong>Review &amp; Modify Mode:</strong> You are editing your submitted application (<span style={{ fontFamily: 'monospace' }}>{submissionReference}</span>). All your previously submitted values have been loaded. Modify any details and click &ldquo;Update &amp; Save Changes&rdquo; below.
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
                      BUSINESS &amp; CORPORATE MEMBERSHIP ONBOARDING QUESTIONNAIRE
                    </h2>
                    <p style={{ color: '#AAB4C3', fontSize: '14.5px', margin: 0, lineHeight: 1.5 }}>
                      International Trade Screening &amp; Commercial Matchmaking Assessment
                    </p>
                  </div>

                  {/* Document Metadata Strip */}
                  <div className="onboarding-meta-grid">
                    <div className="onboarding-meta-item">
                      <strong>Document Purpose</strong>
                      Business Entity Trade Screening &amp; Membership
                    </div>
                    <div className="onboarding-meta-item">
                      <strong>Target Completion Time</strong>
                      Under 2.5 Minutes (10 Questions)
                    </div>
                    <div className="onboarding-meta-item">
                      <strong>Trade Administration</strong>
                      GTICC Global Trade &amp; Membership Division
                    </div>
                    <div className="onboarding-meta-item">
                      <strong>Deployment Format</strong>
                      Fillable Corporate Form + Google Form / Web
                    </div>
                  </div>

                  {/* Mandate Box */}
                  <div className="onboarding-notice-box">
                    <h5 style={{ color: '#D6A43B', fontSize: '14.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                      Global Trade Ecosystem Mandate
                    </h5>
                    <p style={{ margin: 0 }}>
                      GTICC operates as a strategic international commercial platform dedicated to strengthening enterprise competitiveness across border boundaries. We facilitate foreign direct investment (FDI), targeted buyer-seller matchmaking, supply chain resilience, and international trade compliance. This screening questionnaire enables our commercial desk to evaluate your operational capabilities, prioritize high-value commercial corridors, and align your enterprise with verified global trade counterparts.
                    </p>
                  </div>

                  {/* Section 1 Instructions */}
                  <div style={{ borderBottom: '1px solid #233147', paddingBottom: '16px', marginBottom: '10px' }}>
                    <h3 className="text-white mb-2" style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '0.5px' }}>
                      SECTION 1: CORPORATE MEMBERSHIP QUESTIONNAIRE
                    </h3>
                    <p style={{ color: '#F5F5F5', fontSize: '13.5px', margin: '0 0 6px 0', lineHeight: 1.6 }}>
                      This questionnaire gathers foundational data regarding your enterprise structure, commercial readiness, international market ambitions, and priority collaboration goals. The information submitted allows GTICC trade directors to identify suitable membership tiers and curated networking pathways.
                    </p>
                    <p style={{ color: '#AAB4C3', fontSize: '13px', fontStyle: 'italic', margin: 0, lineHeight: 1.55 }}>
                      &ldquo;Please complete the following 10 questions. This document can be filled out directly by enterprise executives and returned via email to{' '}
                      <a href="mailto:gticcofficial@gmail.com" className="gticc-email-link">
                        gticcofficial@gmail.com
                      </a>.&rdquo;
                    </p>
                  </div>

                  {/* Question 1 */}
                  <div className="onboarding-section-title">
                    Question 1: Registered Business Entity Name &amp; Website URL
                  </div>
                  <p className="onboarding-q-desc">
                    Provide the official registered legal name of your enterprise as filed with corporate registries, along with your primary corporate website URL for verification and profile cross-referencing.
                  </p>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="bmo-legalName" className="field-sublabel">
                        Legal Entity Name <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-legalName"
                        name="legalEntityName"
                        type="text"
                        value={formData.legalEntityName}
                        onChange={handleChange}
                        placeholder="Official registered company name"
                        required
                      />
                      {errors.legalEntityName && <p className="onboarding-error">{errors.legalEntityName}</p>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bmo-website" className="field-sublabel">
                        Corporate Website <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-website"
                        name="corporateWebsite"
                        type="url"
                        value={formData.corporateWebsite}
                        onChange={handleChange}
                        placeholder="https://www.company.com"
                        required
                      />
                      {errors.corporateWebsite && <p className="onboarding-error">{errors.corporateWebsite}</p>}
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div className="onboarding-section-title">
                    Question 2: Authorized Representative &amp; Executive Designation
                  </div>
                  <p className="onboarding-q-desc">
                    Specify the primary senior executive or commercial director authorized to act as the corporate point of contact for GTICC trade communications and onboarding assessments.
                  </p>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="bmo-repName" className="field-sublabel">
                        Representative Full Name <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-repName"
                        name="repFullName"
                        type="text"
                        value={formData.repFullName}
                        onChange={handleChange}
                        placeholder="Primary representative full name"
                        required
                      />
                      {errors.repFullName && <p className="onboarding-error">{errors.repFullName}</p>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bmo-corpTitle" className="field-sublabel">
                        Corporate Title / Role <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-corpTitle"
                        name="corporateTitle"
                        type="text"
                        value={formData.corporateTitle}
                        onChange={handleChange}
                        placeholder="e.g., Managing Director, CEO, VP International Trade"
                        required
                      />
                      {errors.corporateTitle && <p className="onboarding-error">{errors.corporateTitle}</p>}
                    </div>
                  </div>

                  {/* Question 3 */}
                  <div className="onboarding-section-title">
                    Question 3: Official Corporate Contact Information
                  </div>
                  <p className="onboarding-q-desc">
                    Provide active corporate contact coordinates, including an executive email address and mobile or WhatsApp line with international country dial code for urgent correspondence.
                  </p>
                  <div className="row g-3" style={{ position: 'relative', zIndex: 40 }}>
                    <div className="col-md-5">
                      <label htmlFor="bmo-corpEmail" className="field-sublabel">
                        Corporate Email <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-corpEmail"
                        name="corporateEmail"
                        type="email"
                        value={formData.corporateEmail}
                        onChange={handleChange}
                        placeholder="executive@company.com"
                        required
                      />
                      {errors.corporateEmail && <p className="onboarding-error">{errors.corporateEmail}</p>}
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="bmo-countryCode" className="field-sublabel">
                        Country Code <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <CountryCodeSelect
                        id="bmo-countryCode"
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
                      <label htmlFor="bmo-directPhone" className="field-sublabel">
                        Direct Phone / WhatsApp <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-directPhone"
                        name="directPhone"
                        type="tel"
                        value={formData.directPhone}
                        onChange={handleChange}
                        placeholder="Phone / WhatsApp number"
                        required
                      />
                      {errors.directPhone && <p className="onboarding-error">{errors.directPhone}</p>}
                    </div>
                  </div>

                  {/* Question 4 */}
                  <div className="onboarding-section-title">
                    Question 4: Headquarters Location &amp; Operational Footprint
                  </div>
                  <p className="onboarding-q-desc">
                    State the jurisdiction of your corporate headquarters along with secondary branches, distribution centers, or manufacturing plants to help us assess your physical supply footprint.
                  </p>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="bmo-hqCityCountry" className="field-sublabel">
                        HQ City &amp; Country <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-hqCityCountry"
                        name="hqCityCountry"
                        type="text"
                        value={formData.hqCityCountry}
                        onChange={handleChange}
                        placeholder="City, Country"
                        required
                      />
                      {errors.hqCityCountry && <p className="onboarding-error">{errors.hqCityCountry}</p>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bmo-addLocations" className="field-sublabel">
                        Additional Branch / Factory Locations
                      </label>
                      <input
                        className="form-control"
                        id="bmo-addLocations"
                        name="additionalLocations"
                        type="text"
                        value={formData.additionalLocations}
                        onChange={handleChange}
                        placeholder="Secondary regional offices, factories, ports (optional)"
                      />
                    </div>
                  </div>

                  {/* Question 5 */}
                  <div className="onboarding-section-title">
                    Question 5: Primary Industry Sector
                  </div>
                  <p className="onboarding-q-desc">
                    Select the core vertical that best encompasses your principal production, technology, or trade activities to ensure routing to the correct GTICC industry committee.
                  </p>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="bmo-industry" className="field-sublabel">
                        Primary Industry Sector <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <select
                        className="form-control"
                        id="bmo-industry"
                        name="primaryIndustrySector"
                        value={formData.primaryIndustrySector}
                        onChange={handleChange}
                        required
                      >
                        <option value="">— Select Industry Sector —</option>
                        {industrySectorOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.primaryIndustrySector && <p className="onboarding-error">{errors.primaryIndustrySector}</p>}
                    </div>
                    {formData.primaryIndustrySector === 'Other Sector Domain' && (
                      <div className="col-12">
                        <label htmlFor="bmo-otherSector" className="field-sublabel">
                          Other Sector Domain: <span style={{ color: '#D6A43B' }}>*</span>
                        </label>
                        <input
                          className="form-control"
                          id="bmo-otherSector"
                          name="otherIndustrySector"
                          type="text"
                          value={formData.otherIndustrySector}
                          onChange={handleChange}
                          placeholder="Please specify your operational sector domain"
                          required
                        />
                        {errors.otherIndustrySector && <p className="onboarding-error">{errors.otherIndustrySector}</p>}
                      </div>
                    )}
                  </div>

                  {/* Question 6 */}
                  <div className="onboarding-section-title">
                    Question 6: Primary Business Model &amp; Core Offering
                  </div>
                  <p className="onboarding-q-desc">
                    Choose the commercial operational model that reflects how your organization generates value, delivers products or services, and engages commercial buyers in global commerce.
                  </p>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="bmo-bizModel" className="field-sublabel">
                        Primary Business Model &amp; Core Offering <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <select
                        className="form-control"
                        id="bmo-bizModel"
                        name="primaryBusinessModel"
                        value={formData.primaryBusinessModel}
                        onChange={handleChange}
                        required
                      >
                        <option value="">— Select Business Model —</option>
                        {businessModelOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.primaryBusinessModel && <p className="onboarding-error">{errors.primaryBusinessModel}</p>}
                    </div>
                  </div>

                  {/* Question 7 */}
                  <div className="onboarding-section-title">
                    Question 7: Approximate Annual Turnover / Revenue (USD)
                  </div>
                  <p className="onboarding-q-desc">
                    Select your estimated gross annual revenue bracket. This metric is treated strictly confidentially and assists in placing your entity in the most relevant membership cohort.
                  </p>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="bmo-turnover" className="field-sublabel">
                        Approximate Annual Turnover / Revenue (USD) <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <select
                        className="form-control"
                        id="bmo-turnover"
                        name="annualTurnover"
                        value={formData.annualTurnover}
                        onChange={handleChange}
                        required
                      >
                        <option value="">— Select Annual Turnover Tier —</option>
                        {turnoverOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.annualTurnover && <p className="onboarding-error">{errors.annualTurnover}</p>}
                    </div>
                  </div>

                  {/* Question 8 */}
                  <div className="onboarding-section-title">
                    Question 8: Export-Import (EXIM) Licensing &amp; International Trade Status
                  </div>
                  <p className="onboarding-q-desc">
                    Indicate your current cross-border regulatory standing and export documentation capability so we can tailor commercial facilitation and compliance assistance accordingly.
                  </p>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="bmo-exim" className="field-sublabel">
                        Export-Import (EXIM) Licensing &amp; International Trade Status <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <select
                        className="form-control"
                        id="bmo-exim"
                        name="eximStatus"
                        value={formData.eximStatus}
                        onChange={handleChange}
                        required
                      >
                        <option value="">— Select Regulatory EXIM Status —</option>
                        {eximStatusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.eximStatus && <p className="onboarding-error">{errors.eximStatus}</p>}
                    </div>
                  </div>

                  {/* Question 9 */}
                  <div className="onboarding-section-title">
                    Question 9: Target International Markets &amp; Expansion Corridors
                  </div>
                  <p className="onboarding-q-desc">
                    Select the key geographic regions where your enterprise is actively seeking commercial expansion, distribution partnerships, buyer acquisitions, or supplier relationships.
                  </p>
                  <div className="row g-3">
                    <div className="col-12">
                      <label id="bmo-targetMarkets-heading" className="field-sublabel">
                        Target International Markets <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <div className="onboarding-check-group mt-1">
                        {targetMarketOptions.map((opt) => {
                          const checked = formData.targetMarkets.includes(opt);
                          return (
                            <label key={opt} className={`onboarding-check-label${checked ? ' checked' : ''}`}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleTargetMarketsToggle(opt)}
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.targetMarkets && <p className="onboarding-error">{errors.targetMarkets}</p>}
                    </div>
                  </div>

                  {/* Question 10 */}
                  <div className="onboarding-section-title">
                    Question 10: Primary Trade &amp; Membership Objective with GTICC
                  </div>
                  <p className="onboarding-q-desc">
                    Identify up to two focal business priorities that will drive your engagement with GTICC, allowing our bilateral desk to structure targeted matchmaking and networking opportunities.
                  </p>
                  <div className="row g-3">
                    <div className="col-12">
                      <label id="bmo-tradeObjectives-heading" className="field-sublabel">
                        Primary Trade &amp; Membership Objectives (Max 2) <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <div className="onboarding-check-group mt-1">
                        {tradeObjectiveOptions.map((opt) => {
                          const checked = formData.tradeObjectives.includes(opt);
                          const disabled = !checked && formData.tradeObjectives.length >= 2;
                          return (
                            <label
                              key={opt}
                              className={`onboarding-check-label${checked ? ' checked' : ''}`}
                              style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleTradeObjectivesToggle(opt)}
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.tradeObjectives && <p className="onboarding-error">{errors.tradeObjectives}</p>}
                    </div>
                  </div>

                  {/* Profile & Supporting Documents */}
                  <div className="onboarding-section-title" style={{ marginTop: '40px' }}>
                    Profile &amp; Supporting Documents
                  </div>
                  <p className="onboarding-q-desc" style={{ marginBottom: '14px' }}>
                    Upload supporting documentation for your enterprise profile and authorized representative. Both uploads are strictly optional and assist the GTICC screening desk in expediting member vetting.
                  </p>
                  <div className="row g-3">
                    {/* Profile Photograph */}
                    <div className="col-md-6">
                      <label className="field-sublabel">
                        Profile Photograph <span style={{ color: '#AAB4C3', fontWeight: 'normal', fontSize: '12px' }}>(Optional)</span>
                      </label>
                      <input
                        type="file"
                        id="bmo-profilePhoto-input"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload('profilePhoto', e.target.files?.[0])}
                      />
                      {!documents.profilePhoto ? (
                        <div
                          className="onboarding-upload-dropzone"
                          onClick={() => document.getElementById('bmo-profilePhoto-input')?.click()}
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
                              onClick={() => document.getElementById('bmo-profilePhoto-input')?.click()}
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
                        id="bmo-professionalCert-input"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload('professionalCert', e.target.files?.[0])}
                      />
                      {!documents.professionalCert ? (
                        <div
                          className="onboarding-upload-dropzone"
                          onClick={() => document.getElementById('bmo-professionalCert-input')?.click()}
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
                              onClick={() => document.getElementById('bmo-professionalCert-input')?.click()}
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

                  {/* Corporate Authorization & Submission */}
                  <div className="onboarding-section-title" style={{ marginTop: '40px' }}>
                    CORPORATE AUTHORIZATION &amp; SUBMISSION
                  </div>
                  <p className="onboarding-q-desc" style={{ marginBottom: '12px' }}>
                    This section verifies that this onboarding submission is submitted by an authorized officer with the formal mandate to represent the legal entity in trade and commercial matchmaking proceedings.
                  </p>
                  <div className="onboarding-notice-box" style={{ background: '#0D1B2A' }}>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#ffffff' }}>
                      &ldquo;The undersigned affirms that they are an authorized corporate signatory empowered to represent the applicant entity for GTICC membership and trade matchmaking inquiries.&rdquo;
                    </p>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="bmo-authOfficer" className="field-sublabel">
                        Authorized Officer Name <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-authOfficer"
                        name="authOfficerName"
                        type="text"
                        value={formData.authOfficerName}
                        onChange={handleChange}
                        placeholder="Signatory legal name"
                        required
                      />
                      {errors.authOfficerName && <p className="onboarding-error">{errors.authOfficerName}</p>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bmo-authTitle" className="field-sublabel">
                        Corporate Title <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-authTitle"
                        name="authCorporateTitle"
                        type="text"
                        value={formData.authCorporateTitle}
                        onChange={handleChange}
                        placeholder="e.g., Chief Executive Officer, Authorized Director"
                        required
                      />
                      {errors.authCorporateTitle && <p className="onboarding-error">{errors.authCorporateTitle}</p>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bmo-authEmail" className="field-sublabel">
                        Corporate Email <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-authEmail"
                        name="authCorporateEmail"
                        type="email"
                        value={formData.authCorporateEmail}
                        onChange={handleChange}
                        placeholder="signatory@company.com"
                        required
                      />
                      {errors.authCorporateEmail && <p className="onboarding-error">{errors.authCorporateEmail}</p>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bmo-authDate" className="field-sublabel">
                        Submission Date <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-authDate"
                        name="authSubmissionDate"
                        type="date"
                        value={formData.authSubmissionDate}
                        onChange={handleChange}
                        required
                      />
                      {errors.authSubmissionDate && <p className="onboarding-error">{errors.authSubmissionDate}</p>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="bmo-signature" className="field-sublabel">
                        Authorized Signature &amp; Company Seal <span style={{ color: '#D6A43B' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        id="bmo-signature"
                        name="authSignatureSeal"
                        type="text"
                        value={formData.authSignatureSeal}
                        onChange={handleChange}
                        placeholder="Type full legal name and corporate seal reference / signatory designation"
                        required
                      />
                      {errors.authSignatureSeal && <p className="onboarding-error">{errors.authSignatureSeal}</p>}
                    </div>

                    <div className="col-12 mt-2">
                      <label id="bmo-affirmation-label" className="onboarding-decl-label">
                        <input
                          type="checkbox"
                          name="affirmation"
                          checked={formData.affirmation}
                          onChange={handleChange}
                          required
                        />
                        <span>
                          The undersigned affirms that they are an authorized corporate signatory empowered to represent the applicant entity for GTICC membership and trade matchmaking inquiries.
                        </span>
                      </label>
                      {errors.affirmation && <p className="onboarding-error">{errors.affirmation}</p>}
                    </div>

                    {/* Mandatory Legal Consent Checkbox 1: Terms of Use */}
                    <div className="col-12 mt-2">
                      <label id="bmo-terms-label" className="onboarding-decl-label">
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
                            to="/terms-of-use?from=business&return=/business-onboarding%23bmo-terms-label"
                            style={{ color: '#D4AF37', textDecoration: 'underline', fontWeight: 600 }}
                            onClick={() => {
                              try {
                                sessionStorage.setItem('gticc_bmo_draft', JSON.stringify(formData));
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
                      <label id="bmo-privacy-label" className="onboarding-decl-label">
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
                            to="/privacy-policy?from=business&return=/business-onboarding%23bmo-privacy-label"
                            style={{ color: '#D4AF37', textDecoration: 'underline', fontWeight: 600 }}
                            onClick={() => {
                              try {
                                sessionStorage.setItem('gticc_bmo_draft', JSON.stringify(formData));
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
                          ? (isModifyMode ? 'Updating Application in Database...' : 'Recording Submission in Database...')
                          : (isModifyMode ? 'Update & Save Changes' : 'Submit Business Membership Questionnaire')}
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
              <strong>Disclaimer:</strong> GTICC acts as a strategic global catalyst and trade facilitator. Membership provides access to trade networking, commercial visibility, bilateral delegations, and matchmaking introductions. GTICC does not guarantee capital funding, trade contracts, or regulatory approvals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
