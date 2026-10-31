/**
 * Comprehensive Time Zone Dataset & Utilities
 * Formats timezones accurately with IANA identifier, country/city, GMT/UTC offset, and seasonal adjustment.
 */

// Mapping of common IANA timezones to friendly display details & country
export const timezoneMetadata = {
  // Asia
  'Asia/Kolkata': { primaryName: 'India', city: 'Kolkata', country: 'India', countryCode: 'IN', popular: true },
  'Asia/Dubai': { primaryName: 'Dubai', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', popular: true },
  'Asia/Singapore': { primaryName: 'Singapore', city: 'Singapore', country: 'Singapore', countryCode: 'SG', popular: true },
  'Asia/Tokyo': { primaryName: 'Tokyo', city: 'Tokyo', country: 'Japan', countryCode: 'JP', popular: true },
  'Asia/Hong_Kong': { primaryName: 'Hong Kong', city: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', popular: true },
  'Asia/Shanghai': { primaryName: 'Shanghai / Beijing', city: 'Shanghai', country: 'China', countryCode: 'CN', popular: true },
  'Asia/Bangkok': { primaryName: 'Bangkok', city: 'Bangkok', country: 'Thailand', countryCode: 'TH', popular: true },
  'Asia/Jakarta': { primaryName: 'Jakarta', city: 'Jakarta', country: 'Indonesia', countryCode: 'ID', popular: true },
  'Asia/Seoul': { primaryName: 'Seoul', city: 'Seoul', country: 'South Korea', countryCode: 'KR', popular: true },
  'Asia/Riyadh': { primaryName: 'Riyadh', city: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', popular: true },
  'Asia/Qatar': { primaryName: 'Doha', city: 'Doha', country: 'Qatar', countryCode: 'QA', popular: true },
  'Asia/Kuala_Lumpur': { primaryName: 'Kuala Lumpur', city: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', popular: true },
  'Asia/Manila': { primaryName: 'Manila', city: 'Manila', country: 'Philippines', countryCode: 'PH', popular: true },
  'Asia/Dhaka': { primaryName: 'Dhaka', city: 'Dhaka', country: 'Bangladesh', countryCode: 'BD', popular: true },
  'Asia/Karachi': { primaryName: 'Karachi', city: 'Karachi', country: 'Pakistan', countryCode: 'PK', popular: true },
  'Asia/Colombo': { primaryName: 'Colombo', city: 'Colombo', country: 'Sri Lanka', countryCode: 'LK', popular: true },
  'Asia/Kathmandu': { primaryName: 'Kathmandu', city: 'Kathmandu', country: 'Nepal', countryCode: 'NP' },
  'Asia/Muscat': { primaryName: 'Muscat', city: 'Muscat', country: 'Oman', countryCode: 'OM' },
  'Asia/Kuwait': { primaryName: 'Kuwait City', city: 'Kuwait', country: 'Kuwait', countryCode: 'KW' },
  'Asia/Bahrain': { primaryName: 'Manama', city: 'Bahrain', country: 'Bahrain', countryCode: 'BH' },
  'Asia/Beirut': { primaryName: 'Beirut', city: 'Beirut', country: 'Lebanon', countryCode: 'LB' },
  'Asia/Amman': { primaryName: 'Amman', city: 'Amman', country: 'Jordan', countryCode: 'JO' },
  'Asia/Jerusalem': { primaryName: 'Jerusalem / Tel Aviv', city: 'Jerusalem', country: 'Israel', countryCode: 'IL' },
  'Asia/Taipei': { primaryName: 'Taipei', city: 'Taipei', country: 'Taiwan', countryCode: 'TW' },
  'Asia/Ho_Chi_Minh': { primaryName: 'Ho Chi Minh City', city: 'Ho Chi Minh', country: 'Vietnam', countryCode: 'VN' },
  'Asia/Tashkent': { primaryName: 'Tashkent', city: 'Tashkent', country: 'Uzbekistan', countryCode: 'UZ' },
  'Asia/Almaty': { primaryName: 'Almaty', city: 'Almaty', country: 'Kazakhstan', countryCode: 'KZ' },
  'Asia/Baku': { primaryName: 'Baku', city: 'Baku', country: 'Azerbaijan', countryCode: 'AZ' },
  'Asia/Tbilisi': { primaryName: 'Tbilisi', city: 'Tbilisi', country: 'Georgia', countryCode: 'GE' },
  'Asia/Yerevan': { primaryName: 'Yerevan', city: 'Yerevan', country: 'Armenia', countryCode: 'AM' },

  // Europe
  'Europe/London': { primaryName: 'London', city: 'London', country: 'United Kingdom', countryCode: 'GB', popular: true },
  'Europe/Paris': { primaryName: 'Paris', city: 'Paris', country: 'France', countryCode: 'FR', popular: true },
  'Europe/Berlin': { primaryName: 'Berlin / Frankfurt', city: 'Berlin', country: 'Germany', countryCode: 'DE', popular: true },
  'Europe/Zurich': { primaryName: 'Zurich / Geneva', city: 'Zurich', country: 'Switzerland', countryCode: 'CH', popular: true },
  'Europe/Amsterdam': { primaryName: 'Amsterdam', city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', popular: true },
  'Europe/Brussels': { primaryName: 'Brussels', city: 'Brussels', country: 'Belgium', countryCode: 'BE', popular: true },
  'Europe/Rome': { primaryName: 'Rome / Milan', city: 'Rome', country: 'Italy', countryCode: 'IT', popular: true },
  'Europe/Madrid': { primaryName: 'Madrid / Barcelona', city: 'Madrid', country: 'Spain', countryCode: 'ES', popular: true },
  'Europe/Dublin': { primaryName: 'Dublin', city: 'Dublin', country: 'Ireland', countryCode: 'IE', popular: true },
  'Europe/Stockholm': { primaryName: 'Stockholm', city: 'Stockholm', country: 'Sweden', countryCode: 'SE', popular: true },
  'Europe/Oslo': { primaryName: 'Oslo', city: 'Oslo', country: 'Norway', countryCode: 'NO' },
  'Europe/Copenhagen': { primaryName: 'Copenhagen', city: 'Copenhagen', country: 'Denmark', countryCode: 'DK' },
  'Europe/Helsinki': { primaryName: 'Helsinki', city: 'Helsinki', country: 'Finland', countryCode: 'FI' },
  'Europe/Vienna': { primaryName: 'Vienna', city: 'Vienna', country: 'Austria', countryCode: 'AT' },
  'Europe/Warsaw': { primaryName: 'Warsaw', city: 'Warsaw', country: 'Poland', countryCode: 'PL' },
  'Europe/Prague': { primaryName: 'Prague', city: 'Prague', country: 'Czech Republic', countryCode: 'CZ' },
  'Europe/Budapest': { primaryName: 'Budapest', city: 'Budapest', country: 'Hungary', countryCode: 'HU' },
  'Europe/Athens': { primaryName: 'Athens', city: 'Athens', country: 'Greece', countryCode: 'GR' },
  'Europe/Lisbon': { primaryName: 'Lisbon', city: 'Lisbon', country: 'Portugal', countryCode: 'PT' },
  'Europe/Istanbul': { primaryName: 'Istanbul', city: 'Istanbul', country: 'Turkey', countryCode: 'TR', popular: true },
  'Europe/Moscow': { primaryName: 'Moscow', city: 'Moscow', country: 'Russia', countryCode: 'RU', popular: true },
  'Europe/Kyiv': { primaryName: 'Kyiv', city: 'Kyiv', country: 'Ukraine', countryCode: 'UA' },
  'Europe/Bucharest': { primaryName: 'Bucharest', city: 'Bucharest', country: 'Romania', countryCode: 'RO' },
  'Europe/Sofia': { primaryName: 'Sofia', city: 'Sofia', country: 'Bulgaria', countryCode: 'BG' },
  'Europe/Belgrade': { primaryName: 'Belgrade', city: 'Belgrade', country: 'Serbia', countryCode: 'RS' },
  'Europe/Luxembourg': { primaryName: 'Luxembourg', city: 'Luxembourg', country: 'Luxembourg', countryCode: 'LU' },
  'Europe/Monaco': { primaryName: 'Monaco', city: 'Monaco', country: 'Monaco', countryCode: 'MC' },

  // Americas - North
  'America/New_York': { primaryName: 'New York', city: 'New York', country: 'United States', countryCode: 'US', popular: true },
  'America/Chicago': { primaryName: 'Chicago', city: 'Chicago', country: 'United States', countryCode: 'US', popular: true },
  'America/Denver': { primaryName: 'Denver', city: 'Denver', country: 'United States', countryCode: 'US', popular: true },
  'America/Los_Angeles': { primaryName: 'Los Angeles / San Francisco', city: 'Los Angeles', country: 'United States', countryCode: 'US', popular: true },
  'America/Toronto': { primaryName: 'Toronto / Ottawa', city: 'Toronto', country: 'Canada', countryCode: 'CA', popular: true },
  'America/Vancouver': { primaryName: 'Vancouver', city: 'Vancouver', country: 'Canada', countryCode: 'CA', popular: true },
  'America/Montreal': { primaryName: 'Montreal', city: 'Montreal', country: 'Canada', countryCode: 'CA' },
  'America/Halifax': { primaryName: 'Halifax (Atlantic)', city: 'Halifax', country: 'Canada', countryCode: 'CA' },
  'America/St_Johns': { primaryName: "St. John's (Newfoundland)", city: "St. John's", country: 'Canada', countryCode: 'CA' },
  'America/Phoenix': { primaryName: 'Phoenix (Arizona)', city: 'Phoenix', country: 'United States', countryCode: 'US' },
  'America/Anchorage': { primaryName: 'Anchorage (Alaska)', city: 'Anchorage', country: 'United States', countryCode: 'US' },
  'Pacific/Honolulu': { primaryName: 'Honolulu (Hawaii)', city: 'Honolulu', country: 'United States', countryCode: 'US' },
  'America/Mexico_City': { primaryName: 'Mexico City', city: 'Mexico City', country: 'Mexico', countryCode: 'MX', popular: true },

  // Americas - Central & South
  'America/Sao_Paulo': { primaryName: 'Sao Paulo / Rio', city: 'Sao Paulo', country: 'Brazil', countryCode: 'BR', popular: true },
  'America/Buenos_Aires': { primaryName: 'Buenos Aires', city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', popular: true },
  'America/Santiago': { primaryName: 'Santiago', city: 'Santiago', country: 'Chile', countryCode: 'CL' },
  'America/Bogota': { primaryName: 'Bogota', city: 'Bogota', country: 'Colombia', countryCode: 'CO', popular: true },
  'America/Lima': { primaryName: 'Lima', city: 'Lima', country: 'Peru', countryCode: 'PE' },
  'America/Panama': { primaryName: 'Panama City', city: 'Panama', country: 'Panama', countryCode: 'PA' },
  'America/Caracas': { primaryName: 'Caracas', city: 'Caracas', country: 'Venezuela', countryCode: 'VE' },
  'America/Montevideo': { primaryName: 'Montevideo', city: 'Montevideo', country: 'Uruguay', countryCode: 'UY' },

  // Africa
  'Africa/Johannesburg': { primaryName: 'Johannesburg / Cape Town', city: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', popular: true },
  'Africa/Cairo': { primaryName: 'Cairo', city: 'Cairo', country: 'Egypt', countryCode: 'EG', popular: true },
  'Africa/Lagos': { primaryName: 'Lagos', city: 'Lagos', country: 'Nigeria', countryCode: 'NG', popular: true },
  'Africa/Nairobi': { primaryName: 'Nairobi', city: 'Nairobi', country: 'Kenya', countryCode: 'KE', popular: true },
  'Africa/Casablanca': { primaryName: 'Casablanca', city: 'Casablanca', country: 'Morocco', countryCode: 'MA' },
  'Africa/Accra': { primaryName: 'Accra', city: 'Accra', country: 'Ghana', countryCode: 'GH' },
  'Africa/Addis_Ababa': { primaryName: 'Addis Ababa', city: 'Addis Ababa', country: 'Ethiopia', countryCode: 'ET' },
  'Africa/Algiers': { primaryName: 'Algiers', city: 'Algiers', country: 'Algeria', countryCode: 'DZ' },
  'Africa/Tunis': { primaryName: 'Tunis', city: 'Tunis', country: 'Tunisia', countryCode: 'TN' },

  // Oceania / Australia
  'Australia/Sydney': { primaryName: 'Sydney', city: 'Sydney', country: 'Australia', countryCode: 'AU', popular: true },
  'Australia/Melbourne': { primaryName: 'Melbourne', city: 'Melbourne', country: 'Australia', countryCode: 'AU', popular: true },
  'Australia/Brisbane': { primaryName: 'Brisbane', city: 'Brisbane', country: 'Australia', countryCode: 'AU' },
  'Australia/Perth': { primaryName: 'Perth', city: 'Perth', country: 'Australia', countryCode: 'AU' },
  'Australia/Adelaide': { primaryName: 'Adelaide', city: 'Adelaide', country: 'Australia', countryCode: 'AU' },
  'Pacific/Auckland': { primaryName: 'Auckland / Wellington', city: 'Auckland', country: 'New Zealand', countryCode: 'NZ', popular: true },
  'Pacific/Fiji': { primaryName: 'Suva (Fiji)', city: 'Suva', country: 'Fiji', countryCode: 'FJ' },
};

/**
 * Calculates current GMT offset for a given IANA timezone and date
 */
export function getGmtOffset(ianaTimeZone, date = new Date()) {
  try {
    const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' });
    const tzStr = date.toLocaleString('en-US', { timeZone: ianaTimeZone });
    const diffMinutes = Math.round((new Date(tzStr) - new Date(utcStr)) / 60000);
    const sign = diffMinutes >= 0 ? '+' : '-';
    const abs = Math.abs(diffMinutes);
    const hours = String(Math.floor(abs / 60)).padStart(2, '0');
    const mins = String(abs % 60).padStart(2, '0');
    return {
      formatted: `GMT${sign}${hours}:${mins}`,
      totalMinutes: diffMinutes,
    };
  } catch {
    return { formatted: 'GMT+00:00', totalMinutes: 0 };
  }
}

/**
 * Determines whether this timezone observes seasonal Daylight Saving Time adjustments
 */
export function observesDaylightSaving(ianaTimeZone, year = new Date().getFullYear()) {
  try {
    const janDate = new Date(year, 0, 15);
    const julDate = new Date(year, 6, 15);
    const janUtc = janDate.toLocaleString('en-US', { timeZone: 'UTC' });
    const janTz = janDate.toLocaleString('en-US', { timeZone: ianaTimeZone });
    const janDiff = Math.round((new Date(janTz) - new Date(janUtc)) / 60000);

    const julUtc = julDate.toLocaleString('en-US', { timeZone: 'UTC' });
    const julTz = julDate.toLocaleString('en-US', { timeZone: ianaTimeZone });
    const julDiff = Math.round((new Date(julTz) - new Date(julUtc)) / 60000);

    return janDiff !== julDiff;
  } catch {
    return false;
  }
}

/**
 * Build complete list of timezone options
 */
export function getTimezoneOptions(date = new Date()) {
  // Get all system supported timezones or fallback to metadata keys
  let allIana = [];
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
      allIana = Intl.supportedValuesOf('timeZone');
    }
  } catch {
    allIana = [];
  }

  if (!allIana || allIana.length === 0) {
    allIana = Object.keys(timezoneMetadata);
  }

  // Ensure major prioritized timezones are included
  const majorSet = new Set(Object.keys(timezoneMetadata));
  allIana.forEach((tz) => majorSet.add(tz));

  const list = [];
  majorSet.forEach((iana) => {
    // Skip deprecated / generic 3-letter or system zones
    if (!iana.includes('/') && iana !== 'UTC') return;

    const meta = timezoneMetadata[iana] || {};
    const parts = iana.split('/');
    const city = meta.city || parts[parts.length - 1].replace(/_/g, ' ');
    const region = parts[0];
    const country = meta.country || (region === 'America' ? 'Americas' : region);
    const primaryName = meta.primaryName || city;

    const offset = getGmtOffset(iana, date);
    const hasDst = observesDaylightSaving(iana, date.getFullYear());
    const seasonalText = hasDst ? ', seasonal adjustment' : '';

    // Standard requested format: "City / Country — IANA (GMT±HH:MM, seasonal adjustment)"
    // e.g.: "India — Asia/Kolkata (GMT+05:30)"
    // e.g.: "London — Europe/London (GMT+00:00, seasonal adjustment)"
    const label = `${primaryName} — ${iana} (${offset.formatted}${seasonalText})`;
    const shortLabel = `${iana} (${offset.formatted})`;

    // Value saved: `${iana} — ${offset.formatted}` so backend & admin panel get both
    const value = `${iana} (${offset.formatted})`;

    list.push({
      iana,
      primaryName,
      city,
      country,
      region,
      gmtOffset: offset.formatted,
      totalMinutes: offset.totalMinutes,
      hasDst,
      label,
      shortLabel,
      value,
      isPopular: !!meta.popular,
    });
  });

  // Sort list: Popular zones first (ordered by offset), then other zones by offset
  list.sort((a, b) => {
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    if (a.totalMinutes !== b.totalMinutes) {
      return a.totalMinutes - b.totalMinutes;
    }
    return a.label.localeCompare(b.label);
  });

  return list;
}

/**
 * Auto-suggests a timezone based on user's entered city and country text.
 * Default for 'Bhubaneswar, India' or 'India' is 'Asia/Kolkata'.
 */
export function suggestTimezoneFromLocation(cityCountryStr) {
  if (!cityCountryStr || typeof cityCountryStr !== 'string') return null;
  const q = cityCountryStr.trim().toLowerCase();

  // Explicit city/country mappings
  const locationLookup = [
    // India & South Asia
    { match: ['bhubaneswar', 'odisha', 'kolkata', 'calcutta', 'delhi', 'new delhi', 'mumbai', 'bombay', 'bangalore', 'bengaluru', 'chennai', 'hyderabad', 'pune', 'ahmedabad', 'india'], tz: 'Asia/Kolkata' },
    { match: ['dhaka', 'bangladesh'], tz: 'Asia/Dhaka' },
    { match: ['karachi', 'lahore', 'islamabad', 'pakistan'], tz: 'Asia/Karachi' },
    { match: ['colombo', 'sri lanka'], tz: 'Asia/Colombo' },
    { match: ['kathmandu', 'nepal'], tz: 'Asia/Kathmandu' },

    // Middle East / Gulf
    { match: ['dubai', 'abu dhabi', 'sharjah', 'uae', 'united arab emirates'], tz: 'Asia/Dubai' },
    { match: ['riyadh', 'jeddah', 'saudi arabia', 'saudi'], tz: 'Asia/Riyadh' },
    { match: ['doha', 'qatar'], tz: 'Asia/Qatar' },
    { match: ['kuwait'], tz: 'Asia/Kuwait' },
    { match: ['manama', 'bahrain'], tz: 'Asia/Bahrain' },
    { match: ['muscat', 'oman'], tz: 'Asia/Muscat' },
    { match: ['tel aviv', 'jerusalem', 'israel'], tz: 'Asia/Jerusalem' },
    { match: ['beirut', 'lebanon'], tz: 'Asia/Beirut' },
    { match: ['amman', 'jordan'], tz: 'Asia/Amman' },

    // Europe & UK
    { match: ['london', 'manchester', 'birmingham', 'edinburgh', 'glasgow', 'uk', 'united kingdom', 'england', 'scotland'], tz: 'Europe/London' },
    { match: ['paris', 'lyon', 'marseille', 'france'], tz: 'Europe/Paris' },
    { match: ['berlin', 'frankfurt', 'munich', 'hamburg', 'germany'], tz: 'Europe/Berlin' },
    { match: ['zurich', 'geneva', 'bern', 'switzerland'], tz: 'Europe/Zurich' },
    { match: ['amsterdam', 'rotterdam', 'netherlands', 'holland'], tz: 'Europe/Amsterdam' },
    { match: ['brussels', 'belgium'], tz: 'Europe/Brussels' },
    { match: ['rome', 'milan', 'italy'], tz: 'Europe/Rome' },
    { match: ['madrid', 'barcelona', 'spain'], tz: 'Europe/Madrid' },
    { match: ['dublin', 'ireland'], tz: 'Europe/Dublin' },
    { match: ['stockholm', 'sweden'], tz: 'Europe/Stockholm' },
    { match: ['oslo', 'norway'], tz: 'Europe/Oslo' },
    { match: ['copenhagen', 'denmark'], tz: 'Europe/Copenhagen' },
    { match: ['helsinki', 'finland'], tz: 'Europe/Helsinki' },
    { match: ['vienna', 'austria'], tz: 'Europe/Vienna' },
    { match: ['warsaw', 'poland'], tz: 'Europe/Warsaw' },
    { match: ['prague', 'czech'], tz: 'Europe/Prague' },
    { match: ['budapest', 'hungary'], tz: 'Europe/Budapest' },
    { match: ['athens', 'greece'], tz: 'Europe/Athens' },
    { match: ['lisbon', 'portugal'], tz: 'Europe/Lisbon' },
    { match: ['istanbul', 'ankara', 'turkey'], tz: 'Europe/Istanbul' },
    { match: ['moscow', 'saint petersburg', 'russia'], tz: 'Europe/Moscow' },
    { match: ['kyiv', 'kiev', 'ukraine'], tz: 'Europe/Kyiv' },

    // North America
    { match: ['new york', 'nyc', 'boston', 'philadelphia', 'washington', 'dc', 'miami', 'atlanta'], tz: 'America/New_York' },
    { match: ['chicago', 'houston', 'dallas', 'austin', 'minneapolis'], tz: 'America/Chicago' },
    { match: ['denver', 'salt lake', 'colorado'], tz: 'America/Denver' },
    { match: ['los angeles', 'la', 'san francisco', 'sf', 'seattle', 'san diego', 'california', 'silicon valley'], tz: 'America/Los_Angeles' },
    { match: ['phoenix', 'arizona'], tz: 'America/Phoenix' },
    { match: ['toronto', 'ottawa', 'ontario', 'canada'], tz: 'America/Toronto' },
    { match: ['vancouver', 'calgary', 'british columbia', 'alberta'], tz: 'America/Vancouver' },
    { match: ['montreal', 'quebec'], tz: 'America/Montreal' },
    { match: ['mexico city', 'mexico'], tz: 'America/Mexico_City' },

    // Asia-Pacific
    { match: ['singapore'], tz: 'Asia/Singapore' },
    { match: ['tokyo', 'osaka', 'japan'], tz: 'Asia/Tokyo' },
    { match: ['hong kong', 'hk'], tz: 'Asia/Hong_Kong' },
    { match: ['shanghai', 'beijing', 'shenzhen', 'guangzhou', 'china'], tz: 'Asia/Shanghai' },
    { match: ['seoul', 'korea'], tz: 'Asia/Seoul' },
    { match: ['bangkok', 'thailand'], tz: 'Asia/Bangkok' },
    { match: ['kuala lumpur', 'malaysia'], tz: 'Asia/Kuala_Lumpur' },
    { match: ['jakarta', 'indonesia'], tz: 'Asia/Jakarta' },
    { match: ['manila', 'philippines'], tz: 'Asia/Manila' },
    { match: ['taipei', 'taiwan'], tz: 'Asia/Taipei' },
    { match: ['ho chi minh', 'hanoi', 'vietnam'], tz: 'Asia/Ho_Chi_Minh' },

    // Australia & New Zealand
    { match: ['sydney', 'new south wales', 'australia'], tz: 'Australia/Sydney' },
    { match: ['melbourne', 'victoria'], tz: 'Australia/Melbourne' },
    { match: ['brisbane', 'queensland'], tz: 'Australia/Brisbane' },
    { match: ['perth', 'western australia'], tz: 'Australia/Perth' },
    { match: ['adelaide', 'south australia'], tz: 'Australia/Adelaide' },
    { match: ['auckland', 'wellington', 'new zealand', 'nz'], tz: 'Pacific/Auckland' },

    // Latin America
    { match: ['sao paulo', 'rio de janeiro', 'brazil', 'brasil'], tz: 'America/Sao_Paulo' },
    { match: ['buenos aires', 'argentina'], tz: 'America/Buenos_Aires' },
    { match: ['santiago', 'chile'], tz: 'America/Santiago' },
    { match: ['bogota', 'colombia'], tz: 'America/Bogota' },
    { match: ['lima', 'peru'], tz: 'America/Lima' },
    { match: ['panama'], tz: 'America/Panama' },

    // Africa
    { match: ['johannesburg', 'cape town', 'pretoria', 'south africa'], tz: 'Africa/Johannesburg' },
    { match: ['cairo', 'alexandria', 'egypt'], tz: 'Africa/Cairo' },
    { match: ['lagos', 'abuja', 'nigeria'], tz: 'Africa/Lagos' },
    { match: ['nairobi', 'kenya'], tz: 'Africa/Nairobi' },
    { match: ['casablanca', 'rabat', 'morocco'], tz: 'Africa/Casablanca' },
    { match: ['accra', 'ghana'], tz: 'Africa/Accra' },
  ];

  for (const item of locationLookup) {
    for (const kw of item.match) {
      // Use regex boundary or substring
      if (q.includes(kw)) {
        return item.tz;
      }
    }
  }

  return null;
}

