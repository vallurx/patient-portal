import { Button, Divider, Form, notification, Result, Select, Space, Steps, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import { Calendar } from '../components/dayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useScheduling } from '../lib/data/use-scheduling';
import { useParams } from 'react-router';
import { ScheduleListItem } from '../lib/types/schedule';
import { axios } from '../lib/axios';

const Schedule = () => {
    const { id } = useParams<{ id: string }>();
    const { scheduleBlocks } = useScheduling(parseInt(id));
    const [selectedDay, setSelectedDay] = useState(dayjs());
    const [selectedTime, setSelectedTime] = useState<Dayjs>();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const dateCellRenderer = (value: any) => {
        if (!scheduleBlocks) {
            return null;
        }

        const blocksInDay = scheduleBlocks.filter(b => dayjs(value.valueOf()).isSame(dayjs(b.start_at), 'day'));
        const compactedBlocks = blocksInDay
            .sort((a, b) => a.start_at - b.start_at)
            .reduce((acc: [ScheduleListItem[]], currentValue) => {
            let lastSub = acc[acc.length - 1];
            if (lastSub.length <= 0) {
                lastSub.push(currentValue);
            } else {
                if (lastSub[lastSub.length - 1].end_at === currentValue.start_at) {
                    lastSub.push(currentValue);
                } else {
                    acc.push([currentValue]);
                }
            }

            return acc;
        }, [[]]);

        return compactedBlocks.map(blocks => {
            if (blocks.length === 0) {
                return null;
            }

            const start = dayjs(blocks[0].start_at).format('LT');
            const end = dayjs(blocks[blocks.length - 1].end_at).format('LT');

            return (
                <Tag key={blocks[0].id}>{start} to {end}</Tag>
            )
        })
    };

    const onCalendarSelect = (date: Dayjs) => {
        if (!scheduleBlocks || scheduleBlocks?.filter(sb => date.isSame(dayjs(sb.start_at), 'date')).length === 0) {
            notification.error({
                message: 'Uh oh!',
                description: 'There are no vaccines available for that date.'
            });

            return;
        }

        setSelectedDay(date);
        setStep(1);
    };

    const onFinish = async (formData: { id: number }) => {
        setLoading(true);

        const selectedTimeSlot = scheduleBlocks?.find(block => block.id === formData.id);

        if (!selectedTimeSlot) {
            notification.error({
                message: 'Huh?',
                description: 'This error should not be possible. Please contact VallurX.'
            });

            return;
        }

        setSelectedTime(dayjs(selectedTimeSlot.start_at));

        try {
            await axios.put(`/api/patients/applications/${id}/scheduling`, formData);

            setLoading(false);
            setStep(2);
        } catch (e) {
            notification.error({
                message: 'Uh oh!',
                description: 'There was an error scheduling your appointment. Try again later, or contact VallurX.'
            });
        }
    };

    return (
        <>
            <Typography.Title level={1} style={{textAlign: 'center'}}>Vaccine Scheduling</Typography.Title>
            <Typography.Paragraph style={{textAlign: 'center'}}>You have been approved for a COVID vaccine. Please select a date and time slot below to schedule your appointment.</Typography.Paragraph>

            <Steps current={step}>
                <Steps.Step title="Select Date" />
                <Steps.Step title="Select Time" />
                <Steps.Step title="Done" />
            </Steps>

            {step === 0 && (
                <Calendar dateCellRender={dateCellRenderer} onSelect={onCalendarSelect} />
            )}

            {step === 1 && (
                <>
                    <Divider>Choose a time slot for</Divider>
                    <Typography.Title level={2} style={{textAlign: 'center'}}>
                        {selectedDay.format('LL')}
                    </Typography.Title>

                    <Form
                        layout="vertical"
                        style={{width: '50%', margin: 'auto'}}
                        onFinish={onFinish}
                    >
                        <Form.Item name="id" label="Time Slot" rules={[{required: true}]}>
                            <Select style={{width: '100%'}}>
                                {scheduleBlocks?.filter(b => dayjs(selectedDay).isSame(dayjs(b.start_at), 'day')).map(block => (
                                    <Select.Option value={block.id} key={block.id}>
                                        {dayjs(block.start_at).format('LT')} to {dayjs(block.end_at).format('LT')}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button onClick={() => setStep(0)}>
                                    Back
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Next
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </>
            )}

            {step === 2 && (
                <Result
                    status="success"
                    title="Successfully scheduled your vaccine!"
                    subTitle={`Your vaccine is scheduled for ${selectedTime?.format('LLL')}. Please show up on time, or you may need to reschedule.`}
                />
            )}
        </>
    )
};

export default Schedule;