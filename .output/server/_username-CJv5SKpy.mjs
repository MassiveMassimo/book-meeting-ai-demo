import { n as dict } from "./_ssr/utils-CQ9QLPNX.mjs";
import { o as fetchUserAppointments } from "./_ssr/api-helpers-DDaAbPUv.mjs";
import { c as createFileRoute, s as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { n as mapUserAppointmentsResponse } from "./_ssr/api-mappers-cHf2anjK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_username-CJv5SKpy.js
var $$splitComponentImporter = () => import("./_username-Bvs2Hl5i.mjs");
var userQuery = (username) => queryOptions({
	queryKey: ["userAppointments", username],
	queryFn: async () => {
		const data = await fetchUserAppointments(username);
		if (!data?.schedule_appointments || !Array.isArray(data.schedule_appointments)) return {
			appointments: [],
			profile: null
		};
		return mapUserAppointmentsResponse(data);
	},
	staleTime: 6e4
});
function buildUserMeta(username, data) {
	const profile = data.profile || {
		name: username,
		image: ""
	};
	const siteUrl = "https://book-meeting-prototype.netlify.app";
	const title = dict.metadata.user_title.replace("{name}", profile.name);
	let description = dict.metadata.user_description_empty.replace("{name}", profile.name);
	if (data.appointments.length === 1) description = dict.metadata.user_description_one.replace("{name}", profile.name);
	else if (data.appointments.length > 1) description = dict.metadata.user_description.replace("{name}", profile.name).replace("{count}", String(data.appointments.length));
	const profileImageAbsolute = profile.image && (profile.image.startsWith("http://") || profile.image.startsWith("https://")) ? profile.image : profile.image ? `${siteUrl}${profile.image.startsWith("/") ? "" : "/"}${profile.image}` : "";
	const ogImage = `${siteUrl}/api/og?name=${encodeURIComponent(profile.name || username)}${profileImageAbsolute ? `&avatar=${encodeURIComponent(profileImageAbsolute)}` : ""}`;
	return [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:url",
			content: `${siteUrl}/${username}`
		},
		{
			property: "og:site_name",
			content: "Meeting.ai"
		},
		{
			property: "og:image",
			content: ogImage
		},
		{
			property: "og:image:width",
			content: "1200"
		},
		{
			property: "og:image:height",
			content: "630"
		},
		{
			property: "og:image:alt",
			content: title
		},
		{
			property: "og:locale",
			content: "en_US"
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: title
		},
		{
			name: "twitter:description",
			content: description
		},
		{
			name: "twitter:image",
			content: ogImage
		}
	];
}
var Route = createFileRoute("/$username/")({
	loader: ({ context, params }) => context.queryClient.ensureQueryData(userQuery(params.username)),
	head: ({ loaderData, params }) => ({ meta: buildUserMeta(params.username, loaderData ?? {
		appointments: [],
		profile: null
	}) }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
