import React, { useEffect, useState } from 'react';
import {
    Button,
    Col,
    Divider,
    Form,
    Image,
    Input,
    notification,
    Radio,
    Result,
    Row,
    Select, Spin,
    Typography,
    Upload
} from 'antd';
import { screeningQuestions } from '../lib/static-lists';
import { DatePicker } from '../components/dayjs';
import { axios } from '../lib/axios';
import baseAxios from 'axios';
import { CheckOutlined, IdcardOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { useHistory } from 'react-router-dom';
import { toBase64 } from '../lib/util';
import { usePatientApplications, useVaccines } from '../lib/data/use-application';
import dayjs from 'dayjs';

const Apply = () => {
    const history = useHistory();
    const { applications } = usePatientApplications();
    const { vaccines } = useVaccines();
    const [form] = Form.useForm();
    const [applyState, setApplyState] = useState<'loading' | 'apply' | 'rekt'>('loading');
    const [workId, setWorkId] = useState<RcFile | undefined>();
    const [workIdPreview, setWorkIdPreview] = useState<string | undefined>();

    const submitApplication = async (data: any) => {
        try {
            const screeningFormData = screeningQuestions.map((q, i) => {
                const questionAnswer = data['screening_question_' + i];
                const questionDetails = data['screening_details_' + i] || '';

                return {
                    id: i + 1,
                    answer: questionAnswer,
                    details: questionDetails
                };
            });

            const res = await axios.put('/api/patients/applications', {
                facility_id: 1,
                guardian_name: data.signature_name,
                target_population: data.target_population,
                signature_name: data.signature_name,
                signature_date: data.signature_date.format('MM/DD/YYYY'),
                print_name: data.print_name,
                relationship: data.relationship || '',
                screening_questions: screeningFormData,
                has_image: !!workId
            });

            if (workId) {
                const { put_image_url } = res.data;

                await baseAxios.put(put_image_url, workId, {
                    headers: {
                        'Content-Type': 'image/png'
                    }
                });
            }

            notification.success({
                message: 'Success!',
                description: 'Successfully submitted your application. '
            });

            history.push('/');
        } catch (e) {
            notification.error({
                message: 'Uh oh!',
                description: 'There was an error processing your application.'
            });
        }
    };

    useEffect(() => {
        if (vaccines && applications) {
            let apps = applications.filter((x: any) => x.status != "Rejected");
            if (apps.length === 0) {
                setApplyState('apply');
                return;
            }

            if (apps.length === 1) {
                const app = apps[0];
                const doses = vaccines.flatMap(v => v.doses);
                const currentDose = doses.find(d => d.id === app.vaccine_dose_id);

                // If the application's dose is not the highest index
                if (app.status === 'Vaccinated' && currentDose && doses.some(d => d.index > currentDose.index)) {
                    setApplyState('apply');
                    return;
                }
            }

            setApplyState('rekt');
        }
    }, [vaccines, applications]);

    if (applyState === 'loading') {
        return <Spin size="large" spinning style={{width: '100%'}} />;
    }

    if (applyState === 'rekt') {
        return (
            <Result
                title="Sorry!"
                subTitle="You are either fully vaccinated or have a pending application."
                status="warning"
            />
        );
    }

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={submitApplication}
                scrollToFirstError={{ behavior: 'smooth', block: 'center' } as unknown as boolean}
            >
                <Typography.Title level={3}>Screening Questions</Typography.Title>

                {screeningQuestions.map((question, i) => (
                    <div key={i}>
                        <Row gutter={8}>
                            <Col span={16}>
                                <Form.Item name={`screening_question_${i}`} label={screeningQuestions[i].question} shouldUpdate={true} rules={[{required: true, message: 'Required'}]}>
                                    <Radio.Group size="large" buttonStyle="solid">
                                        <Radio.Button value={true}>Yes</Radio.Button>
                                        <Radio.Button value={false}>No</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item shouldUpdate>
                                    {() => {
                                        return (
                                            <Form.Item name={`screening_details_${i}`} label="Details">
                                                <Input disabled={!form.getFieldValue(`screening_question_${i}`)} />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider />
                    </div>
                ))}

                <Row>
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <Form.Item name="target_population" label="Target Population" rules={[{required: true, message: 'Required'}]}>
                            <Select>
                                <Select.Option value="Assisted Living Facility - Resident">
                                    Assisted Living Facility - Resident
                                </Select.Option>
                                <Select.Option value="Assisted Living Facility – Staff">
                                    Assisted Living Facility – Staff
                                </Select.Option>
                                <Select.Option value="Skilled Nursing Facility (RCF) – Resident">
                                    Skilled Nursing Facility (RCF) – Resident
                                </Select.Option>
                                <Select.Option value="Skilled Nursing Facility (RCF) – Staff">
                                    Skilled Nursing Facility (RCF) – Staff
                                </Select.Option>
                                <Select.Option value="State of Ohio Dept. of Dev. Disabilities (DODD) – Resident">
                                    State of Ohio Dept. of Dev. Disabilities (DODD) – Resident
                                </Select.Option>
                                <Select.Option value="State of Ohio Dept. of Dev. Disabilities (DODD) – Staff">
                                    State of Ohio Dept. of Dev. Disabilities (DODD) – Staff
                                </Select.Option>
                                <Select.Option value="State of Ohio Veterans Home – Resident">
                                    State of Ohio Veterans Home – Resident
                                </Select.Option>
                                <Select.Option value="State of Ohio Veterans Home – Staff">
                                    State of Ohio Veterans Home – Staff
                                </Select.Option>
                                <Select.Option value="State of Ohio Mental Health and Addiction Services (MHAS) – Resident">
                                    State of Ohio Mental Health and Addiction Services (MHAS) – Resident
                                </Select.Option>
                                <Select.Option value="State of Ohio Mental Health and Addiction Services (MHAS) – Staff">
                                    State of Ohio Mental Health and Addiction Services (MHAS) – Staff
                                </Select.Option>
                                <Select.Option value="State of Ohio Dept. of Rehabilitation &amp; Correction – LTC Resident">
                                    State of Ohio Dept. of Rehabilitation &amp; Correction – LTC Resident
                                </Select.Option>
                                <Select.Option value="State of Ohio Dept. of Rehabilitation &amp; Correction – LTC Staff">
                                    State of Ohio Dept. of Rehabilitation &amp; Correction – LTC Staff
                                </Select.Option>
                                <Select.Option value="Congregate Care Facility – Resident">
                                    Congregate Care Facility – Resident
                                </Select.Option>
                                <Select.Option value="Congregate Care Facility – Staff">
                                    Congregate Care Facility – Staff
                                </Select.Option>
                                <Select.Option value="Hospital Worker – Clinical Staff">
                                    Hospital Worker – Clinical Staff
                                </Select.Option>
                                <Select.Option value="Hospital Worker – Administrative Staff">
                                    Hospital Worker – Administrative Staff
                                </Select.Option>
                                <Select.Option value="Hospital Worker – Ancillary Staff">
                                    Hospital Worker – Ancillary Staff
                                </Select.Option>
                                <Select.Option value="Non-Hospital Healthcare Worker – Administrative Staff">
                                    Non-Hospital Healthcare Worker – Administrative Staff
                                </Select.Option>
                                <Select.Option value="Non-Hospital Healthcare Worker – Ancillary Staff">
                                    Non-Hospital Healthcare Worker – Ancillary Staff
                                </Select.Option>
                                <Select.Option value="Non-Hospital Healthcare Worker – Clinical Staff">
                                    Non-Hospital Healthcare Worker – Clinical Staff
                                </Select.Option>
                                <Select.Option value="Emergency Medical Services (EMTs/Paramedics)">
                                    Emergency Medical Services (EMTs/Paramedics)
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Upload.Dragger
                    multiple={false}
                    showUploadList={false}
                    accept="image/*"
                    beforeUpload={file => {
                        setWorkId(file);
                        toBase64(file).then(setWorkIdPreview);
                        return false;
                    }}
                >
                    <Result
                        icon={(workId ? <CheckOutlined /> : <IdcardOutlined />)}
                        status={workId ? 'success' : 'info'}
                        title="Click Here to Upload Work ID"
                        subTitle="You are strongly encouraged to provide your Work ID."
                    />

                    {workIdPreview && <Image src={workIdPreview} width={256} /> }
                </Upload.Dragger>

                <Divider />

                <Typography.Title level={3}>Patient Confirmation</Typography.Title>

                <Typography.Paragraph>By signing your name, you agree to the following:</Typography.Paragraph>

                <ul>
                    <li>I hereby acknowledge access to or receipt of the Clark County Combined Health District’s (CCCHD) Notice of Health Information Privacy Practices (HIPAA)</li>
                    <li>I have completely read the provided information about the authorized COVID-19 vaccine and I have had an opportunity to ask questions concerning the benefits and risks of the COVID-19 vaccine. I have made a person decision to receive this vaccine. I understand that, as with all medical treatment, there is no guarantee that I will not experience an adverse side effect to the vaccine. I affirm that I will receive both dosages of the vaccine and I will sign up using the methods provided to me and keep my follow-up appointment.</li>
                    <li>I give CCCHD permission to administer a COVID-19 vaccine to myself or minor child age 16-17. </li>
                    <li>I authorize the release of my/minor’s record to the Ohio Department of Health Immunization Program.</li>
                </ul>

                <Row gutter={8} wrap>
                    <Col span={8}>
                        <Form.Item label="Signature of Client/Parent/Legal Guardian" name="signature_name" rules={[{required: true, message: 'Required'}]}>
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Print name of Client/Parent/Legal Guardian" name="print_name" rules={[{required: true, message: 'Required'}]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    {/* 
                    <Col span={8}>
                        <Form.Item label="Guardian Name" name="guardian_name" rules={[{required: true, message: 'Required'}]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    */}

                    <Col span={12}>
                        <Form.Item label="Signature Relationship to Patient" name="relationship">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="Date" name="signature_date" rules={[{required: true, message: 'Required'}]}>
                            <DatePicker  placeholder={dayjs().format("M/D/YYYY")} format="M/D/YYYY" style={{width: '100%'}} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" size="large" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default Apply;