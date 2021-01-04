import React, { useCallback } from 'react';

import { Redirect, Route, RouteProps } from 'react-router';
import { usePatient } from '../lib/data/use-patient';
import { Spin } from 'antd';

interface AuthenticatedRouteProps extends RouteProps {
    children: any;
}

const AuthenticatedRoute = (props: AuthenticatedRouteProps) => {
    const {children, ...rest} = props;
    const { patient, loading, error } = usePatient();

    const routeRender = useCallback(({location}: any) => {
        if (loading) {
            return <Spin spinning>Loading...</Spin>
        }

        return patient && !error ? (
            children
        ) : (
            <Redirect to={{pathname: '/login', state: {from: location}}}/>);
        },
        [patient, children, loading, error]
    );

    return <Route {...rest} render={routeRender}/>;
};

export default AuthenticatedRoute;