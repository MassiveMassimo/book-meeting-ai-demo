//#region node_modules/.nitro/vite/services/ssr/assets/platform-BRTBg_vT.js
/**
* Formats a platform integration string to a user-friendly display name
* @param platform - Platform integration string (e.g., "gmeet", "teams", "zoom", "in_person")
* @param dict - Optional platform translations from dictionary
* @returns Formatted platform name (e.g., "Google Meet", "Microsoft Teams", "Zoom", "In Person")
*/
function formatPlatformName(platform, dict) {
	if (dict && dict[platform.toLowerCase()]) return dict[platform.toLowerCase()];
	return {
		gmeet: "Google Meet",
		teams: "Microsoft Teams",
		zoom: "Zoom",
		in_person: "In Person"
	}[platform.toLowerCase()] || platform.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
//#endregion
export { formatPlatformName as t };
