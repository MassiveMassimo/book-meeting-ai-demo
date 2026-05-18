/**
 * Formats a platform integration string to a user-friendly display name
 * @param platform - Platform integration string (e.g., "gmeet", "teams", "zoom", "in_person")
 * @param dict - Optional platform translations from dictionary
 * @returns Formatted platform name (e.g., "Google Meet", "Microsoft Teams", "Zoom", "In Person")
 */
export function formatPlatformName(
  platform: string,
  dict?: Record<string, string>,
): string {
  if (dict && dict[platform.toLowerCase()]) {
    return dict[platform.toLowerCase()];
  }

  const platformMap: Record<string, string> = {
    gmeet: "Google Meet",
    teams: "Microsoft Teams",
    zoom: "Zoom",
    in_person: "In Person",
  };

  return (
    platformMap[platform.toLowerCase()] ||
    platform
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
}
