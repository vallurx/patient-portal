import React, { CSSProperties, useState } from 'react';
import {
    Typography,
    AutoComplete,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Steps,
    notification, Result, Space, DatePicker
} from 'antd';
import { CheckCircleOutlined, LockOutlined, MailOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import logo from '../assets/VallurX Logo Light Transparent.png';
import { states } from '../lib/static-lists';
import { axios } from '../lib/axios';
import { PatientRegistration } from '../lib/types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const RegisterFormStyles: CSSProperties = {
    width: '70%',
    margin: 'auto'
};

const insuranceFields = [
    'insurance_name',
    'insurance_holder_name',
    'insurance_policy',
    'insurance_group',
    'insurance_phone',
    'insurance_address_street',
    'insurance_address_city',
    'insurance_address_state',
    'insurance_address_zip'
];

const Register = () => {
    const [patientInfoForm] = Form.useForm();
    const [patientInsuranceForm] = Form.useForm();
    const [accountInfoForm] = Form.useForm();

    const [patientData, setPatientData] = useState<PatientRegistration>({} as PatientRegistration);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const generatePassword = () => {
        const length = 12;
        const lowerCharset = 'abcdefghijklmnopqrstuvwxyz';
        const upperCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberCharset = '0123456789';
        const specialCharset = '@$!%*?&#';
        const charsetArray = [lowerCharset, upperCharset, numberCharset, specialCharset];

        let retVal = '';

        for (let i = 0; i < length; i++) {
            if (i < 4) {
                retVal += charsetArray[i].charAt(Math.floor(Math.random() * charsetArray[i].length));
            } else {
                const randType = Math.floor(Math.random() * 4);
                const randCharset = charsetArray[randType];

                retVal += randCharset.charAt(Math.floor(Math.random() * randCharset.length));
            }
        }

        notification.success({
            message: 'Secure Password',
            description: (
                <span>
                    Your secure password is<br />
                    <code><Typography.Text copyable>{retVal}</Typography.Text></code><br />
                    This password was generated in the browser and not stored anywhere.
                </span>
            ),
            duration: 10
        });
    };

    const insuranceFormValidator = ({ getFieldValue }: any) => ({
        validator(rule: any, value: string) {
            const insuranceFields = [
                getFieldValue('insurance_name'),
                getFieldValue('insurance_holder_name'),
                getFieldValue('insurance_policy'),
                getFieldValue('insurance_phone'),
                getFieldValue('insurance_address_street'),
                getFieldValue('insurance_address_city'),
                getFieldValue('insurance_address_state'),
                getFieldValue('insurance_address_zip'),
                getFieldValue('insurance_group'),
            ];

            if (insuranceFields.every(val => !!val) || value) {
                return Promise.resolve();
            }

            return Promise.reject('Must provide either your insurance information OR your SSN.');
        },
    });

    const ssnFormValidator = ({ getFieldValue }: any) => ({
        validator(rule: any, value: string) {
            if (getFieldValue('ssn') || value) {
                return Promise.resolve();
            }

            return Promise.reject('Must provide either your insurance information OR your SSN.');
        },
    });

    const registerUser = async (accountData: { password: string }) => {
        setLoading(true);

        try {
            const formData: Partial<PatientRegistration> = Object.assign({}, patientData);
            delete formData.confirm;
            await axios.put('/api/patients/register', {
                ...formData,
                date_of_birth: formData.date_of_birth?.format('MM/DD/YYYY'),
                password: accountData.password
            });

            setCurrentStep(3);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={RegisterFormStyles}>
            <Card>
                <div>
                    <img alt="Logo" src={logo} className="logo" />
                </div>

                <Steps current={currentStep}>
                    <Steps.Step title="Patient Information" icon={<UserOutlined />} />
                    <Steps.Step title="Patient Insurance" icon={<SolutionOutlined />} />
                    <Steps.Step title="Account Information" icon={<LockOutlined />} />
                    <Steps.Step title="Done" icon={<CheckCircleOutlined />} />
                </Steps>

                {currentStep === 0 && (
                    <Form
                        form={patientInfoForm}
                        layout="vertical"
                        initialValues={{suffix: '', middle_initial: ''}}
                        onFinish={data => {
                            setPatientData(prevState => ({...prevState, ...data, is_mobile: data.is_mobile === 'yes'}));
                            setCurrentStep(1);
                        }}
                    >
                        <Divider orientation="left">Patient Name</Divider>

                        <Row gutter={8}>
                            <Col span={7}>
                                <Form.Item label="First Name" name="first_name" rules={[{required: true, message: 'Required'}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label="Middle Initial" name="middle_initial">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label="Last Name" name="last_name" rules={[{required: true, message: 'Required'}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item label="Suffix" name="suffix">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">Personal Records</Divider>

                        <Row gutter={8}>
                            <Col span={6}>
                                <Form.Item
                                    label="Date of Birth"
                                    name="date_of_birth"
                                    rules={[{required: true, message: 'Required'}]}
                                >
                                    <DatePicker style={{width: '100%'}} format="M/D/YYYY" placeholder={dayjs().format("M/D/YYYY")} />
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item label="Sex" name="sex" rules={[{required: true, message: 'Required'}]}>
                                    <AutoComplete
                                        options={[
                                            { label: 'Male', value: 'Male' },
                                            { label: 'Female', value: 'Female' },
                                            { label: 'Transgender', value: 'Transgender' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item label="Race" name="race" rules={[{required: true, message: 'Required'}]}>
                                    <AutoComplete
                                        options={[
                                            { label: 'American Indian', value: 'American Indian' },
                                            { label: 'Asian', value: 'Asian' },
                                            { label: 'Black', value: 'Black' },
                                            { label: 'Pacific Islander', value: 'Pacific Islander' },
                                            { label: 'White', value: 'White' }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item label="Ethnicity" name="ethnicity" rules={[{required: true, message: 'Required'}]}>
                                    <Select>
                                        <Select.Option value="nonhispanic">Non-Hispanic</Select.Option>
                                        <Select.Option value="hispanic">Hispanic</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">Contact Information</Divider>

                        <Row gutter={8} wrap>
                            <Col span={8}>
                                <Form.Item name="address_street" label="Street Address" rules={[{required: true, message: 'Required'}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="address_city" label="City" rules={[{required: true, message: 'Required'}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="address_state" label="State" rules={[{required: true, message: 'Required'}]}>
                                    <Select optionFilterProp="name" showSearch={true}>
                                        {states.map(state => (
                                            <Select.Option key={state.abbreviation} name={state.name} value={state.abbreviation}>{state.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="address_zip" label="Zip" rules={[{required: true, message: 'Required'}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="address_county" label="County" rules={[{required: true, message: 'Required'}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <Form.Item
                                    name="phone_number"
                                    label="Phone Number"
                                    rules={[
                                        {required: true, message: 'Required'},
                                        {pattern: /^(\d{3})-?(\d{3})-?(\d{4})$/, message: 'Must be a valid phone number!'}
                                    ]}
                                >
                                    <Input
                                        addonBefore={(
                                            <Form.Item name="is_mobile" noStyle rules={[{required: true, message: 'Required'}]}>
                                                <Select style={{ width: 120 }}>
                                                    <Select.Option value="yes">Mobile</Select.Option>
                                                    <Select.Option value="no">Home</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        )}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="email" label="Email" rules={[{required: true, message: 'Required'}, {type: 'email', message: 'Must be a valid email!'}]}>
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="Employer" name="employer" rules={[{required: true, message: 'Required'}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Next
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                )}

                {currentStep === 1 && (
                    <Form
                        form={patientInsuranceForm}
                        layout="vertical"
                        initialValues={{
                            insurance_name: '',
                            insurance_holder_name: '',
                            insurance_holder_relationship: '',
                            insurance_policy: '',
                            insurance_group: '',
                            insurance_phone: '',
                            insurance_address_street: '',
                            insurance_address_city: '',
                            insurance_address_state: '',
                            insurance_address_zip: '',
                            ssn: ''
                        }}
                        onFinish={data => {
                            setPatientData(prevState => ({...prevState, ...data}));
                            setCurrentStep(2);
                        }}
                    >
                        <Divider />

                        <Row gutter={8}>
                            <Col span={8}>
                                <Form.Item
                                    name="insurance_name"
                                    label="Insurance Name"
                                    dependencies={['ssn']}
                                    rules={[
                                        ssnFormValidator
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="insurance_holder_name"
                                    label="Insurance Holder Name"
                                    dependencies={['ssn']}
                                    rules={[
                                        ssnFormValidator
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="insurance_holder_relationship"
                                    label="Insurance Holder Relationship"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <Form.Item
                                    name="insurance_policy"
                                    label="Policy Number"
                                    dependencies={['ssn']}
                                    rules={[
                                        ssnFormValidator
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="insurance_group"
                                    label="Group Number"
                                    dependencies={['ssn']}
                                    rules={[
                                        ssnFormValidator
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="insurance_phone"
                                    label="Insurance Phone"
                                    dependencies={['ssn']}
                                    rules={[
                                        ssnFormValidator
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={6}>
                                <Form.Item
                                    name="insurance_address_street"
                                    label="Street Address"
                                    dependencies={['ssn']}
                                    rules={[
                                        ssnFormValidator
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="insurance_address_city"
                                    label="City"
                                    dependencies={['ssn']}
                                    rules={[
                                        ssnFormValidator
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="insurance_address_state"
                                    label="State"
                                    dependencies={['ssn']}
                                    rules={[
                                        ssnFormValidator
                                    ]}
                                >
                                    <Select>
                                        {states.map(state => (
                                            <Select.Option key={state.abbreviation} value={state.abbreviation}>{state.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="insurance_address_zip"
                                    label="Zip"
                                    dependencies={['ssn']}
                                    rules={[
                                        ssnFormValidator
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider>Or</Divider>

                        <div style={{width: '50%', margin: 'auto'}}>
                            <Form.Item
                                name="ssn"
                                label="Social Security Number"
                                dependencies={insuranceFields}
                                rules={[
                                    {pattern: /^(\d{3})-?(\d{2})-?(\d{4})$/, message: 'Must be a valid SSN!'},
                                    insuranceFormValidator
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </div>

                        <Form.Item>
                            <Space>
                                <Button onClick={() => setCurrentStep(0)}>
                                    Back
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Next
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                )}

                {currentStep === 2 && (
                    <Form
                        form={accountInfoForm}
                        layout="vertical"
                        onFinish={data => registerUser(data)}
                        style={{width: '50%', margin: 'auto'}}
                    >
                        <Divider />

                        <Form.Item
                            label="Email"
                            name="email"
                            initialValue={patientInfoForm.getFieldValue('email')}
                            help="You will log into your account using this email. It matches your contact email."
                        >
                            <Input size="large" disabled />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Password is required.' },
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}$/,
                                    message: 'Password requires upper and lowercase letters, a number and special character, and must be at least 12 characters long.'
                                }
                            ]}
                        >
                            <Input.Password size="large" addonAfter={(
                                <Button type="link" onClick={generatePassword}>
                                    Generate Password
                                </Button>
                            )} />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Passwords do not match!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('The two passwords that you entered do not match!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password size="large" />
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button onClick={() => setCurrentStep(1)}>
                                    Back
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Create Account
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                )}

                {currentStep === 3 && (
                    <Result
                        status="info"
                        icon={<MailOutlined />}
                        title="Account Registered!"
                        subTitle={(
                            <span>Now that you have created an account, you can apply for the COVID-19 vaccine on your Patient Dashboard. Please check your email for a confirmation from VallurX to continue.</span>
                        )}
                        extra={[
                            <Link to="/login" key={1}>
                                <Button type="primary">Login</Button>
                            </Link>
                        ]}
                    />
                )}
            </Card>
        </div>
    )
};

export default Register;
