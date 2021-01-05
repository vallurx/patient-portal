import React, { ReactNode, useState } from 'react';
import { usePatient } from '../lib/data/use-patient';
import { usePatientApplications } from '../lib/data/use-application';
import { Button, Card, Empty, List, notification, Result, Skeleton, Typography } from 'antd';
import { formattedName } from '../lib/util';
import { ApplicationStatus } from '../lib/types/application';
import { ResultStatusType } from 'antd/es/result';
import { getResultInfo } from '../lib/result-info';
import dayjs from 'dayjs';
import { CalendarOutlined, CommentOutlined, EllipsisOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { axios } from '../lib/axios';
import { prettyStatuses } from '../lib/static-lists';

const getResultStatus = (status: ApplicationStatus): { status: ResultStatusType, icon: ReactNode } => {
    switch (status) {
        case 'AwaitingApproval':
            return {
                status: 'info',
                icon: <EllipsisOutlined />
            }
        case 'InformationNeeded':
            return {
                status: 'info',
                icon: <CommentOutlined />
            };
        case 'Scheduling':
            return {
                status: 'success',
                icon: <CalendarOutlined />
            }
        case 'Scheduled':
            return {
                status: 'success',
                icon: <ScheduleOutlined />
            }
        case 'Vaccinated':
            return {
                status: 'success',
                icon: null
            }
        case 'Rejected':
            return {
                status: 'error',
                icon: null
            }
    }
}

const Dashboard = () => {
    const { patient } = usePatient();
    const { applications } = usePatientApplications();
    const [qrLoading, setQRLoading] = useState(false);

    const generateQRCode = async (appId: number) => {
        setQRLoading(true);

        try {
            const res = await axios.get(`/api/patients/applications/${appId}/qr_code`);
            const w = window.open();

            if (w) {
                w.document.write(res.data);

                setTimeout(() => {
                    w.window.print();
                    w.document.close();
                    setQRLoading(false);
                }, 100);
            }
        } catch (e) {
            notification.error({
                message: 'Uh oh!',
                description: 'There was an error generating a QR code.'
            });

            setQRLoading(false);
        }
    };

    if (!patient || !applications) {
        return <Skeleton active />
    }

    return (
        <>
            <Typography.Title level={2}>Welcome, {formattedName(patient)}</Typography.Title>

            <List
                grid={{ gutter: 16, xxl: 3, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
                dataSource={applications}
                locale={{
                    emptyText: (
                        <Empty
                            description="You have not applied for any vaccines yet."
                        >
                            <Link to="/apply">
                                <Button type="primary" size="large">
                                    Apply Now
                                </Button>
                            </Link>
                        </Empty>
                    )
                }}
                renderItem={item => {
                    const resultStatus = getResultStatus(item.status);

                    return (
                        <List.Item style={{height: '100%'}}>
                            <Card
                                title={'Application on ' + dayjs(item.created_at).format('LL')}
                                style={{height: '100%'}}
                            >
                                <Result
                                    title={prettyStatuses[item.status] || item.status}
                                    icon={resultStatus.icon}
                                    status={resultStatus.status}
                                    subTitle={(
                                        <>
                                            {getResultInfo(item.status)}

                                            {item.status === 'Scheduled' && (
                                                <>
                                                    <br /> <br />
                                                    Your appointment is scheduled for <b>{dayjs(item.scheduled_at).format('LLL')}</b> at <b>{item.facility.name}</b>. Address: <b>{item.facility.location}</b> {item.facility.directions && '(' + item.facility.directions + ')'}
                                                </>
                                            )}
                                        </>
                                    )}
                                    extra={(() => {
                                        if (item.status === 'Scheduling') {
                                            return [
                                                <Link to={'/schedule/' + item.id} key={item.id}>
                                                    <Button type="primary" size="large">
                                                        Schedule Vaccine
                                                    </Button>
                                                </Link>
                                            ];
                                        }

                                        if (item.status === 'Scheduled') {
                                            return [
                                                <Button key={item.id} type="primary" size="large" onClick={() => generateQRCode(item.id)} loading={qrLoading}>
                                                    Get QR Code
                                                </Button>
                                            ]
                                        }
                                    })()}
                                />
                            </Card>
                        </List.Item>
                    )
                }}
            />
        </>
    )
};

export default Dashboard;