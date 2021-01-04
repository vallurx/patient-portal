import useSWR from 'swr';
import { Patient } from '../types';

export const usePatient = () => {
    const { data, error, mutate } = useSWR<Patient>('/api/patients');

    return {
        patient: data,
        error,
        loading: !data && !error,
        mutate
    }
};