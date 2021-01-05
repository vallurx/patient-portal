import useSWR from 'swr';
import { Application } from '../types/application';
import { Vaccine } from '../types/vaccine';

export const usePatientApplications = () => {
    const { data, error, mutate } = useSWR<Application[]>('/api/patients/applications');

    return {
        applications: data,
        error,
        loading: !data && !error,
        mutate
    }
};

export const usePatientApplication = (id: number) => {
    const { data, error, mutate } = useSWR<Application>('/api/patients/applications/' + id);

    return {
        application: data,
        error,
        loading: !data && !error,
        mutate
    }
};

export const useVaccines = () => {
    const { data, error, mutate } = useSWR<Vaccine[]>('/api/vaccines');

    return {
        vaccines: data,
        error,
        loading: !data && !error,
        mutate
    }
}
