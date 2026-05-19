import { c as createFileRoute, s as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as object, r as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/success-Dzq0RVgD.js
var $$splitComponentImporter = () => import("./success-82HSK6f2.mjs");
var successSearchSchema = object({
	bookingId: string().optional(),
	date: string().optional(),
	time: string().optional(),
	type: string().optional(),
	title: string().optional(),
	name: string().optional(),
	timezone: string().optional(),
	hostName: string().optional(),
	username: string().optional(),
	integration: string().optional(),
	location: string().optional(),
	action: _enum(["rescheduled", "cancelled"]).optional()
});
var Route = createFileRoute("/success")({
	validateSearch: successSearchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
