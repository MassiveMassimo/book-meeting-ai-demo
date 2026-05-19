import { p as addMinutes } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-helpers-DDaAbPUv.js
var MOCK_HOST_TIMEZONE = "Asia/Jakarta";
var MOCK_HOST = {
	name: "Imo Madjid",
	avatar_url: "https://lh3.googleusercontent.com/a/ACg8ocKPog_puTxJRjeHn-YydKU4LRPXvik0sAeL6N-6wYc1WIp48g=s100"
};
var MOCK_EVENTS = [
	{
		slug: "quick-1-on-1",
		name: "Quick 1-on-1",
		description: "Have a quick chat with me!",
		duration_minutes: 30,
		integration: "gmeet"
	},
	{
		slug: "intro-chat",
		name: "Intro chat",
		description: "A quick intro to align on goals and next steps.",
		duration_minutes: 15,
		integration: "gmeet"
	},
	{
		slug: "deep-dive",
		name: "Deep dive",
		description: "Long-form session to dig into something specific.",
		duration_minutes: 60,
		integration: "gmeet"
	}
];
function eventBySlug(slug) {
	return MOCK_EVENTS.find((e) => e.slug === slug);
}
function getMockUserAppointments(username) {
	if (username !== "imo") return null;
	return {
		host: MOCK_HOST,
		schedule_appointments: MOCK_EVENTS.map((e) => ({
			slug: e.slug,
			schedule_appointment: {
				name: e.name,
				description: e.description,
				duration_minutes: e.duration_minutes,
				integration: e.integration,
				location: e.location,
				host_timezone: MOCK_HOST_TIMEZONE
			}
		}))
	};
}
function getMockSingleAppointment(username, slug) {
	if (username !== "imo") return null;
	const event = eventBySlug(slug);
	if (!event) return null;
	return {
		host: MOCK_HOST,
		schedule_appointment: {
			name: event.name,
			description: event.description,
			duration_minutes: event.duration_minutes,
			integration: event.integration,
			location: event.location,
			host_timezone: MOCK_HOST_TIMEZONE
		}
	};
}
function pad(n) {
	return n < 10 ? `0${n}` : `${n}`;
}
function generateMockSlotsRaw(durationMinutes, startDate, endDate) {
	const days = [];
	const start = /* @__PURE__ */ new Date(`${startDate}T00:00:00`);
	const end = /* @__PURE__ */ new Date(`${endDate}T23:59:59`);
	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		const dow = d.getDay();
		if (dow === 0 || dow === 6) continue;
		const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
		const slots = [];
		const dayStartMin = 540;
		const dayEndMin = 1020;
		for (let m = dayStartMin; m + durationMinutes <= dayEndMin; m += durationMinutes) {
			const eMin = m + durationMinutes;
			slots.push({
				start: `${pad(Math.floor(m / 60))}:${pad(m % 60)}`,
				end: `${pad(Math.floor(eMin / 60))}:${pad(eMin % 60)}`,
				available: true
			});
		}
		days.push({
			date: dateStr,
			slots
		});
	}
	return {
		days,
		timezone: MOCK_HOST_TIMEZONE
	};
}
var BOOKINGS_KEY = "demo-bookings-v1";
function isBrowser() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function readBookings() {
	if (!isBrowser()) return [];
	try {
		return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
	} catch {
		return [];
	}
}
function writeBookings(bookings) {
	if (!isBrowser()) return;
	localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}
function createMockBooking(input) {
	const duration = eventBySlug(input.slug)?.duration_minutes ?? 30;
	const endTime = addMinutes(new Date(input.startTime), duration).toISOString();
	const id = `demo_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
	const booking = {
		id,
		username: input.username,
		slug: input.slug,
		start_time: input.startTime,
		end_time: endTime,
		guest_name: input.guestName,
		guest_email: input.guestEmail,
		guest_phone_number: input.guestPhone,
		guest_timezone: input.guestTimezone,
		notes: input.notes,
		status: "scheduled"
	};
	const all = readBookings();
	all.push(booking);
	writeBookings(all);
	return { id };
}
function getMockBookingDetails(bookingId) {
	if (!isBrowser()) {
		if (!bookingId.startsWith("demo_")) return null;
		const event = MOCK_EVENTS[0];
		return {
			id: bookingId,
			status: "scheduled",
			start_time: addMinutes(/* @__PURE__ */ new Date(), 60).toISOString(),
			end_time: addMinutes(/* @__PURE__ */ new Date(), 60 + event.duration_minutes).toISOString(),
			username: "imo",
			host: MOCK_HOST,
			schedule_appointment: {
				name: event.name,
				slug: event.slug,
				description: event.description,
				duration_minutes: event.duration_minutes,
				integration: event.integration,
				location: event.location
			}
		};
	}
	const b = readBookings().find((x) => x.id === bookingId);
	if (!b) return null;
	const event = eventBySlug(b.slug);
	return {
		id: b.id,
		status: b.status,
		start_time: b.start_time,
		end_time: b.end_time,
		notes: b.notes,
		username: b.username,
		host: MOCK_HOST,
		schedule_appointment: {
			name: event?.name ?? b.slug,
			slug: b.slug,
			description: event?.description ?? "",
			duration_minutes: event?.duration_minutes ?? 30,
			integration: event?.integration ?? "gmeet",
			location: event?.location
		}
	};
}
function cancelMockBooking(bookingId) {
	if (!isBrowser()) return false;
	const all = readBookings();
	const idx = all.findIndex((x) => x.id === bookingId);
	if (idx === -1) return false;
	all[idx].status = "cancelled";
	writeBookings(all);
	return true;
}
function rescheduleMockBooking(bookingId, newStartTime, newTimezone) {
	if (!isBrowser()) return null;
	const all = readBookings();
	const idx = all.findIndex((x) => x.id === bookingId);
	if (idx === -1) return null;
	const duration = eventBySlug(all[idx].slug)?.duration_minutes ?? 30;
	all[idx].start_time = newStartTime;
	all[idx].end_time = addMinutes(new Date(newStartTime), duration).toISOString();
	all[idx].guest_timezone = newTimezone;
	all[idx].status = "rescheduled";
	writeBookings(all);
	return getMockBookingDetails(bookingId);
}
async function fetchUserAppointments(username, _init) {
	return getMockUserAppointments(username);
}
async function fetchSingleAppointment(username, slug, _init) {
	return getMockSingleAppointment(username, slug);
}
async function fetchBookingDetails(bookingId, _init) {
	return getMockBookingDetails(bookingId);
}
//#endregion
export { fetchSingleAppointment as a, rescheduleMockBooking as c, fetchBookingDetails as i, cancelMockBooking as n, fetchUserAppointments as o, createMockBooking as r, generateMockSlotsRaw as s, MOCK_EVENTS as t };
