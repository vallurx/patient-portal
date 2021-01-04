import useSWR from 'swr';
import { Application } from '../types/application';

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
}
