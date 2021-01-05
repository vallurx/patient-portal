export type ApplicationStatus = 'AwaitingApproval' | 'Scheduling' | 'Scheduled' | 'Vaccinated' | 'InformationNeeded' | 'Rejected';

export interface ApplicationRequest {
    facility_id: number;
    guardian_name: string;
    target_population: string;
    signature_name: string;
    signature_date: string;
    print_name: string;
    relationship: string;
    screening_questions: ScreeningQuestionRequest[];
    has_image: boolean;
}

export interface ScreeningQuestionRequest {
    id: number;
    answer: boolean;
    details: string;
}

export interface Application {
    id: number;
    facility: Facility;
    created_at: number;
    scheduled_at?: number;
    guardian_name?: string;
    target_populations?: string;
    screening_questions: ScreeningQuestion[];
    status: ApplicationStatus;
    vaccine_dose_id: number;
}

export interface Facility {
    name: string;
    location: string;
    directions: string;
}

export interface ScreeningQuestion {
    id: number;
    question: string;
    answer: boolean;
    details: string;
}