import React, { useEffect, useState } from 'react';
import { Button, Result, Spin } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { axios } from '../lib/axios';
import { ErrorTypes, getError } from '../lib/error-lookup';

const Confirm = () => {
    const history = useHistory();
    const [status, setStatus] = useState('pending');
    const [error, setError] = useState<ErrorTypes | undefined>();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        axios.put('/api/patients/confirm_email', { token })
            .then(() => setStatus('success'))
            .catch(e => {
                setError(e.response.data.error);

                if (e.response.data.error === 'EMAIL_ALREADY_CONFIRMED') {
                    setStatus('moron');

                    setTimeout(() => {
                        history.push('/');
                    }, 5000);
                } else {
                    setStatus('error');
                }
            });
    }, [history]);

    if (status === 'pending') {
        return (
            <Result
                status="info"
                title="Loading..."
                subTitle={(
                    <span>Confirming your account, please be patient...</span>
                )}
                extra={[
                    <Spin size="large" key={1} />
                ]}
            />
        )
    }

    if (status === 'success') {
        return (
            <Result
                status="success"
                title="Account Confirmed!"
                subTitle={(
                    <span>Thank you for confirming your account. You can now access the Patient Portal and apply for the COVID-19 vaccine.</span>
                )}
                extra={[
                    <Link to="/login">
                        <Button type="primary">Login</Button>
                    </Link>
                ]}
            />
        );
    }

    if (status === 'error') {
        return (
            <Result
                status="error"
                title="Uh oh!"
                subTitle={error ? <span>{getError(error)}</span> : <span>We were unable to confirm your account.</span>}
            />
        )
    }

    if (status === 'moron') {
        return (
            <Result
                status="success"
                title="Email Already Confirmed!"
                subTitle={error === 'EMAIL_ALREADY_CONFIRMED' && <span>{getError(error)}</span>}
            />
        )
    }

    return null;
};

export default Confirm;