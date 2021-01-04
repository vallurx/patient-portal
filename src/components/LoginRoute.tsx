import React, { useCallback } from 'react';

import { Redirect, Route, RouteProps } from 'react-router';
import { usePatient } from '../lib/data/use-patient';
import { Spin } from 'antd';

interface LoginRouteProps extends RouteProps {
    children: any;
}

const LoginRoute = (props: LoginRouteProps) => {
    const {children, ...rest} = props;
    const { patient, loading, error } = usePatient();

    const routeRender = useCallback(({location}: any) => {
        if (loading) {
            return <Spin spinning>Loading...</Spin>
        }

        return patient && !error ? (
            <Redirect to={{pathname: '/', state: {from: location}}}/>
        ) : (
            children);
        },
        [patient, children, loading, error]
    );

    return <Route {...rest} render={routeRender}/>;
};

export default LoginRoute;