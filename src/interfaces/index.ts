export type AppointmentResourcePlanningReportData = {
    questionnaire_name: string
    appointment_time: string
    appointment_language: string
    total: number
}

export type AppointmentResourcePlanningSummaryReportData = {
    language: string
    total: number
}

export type InterviewerCallPatternReport = {
    total_valid_cases?: number,
    hours_worked?: string,
    call_time?: string,
    hours_on_calls_percentage?: number,
    average_calls_per_hour?: number,
    refusals?: number,
    no_contacts?: number,
    no_contact_answer_service?: number,
    no_contact_busy?: number,
    no_contact_disconnect?: number,
    no_contact_no_answer?: number,
    no_contact_other?: number,
    completed_successfully?: number,
    appointments_for_contacts?: number,
    webnudge?: number,
    total_records?: number
    discounted_invalid_cases: number,
    invalid_fields: string,
}

export type CallHistoryStatus = {
    last_updated: string
}

export type InterviewerCallHistoryReport = {
    appointment_info?: string,
    busy_dials?: number,
    call_number?: number,
    cohort?: string,
    update_info?: string,
    wave?: string,
    questionnaire_id?: string,
    interviewer?: string,
    outcome_code?: number,
    dial_number?: number,
    status?: string,
    survey?: string,
    call_result?: string,
    dial_secs?: number,
    questionnaire_name: string,
    serial_number: string,
    call_start_time: string
}
