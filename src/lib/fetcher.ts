import axios from 'axios';

export const fetcher = (url: string) => {
    return axios.get(url, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('patient_session_id')
        }
    }).then(res => res.data);
};