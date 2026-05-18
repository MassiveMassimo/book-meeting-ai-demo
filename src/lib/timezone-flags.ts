import * as ct from "countries-and-timezones";

/**
 * Converts an ISO country code to a flag emoji
 */
function countryCodeToFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) {
    return "🌐"; // Globe emoji as fallback
  }

  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

/**
 * Gets the country code for a timezone identifier
 * Uses countries-and-timezones library
 */
function getCountryCodeFromTimezone(timezone: string): string | null {
  // Handle UTC/GMT - return null to use globe emoji
  if (
    timezone === "Etc/UTC" ||
    timezone === "Etc/GMT" ||
    timezone.startsWith("Etc/")
  ) {
    return null;
  }

  const tzInfo = ct.getTimezone(timezone);
  if (tzInfo && tzInfo.countries && tzInfo.countries.length > 0) {
    // If multiple countries share a timezone, we take the first one
    return tzInfo.countries[0];
  }

  return null;
}

/**
 * Gets the flag emoji for a timezone identifier
 */
export function getTimezoneFlag(timezone: string): string {
  const countryCode = getCountryCodeFromTimezone(timezone);
  if (!countryCode) {
    return "🌐"; // Globe emoji as fallback
  }
  return countryCodeToFlagEmoji(countryCode);
}
