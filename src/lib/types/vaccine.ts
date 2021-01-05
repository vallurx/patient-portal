export interface Vaccine {
    id: number;
    cpt_code: number;
    cvx_code: number;
    manufacturer: {
        id: number;
        name: string;
        mvx_code: string;
    };
    name: string;
    description: string;
    fact_sheet: string;
    shorthand: string;
    doses: VaccineDose[];
}

export interface VaccineDose {
    id: number;
    vaccine_id: number;
    administration_codes: number;
    index: number;
    index_day: number;
}