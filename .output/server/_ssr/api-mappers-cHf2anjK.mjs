//#region node_modules/.nitro/vite/services/ssr/assets/api-mappers-cHf2anjK.js
/**
* Maps location from API to integration type
*/
function mapLocationTypeToIntegration(locationType) {
	if (locationType === "gmeet") return "gmeet";
	if (locationType === "team") return "teams";
	if (locationType === "zoom") return "zoom";
	return "in_person";
}
/**
* Maps a schedule appointment item from the API response to PublicAppointment format
*/
function mapScheduleAppointmentToPublicAppointment(item) {
	return {
		id: item.slug,
		slug: item.slug,
		title: item.schedule_appointment.name,
		description: item.schedule_appointment.description,
		duration_minutes: item.schedule_appointment.duration_minutes,
		integration: mapLocationTypeToIntegration(item.schedule_appointment.integration),
		location: item.schedule_appointment.location,
		host_timezone: item.schedule_appointment.host_timezone,
		is_active: true
	};
}
/**
* Maps UserAppointmentsResponse to appointments and profile
*/
function mapUserAppointmentsResponse(data) {
	return {
		appointments: data.schedule_appointments.map(mapScheduleAppointmentToPublicAppointment),
		profile: {
			name: data.host.name,
			image: data.host.avatar_url
		}
	};
}
/**
* Maps single appointment API response to PublicAppointment format
* API returns: { host: {...}, schedule_appointment: {...} }
*/
function mapSingleAppointmentResponse(data, slug) {
	return {
		id: slug,
		slug,
		title: data.schedule_appointment.name,
		description: data.schedule_appointment.description,
		duration_minutes: data.schedule_appointment.duration_minutes,
		integration: mapLocationTypeToIntegration(data.schedule_appointment.integration),
		location: data.schedule_appointment.location,
		host_timezone: data.schedule_appointment.host_timezone,
		is_active: true
	};
}
//#endregion
export { mapUserAppointmentsResponse as n, mapSingleAppointmentResponse as t };
