import { Dayjs } from 'dayjs';

interface CommonPatient {
    first_name: string;
    middle_initial: string;
    last_name: string;
    suffix: string;
    phone_number: string;
    is_mobile: boolean;
    sex: string;
    email: string;
    address_street: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    address_county: string;
    race: string;
    ethnicity: string;
    employer: string;
    insurance_name: string;
    insurance_holder_name: string;
    insurance_holder_relationship: string;
    insurance_policy: string;
    insurance_group: string;
    insurance_phone: string;
    insurance_address_street: string;
    insurance_address_city: string;
    insurance_address_state: string;
    insurance_address_zip: string;
    ssn: string;
    ssn4: string;
}

export interface Patient extends CommonPatient {
    date_of_birth: string;
    id: number;
    created_at: number;
}

export interface PatientRegistration extends CommonPatient {
    password: string;
    confirm: string;
    date_of_birth: Dayjs;
}

export interface PatientLogin {
    email: string;
    password: string;
}

export interface PatientLoginResponse {
    id: number;
    session_id: string;
}