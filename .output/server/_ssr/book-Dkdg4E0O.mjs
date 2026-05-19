import { a as fetchSingleAppointment, o as fetchUserAppointments } from "./api-helpers-DDaAbPUv.mjs";
import { c as createFileRoute, m as redirect, s as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { n as object, r as string } from "../_libs/zod.mjs";
import { t as mapSingleAppointmentResponse } from "./api-mappers-cHf2anjK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-Dkdg4E0O.js
var $$splitComponentImporter = () => import("./book-7SQzq_OJ.mjs");
var bookingSearchSchema = object({
	start: string().optional(),
	date: string().optional(),
	time: string().optional(),
	timezone: string().optional()
});
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
var Route = createFileRoute("/$username/$eventType/book")({
	validateSearch: bookingSearchSchema,
	loader: async ({ context, params }) => {
		const [eventDetails, profile] = await Promise.all([context.queryClient.ensureQueryData(eventQuery(params.username, params.eventType)), context.queryClient.ensureQueryData(profileQuery(params.username))]);
		if (!eventDetails) throw redirect({
			to: "/$username",
			params: { username: params.username },
			search: { error: "event_not_found" }
		});
		return {
			eventDetails,
			profile
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
