import "../_runtime.mjs";
import { t as cn } from "./utils-CQ9QLPNX.mjs";
import { c as rescheduleMockBooking, n as cancelMockBooking, r as createMockBooking } from "./api-helpers-DDaAbPUv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as object, r as string } from "../_libs/zod.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		"data-slot": "label",
		className: cn("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
var bookingSchema = object({
	username: string(),
	eventTypeId: string(),
	name: string().min(1, "Name is required").max(100, "Name must be less than 100 characters").trim(),
	email: string().email("Invalid email address").max(255, "Email must be less than 255 characters").trim(),
	phone: string().max(20, "Phone number must be less than 20 characters").optional().refine((val) => !val || /^[+]?[\d\s-().]{7,}$/.test(val), "Invalid phone number format"),
	notes: string().max(1e3, "Notes must be less than 1000 characters").trim().optional(),
	startTime: string(),
	guestTimezone: string()
});
async function createBooking(data) {
	const parsed = bookingSchema.safeParse(data);
	if (!parsed.success) return {
		success: false,
		message: "Validation failed",
		errors: parsed.error.flatten().fieldErrors
	};
	await new Promise((r) => setTimeout(r, 400));
	const { id } = createMockBooking({
		username: parsed.data.username,
		slug: parsed.data.eventTypeId,
		startTime: parsed.data.startTime,
		guestName: parsed.data.name,
		guestEmail: parsed.data.email,
		guestPhone: parsed.data.phone,
		guestTimezone: parsed.data.guestTimezone,
		notes: parsed.data.notes
	});
	return {
		success: true,
		booking: {
			id,
			status: "confirmed"
		}
	};
}
var cancelBookingSchema = object({
	bookingId: string(),
	reason: string().min(1, "Please provide a reason for cancellation").max(1e3, "Reason must be less than 1000 characters").trim()
});
async function cancelBooking(data) {
	const parsed = cancelBookingSchema.safeParse(data);
	if (!parsed.success) return {
		success: false,
		message: "Validation failed",
		errors: parsed.error.flatten().fieldErrors
	};
	await new Promise((r) => setTimeout(r, 300));
	return cancelMockBooking(parsed.data.bookingId) ? { success: true } : {
		success: false,
		message: "Booking not found"
	};
}
var rescheduleBookingSchema = object({
	bookingId: string(),
	newStartTime: string(),
	timezone: string(),
	notes: string().max(1e3, "Notes must be less than 1000 characters").trim().optional(),
	reason: string().max(1e3, "Reason must be less than 1000 characters").trim().optional()
});
async function rescheduleBooking(data) {
	const parsed = rescheduleBookingSchema.safeParse(data);
	if (!parsed.success) return {
		success: false,
		message: "Validation failed",
		errors: parsed.error.flatten().fieldErrors
	};
	await new Promise((r) => setTimeout(r, 400));
	const updated = rescheduleMockBooking(parsed.data.bookingId, parsed.data.newStartTime, parsed.data.timezone);
	return updated ? {
		success: true,
		booking: updated
	} : {
		success: false,
		message: "Booking not found"
	};
}
//#endregion
export { rescheduleBooking as a, createBooking as i, Textarea as n, cancelBooking as r, Label as t };
