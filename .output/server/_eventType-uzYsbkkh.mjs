import { n as dict, r as formatDuration } from "./_ssr/utils-CQ9QLPNX.mjs";
import { a as fetchSingleAppointment, o as fetchUserAppointments } from "./_ssr/api-helpers-DDaAbPUv.mjs";
import { c as createFileRoute, m as redirect, s as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { t as mapSingleAppointmentResponse } from "./_ssr/api-mappers-cHf2anjK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_eventType-uzYsbkkh.js
var $$splitComponentImporter = () => import("./_eventType-Bcs_8wOZ.mjs");
var siteUrl = "https://book-meeting-prototype.netlify.app";
var eventQuery = (username, slug) => queryOptions({
	queryKey: [
		"singleAppointment",
		username,
		slug
	],
	queryFn: async () => {
		try {
			const data = await fetchSingleAppointment(username, slug);
			if (!data) return null;
			return mapSingleAppointmentResponse(data, slug);
		} catch (error) {
			return null;
		}
	},
	staleTime: 6e4
});
var profileQuery = (username) => queryOptions({
	queryKey: ["userProfile", username],
	queryFn: async () => {
		try {
			const data = await fetchUserAppointments(username);
			if (!data) return null;
			return {
				name: data.host.name,
				image: data.host.avatar_url
			};
		} catch (error) {
			return null;
		}
	},
	staleTime: 6e4
});
function buildEventMeta(params, data) {
	if (!data.eventDetails) return [{ title: params.eventType }];
	const { username, eventType: eventSlug } = params;
	const host = data.profile || {
		name: username,
		image: ""
	};
	const profileImageAbsolute = host.image && (host.image.startsWith("http://") || host.image.startsWith("https://")) ? host.image : host.image ? `${siteUrl}${host.image.startsWith("/") ? "" : "/"}${host.image}` : "";
	const ogImage = `${siteUrl}/api/og?name=${encodeURIComponent(host.name)}${profileImageAbsolute ? `&avatar=${encodeURIComponent(profileImageAbsolute)}` : ""}&title=${encodeURIComponent(data.eventDetails.title)}`;
	const durationStr = formatDuration(data.eventDetails.duration_minutes, dict.booking_form);
	const description = data.eventDetails.description || dict.metadata.event_description.replace("{duration}", durationStr).replace("{name}", host.name);
	const title = `${data.eventDetails.title} — ${host.name}`;
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
			content: `${siteUrl}/${username}/${eventSlug}`
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
var Route = createFileRoute("/$username/$eventType/")({
	loader: async ({ context, params }) => {
		const [eventDetails, profile] = await Promise.all([context.queryClient.ensureQueryData(eventQuery(params.username, params.eventType)), context.queryClient.ensureQueryData(profileQuery(params.username))]);
		if (eventDetails == null) throw redirect({
			to: "/$username",
			params: { username: params.username },
			search: { error: "event_not_found" }
		});
		return {
			eventDetails,
			profile
		};
	},
	head: ({ loaderData, params }) => ({ meta: loaderData ? buildEventMeta(params, loaderData) : [{ title: params.eventType }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
