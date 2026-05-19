import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-CQ9QLPNX.js
var dict = {
	landing: {
		"title": "Book meetings effortlessly.",
		"subtitle": "Share your link. Guests pick a time. Meeting scheduled.",
		"cta": "Start scheduling for free",
		"features": {
			"tag": "Simple by design",
			"title": "Just the features you need.",
			"link": {
				"title": "One link",
				"description": "Share it anywhere."
			},
			"global": {
				"title": "Global times",
				"description": "Auto-converted."
			},
			"automated": {
				"title": "Automated",
				"description": "Invites & reminders."
			}
		}
	},
	user_page: {
		"welcome": "Welcome to my scheduling page. Please select an event type to get started.",
		"not_found": "Username not found",
		"not_found_desc": "Please check again if the username is correct. The user \"{username}\" does not exist or may have been removed.",
		"no_events": "{name} hasn't made any events yet.",
		"book_now": "Book now"
	},
	success: {
		"title": "You're all set! 🎉",
		"title_cancelled": "Booking Cancelled",
		"title_rescheduled": "Rescheduled Successfully! 🎉",
		"subtitle": "Confirmation sent to your email",
		"subtitle_cancelled": "The booking has been cancelled",
		"subtitle_rescheduled": "Your booking has been updated",
		"copy": "Copy meeting details",
		"copied": "Copied!",
		"scheduled_with": "Scheduled with {hostName} via book.meeting.ai",
		"scheduled_via": "Scheduled via book.meeting.ai"
	},
	booking_form: {
		"details": "Enter Details",
		"name": "Name",
		"email": "Email",
		"phone": "Phone Number",
		"optional": "(Optional)",
		"notes_label": "Please share anything that will help prepare for our meeting.",
		"schedule_event": "Schedule Event",
		"scheduling": "Scheduling Event...",
		"checking": "Checking availability...",
		"slot_not_available": "Time Slot Not Available",
		"slot_not_available_desc": "This time slot is no longer available. Redirecting to select another time...",
		"back": "Go Back to Calendar",
		"missing_time": "Missing booking time",
		"toast_slot_unavailable": "This time slot is not available",
		"toast_redirecting": "This time slot is unavailable. Redirecting to select another time.",
		"toast_confirm_fail": "Could not confirm availability",
		"toast_no_longer_available": "This time slot is no longer available",
		"toast_success": "Event has been scheduled successfully",
		"toast_fail": "Failed to schedule event",
		"guest": "Guest",
		"duration": "{min} min",
		"duration_hours": "{hr} hr",
		"duration_hours_minutes": "{hr} hr {min} min"
	},
	slot_picker: {
		"host_tz_prefix": "Times shown in the host's time zone",
		"viewer_tz_prefix": "Times shown in your time zone",
		"show_your_tz": "Show your time zone ({tz})",
		"show_host_tz": "Show host time zone ({tz})",
		"switch_to_your_tz": "Switch to your time zone",
		"switch_to_host_tz": "Switch to host time zone",
		"select_date_see_times": "Select a date to see available times",
		"select_date_check_times": "Select a date to check available times",
		"select_time": "Select a time",
		"already_booked": "Already booked",
		"not_available": "Not available",
		"loading_slots": "Loading slots...",
		"book_button": "Book",
		"am": "am",
		"pm": "pm"
	},
	calendar: {
		"days": [
			"Sun",
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat"
		],
		"full_days": [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		],
		"unavailable": "Unavailable",
		"fully_booked": "Fully Booked",
		"next_month": "Next month",
		"prev_month": "Previous month"
	},
	timezone_selector: {
		"search_placeholder": "Search time zone, city, or UTC offset...",
		"no_results": "No time zone found.",
		"trigger_placeholder": "Select time zone",
		"title": "Select a time zone"
	},
	reschedule: {
		"title": "Reschedule: {title}",
		"details_title": "Reschedule Details",
		"current_time_label": "Current Time",
		"select_new_time_title": "Select a New Time",
		"select_new_time_subtitle": "Choose a new date and time for your meeting",
		"reason_label": "Reason for Rescheduling",
		"reason_placeholder": "Something came up...",
		"additional_notes_label": "Additional Notes",
		"notes_placeholder": "Please share anything that will help prepare for our meeting.",
		"submit_button": "Confirm Reschedule",
		"submitting_button": "Rescheduling...",
		"toast_loading": "Rescheduling booking...",
		"toast_success": "Booking has been rescheduled successfully",
		"toast_error": "Failed to reschedule booking",
		"already_cancelled": "Booking Already Cancelled",
		"already_cancelled_desc": "This booking has already been cancelled and cannot be modified.",
		"cannot_reschedule_past": "Cannot Reschedule This Event",
		"cannot_reschedule_past_desc": "This event has already started or has passed. Only upcoming events can be rescheduled."
	},
	cancel: {
		"already_cancelled": "Booking Already Cancelled",
		"already_cancelled_desc": "This booking has already been cancelled and cannot be modified.",
		"cannot_cancel_past": "Cannot Cancel This Event",
		"cannot_cancel_past_desc": "This event has already started or has passed. Only upcoming events can be cancelled.",
		"reason_label": "Reason for Cancellation",
		"reason_placeholder": "Please let us know why you're cancelling this booking...",
		"reason_required": "Please provide a reason for cancellation",
		"submit_button": "Cancel Booking",
		"submitting_button": "Cancelling...",
		"toast_loading": "Cancelling booking...",
		"toast_success": "Booking has been cancelled successfully",
		"toast_error": "Failed to cancel booking"
	},
	hero: {
		"intro_title": "Intro chat",
		"intro_duration": "30 min",
		"intro_type": "Video call",
		"intro_description": "A quick intro to align on goals and next steps.",
		"host_name": "James Smith",
		"times_shown_in": "Times shown in",
		"available_times": "Available times",
		"book_button": "Book",
		"am": "am",
		"pm": "pm",
		"mini_days": [
			"S",
			"M",
			"T",
			"W",
			"T",
			"F",
			"S"
		],
		"months": [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		]
	},
	metadata: {
		"default_title": "Book a Meeting — Schedule Now",
		"default_description": "Ready to connect? Schedule a meeting. Pick your time slot and book instantly with Meeting.ai.",
		"user_title": "{name} - Book a Meeting",
		"user_description": "Schedule a meeting with {name}. Choose from {count} available events.",
		"user_description_one": "Schedule a meeting with {name}. Choose from 1 available event.",
		"user_description_empty": "Book a meeting with {name} on Meeting.ai.",
		"event_description": "Schedule a {duration} meeting with {name}.",
		"og_book_with": "Book a meeting with"
	},
	platforms: {
		"gmeet": "Google Meet",
		"teams": "Microsoft Teams",
		"zoom": "Zoom",
		"in_person": "In Person"
	},
	theme: {
		"light": "Light mode",
		"dark": "Dark mode",
		"system": "System theme",
		"toggle": "Toggle theme"
	},
	common: {
		"loading": "Loading...",
		"loading_form": "Loading booking form..."
	}
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatDuration(minutes, dict) {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	if (h === 0) return dict.duration.replace("{min}", String(m));
	if (m === 0) return dict.duration_hours.replace("{hr}", String(h));
	return dict.duration_hours_minutes.replace("{hr}", String(h)).replace("{min}", String(m));
}
//#endregion
export { dict as n, formatDuration as r, cn as t };
