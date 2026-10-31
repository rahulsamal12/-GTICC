import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid official email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const businessApplicationSchema = z.object({
  legalEntityName: z.string().min(2, 'Legal Entity Name is required'),
  corporateWebsite: z.string().min(3, 'Corporate Website URL is required'),
  repFullName: z.string().min(2, 'Representative Full Name is required'),
  corporateTitle: z.string().min(2, 'Corporate Title is required'),
  corporateEmail: z.string().email('Valid corporate email is required'),
  countryCode: z.string().min(1, 'Country code is required'),
  directPhone: z.string().min(5, 'Valid direct phone number is required'),
  hqCityCountry: z.string().min(2, 'Headquarters location is required'),
  additionalLocations: z.string().optional().nullable(),
  primaryIndustrySector: z.string().min(2, 'Industry sector is required'),
  otherIndustrySector: z.string().optional().nullable(),
  primaryBusinessModel: z.string().min(2, 'Business model is required'),
  annualTurnover: z.string().min(2, 'Annual turnover tier is required'),
  eximStatus: z.string().min(2, 'EXIM status is required'),
  targetMarkets: z.array(z.string()).min(1, 'Select at least one target market'),
  tradeObjectives: z.array(z.string()).min(1, 'Select at least one trade objective').max(2, 'Select maximum 2 trade objectives'),
  authOfficerName: z.string().min(2, 'Authorized Officer Name is required'),
  authCorporateTitle: z.string().min(2, 'Authorized Corporate Title is required'),
  authCorporateEmail: z.string().email('Valid authorized corporate email is required'),
  authSubmissionDate: z.string().min(2, 'Submission date is required'),
  authSignatureSeal: z.string().min(2, 'Signature or seal identifier is required'),
  affirmation: z.boolean().refine(val => val === true, 'Affirmation of accuracy is strictly required'),
});

export const leadershipApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  officialEmail: z.string().email('Valid official email is required'),
  countryCode: z.string().min(1, 'Country code is required'),
  mobileWhatsApp: z.string().min(5, 'Direct phone or WhatsApp is required'),
  cityCountry: z.string().min(2, 'Location is required'),
  timeZoneGmt: z.string().min(1, 'Time zone is required'),
  currentDesignation: z.string().min(2, 'Designation is required'),
  organizationFirm: z.string().min(2, 'Organization / Firm is required'),
  website: z.string().optional().nullable(),
  primaryIndustryDomain: z.string().min(2, 'Industry domain is required'),
  otherIndustryDomain: z.string().optional().nullable(),
  strategicEngagement: z.array(z.string()).min(1, 'Select at least one engagement role').max(2, 'Select maximum 2 engagement roles'),
  geographicMarkets: z.array(z.string()).min(1, 'Select at least one geographic market'),
  linkedInUrl: z.string().optional().nullable(),
  executiveSummary: z.string().min(10, 'Executive summary is required'),
  candidateName: z.string().min(2, 'Attesting candidate name is required'),
  attestationDate: z.string().min(2, 'Attestation date is required'),
  digitalSignature: z.string().min(2, 'Digital signature is required'),
  attestationOfficialEmail: z.string().email('Valid attestation official email is required'),
  attestationCheck: z.boolean().refine(val => val === true, 'Attestation acknowledgment is strictly required'),
});

export const reviewStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
  note: z.string().optional().nullable(),
});
