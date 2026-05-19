import { a as fetchSingleAppointment, i as fetchBookingDetails } from "./_ssr/api-helpers-DDaAbPUv.mjs";
import { c as createFileRoute, h as notFound, s as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as queryOptions } from "./_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_bookingId-CzLFtf1G.js
var $$splitComponentImporter = () => import("./_bookingId-CCOu-voe.mjs");
var appointmentQuery = (username, slug) => queryOptions({
	queryKey: [
		"singleAppointmentRaw",
		username,
		slug
	],
	queryFn: () => fetchSingleAppointment(username, slug),
	staleTime: 6e4
});
var Route = createFileRoute("/reschedulings/$bookingId")({
	loader: async ({ context, params }) => {
		const booking = await fetchBookingDetails(params.bookingId);
		if (!booking && !params.bookingId.startsWith("demo_")) throw notFound();
		if (!booking) return {
			booking: null,
			appointment: null
		};
		return {
			booking,
			appointment: await context.queryClient.ensureQueryData(appointmentQuery(booking.username, booking.schedule_appointment.slug))
		};
	},
	head: ({ loaderData }) => loaderData?.booking ? { meta: [{ title: `Reschedule Booking — ${loaderData.booking.schedule_appointment.name}` }, {
		name: "description",
		content: `Reschedule your meeting with ${loaderData.booking.host.name}`
	}] } : { meta: [] },
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
