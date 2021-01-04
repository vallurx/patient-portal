import useSWR from 'swr';
import { ScheduleListItem } from '../types/schedule';

export const useScheduling = (appId: number) => {
    const { data, error, mutate } = useSWR<ScheduleListItem[]>('/api/patients/applications/' + appId + '/scheduling');

    return {
        scheduleBlocks: data,
        error,
        loading: !data && !error,
        mutate
    }
};