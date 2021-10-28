interface InterviewerCallHistoryReportData {
    questionnaire_name: string
    serial_number: string
    call_start_time: string
    dial_secs: string
    call_result: string
}

interface AppointmentResourcePlanningReportData {
    questionnaire_name: string
    appointment_time: string
    appointment_language: string
    total: number
}

export type {InterviewerCallHistoryReportData, AppointmentResourcePlanningReportData};
