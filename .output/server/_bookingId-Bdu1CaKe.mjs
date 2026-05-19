import { i as fetchBookingDetails } from "./_ssr/api-helpers-DDaAbPUv.mjs";
import { c as createFileRoute, h as notFound, s as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_bookingId-Bdu1CaKe.js
var $$splitComponentImporter = () => import("./_bookingId-nDJTG57u.mjs");
var Route = createFileRoute("/cancellations/$bookingId")({
	loader: async ({ params }) => {
		const booking = await fetchBookingDetails(params.bookingId);
		if (!booking && !params.bookingId.startsWith("demo_")) throw notFound();
		return booking;
	},
	head: ({ loaderData }) => loaderData ? { meta: [{ title: `Cancel Booking — ${loaderData.schedule_appointment.name}` }, {
		name: "description",
		content: `Cancel your meeting with ${loaderData.host.name}`
	}] } : { meta: [] },
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
