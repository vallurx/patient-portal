import { ApplicationStatus } from './types/application';

export const getResultInfo = (status: ApplicationStatus): string => {
    switch (status) {
        case 'AwaitingApproval':
            return 'Your application has not been reviewed yet.';
        case 'InformationNeeded':
            return 'A nurse has determined that your application needs more information. You will be contacted by a nurse in the coming days.';
        case 'Scheduling':
            return 'Your vaccination request has been approved. Please schedule your appointment as soon as possible';
        case 'Scheduled':
            return 'You have successfully scheduled your vaccine appointment. Please remember to show up on time and bring your QR code.';
        case 'Rejected':
            return 'Unfortunately your vaccine application has been rejected. At this time, there is a strict list of people who can be approved to receive the vaccine.';
        case 'Vaccinated':
            return 'Thank you!';
    }
};