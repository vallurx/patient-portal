import React, { CSSProperties, useEffect } from 'react';
import styles from './App.module.css';
import {
    DashboardOutlined,
    LogoutOutlined,
    SolutionOutlined,
    UserOutlined
} from '@ant-design/icons';
import logo from './assets/VallurX Logo Dark Transparent.png';
import { Route, useRouteMatch } from 'react-router-dom';
import { axios } from './lib/axios';
import { Button, Layout, Menu, Result } from 'antd';
import { BrowserRouter, Link, Switch } from 'react-router-dom';
import 'antd/dist/antd.min.css';
import Login from './routes/Login';
import Register from './routes/Register';
import Confirm from './routes/Confirm';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import LoginRoute from './components/LoginRoute';
import Dashboard from './routes/Dashboard';
import PatientInformation from './routes/PatientInformation';
import Apply from './routes/Apply';
import Schedule from './routes/Schedule';
import { usePatient } from './lib/data/use-patient';

const logoStyles: CSSProperties = {
    margin: '0 20px',
    maxHeight: '100%',
    width: '180px'
};

const LoginWrapper = (props: { children: any }) => {
    return (
        <Layout className={styles.Layout}>
            <Layout.Content style={{padding: '50px'}}>
                {props.children}
            </Layout.Content>
            <Layout.Footer style={{textAlign: 'center'}}>VallurX 2020</Layout.Footer>
        </Layout>
    );
};

const AuthedWrapper = (props: { children: any }) => {
    const asPath = useRouteMatch();
    const { patient, mutate } = usePatient();

    const routes = [
        { href: `/`, title: 'Dashboard', icon: <DashboardOutlined /> },
        { href: '/patient-information', title: 'Patient Information', icon: <UserOutlined /> },
        { href: '/apply', title: 'Vaccine Application', icon: <SolutionOutlined /> }
    ];

    const logOut = () => {
        localStorage.removeItem('patient_session_id');
        localStorage.removeItem('patient_user_id');
        mutate();
    };

    useEffect(() => {
        axios.defaults = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('patient_session_id')
            }
        }
    });

    return (
        <Layout className={styles.Layout}>
            <Layout.Header style={{display: 'flex'}}>
                <Link to="/">
                    <img style={logoStyles} src={logo} alt="logo"/>
                </Link>
                <Menu theme="dark" mode="horizontal" selectedKeys={[asPath.url]}>
                    {routes.map(route => (
                        <Menu.Item key={route.href} icon={route.icon}>
                            <Link to={route.href}>
                                {route.title}
                            </Link>
                        </Menu.Item>
                    ))}
                </Menu>
                <div style={{flex: 1}} />
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item icon={<LogoutOutlined />} onClick={logOut}>
                        Log Out
                    </Menu.Item>
                </Menu>
            </Layout.Header>

            <Layout.Content className={styles.LayoutContent}>
                <div className={styles.Content}>
                    {props.children}
                </div>
            </Layout.Content>
            <Layout.Footer style={{textAlign: 'center'}}>VallurX 2020</Layout.Footer>
        </Layout>
    );
};

const App = () => {
    return (
        <BrowserRouter basename={process.env.NODE_ENV === 'production' ? '/patient' : ''}>
            <Switch>
                <LoginRoute path="/login" exact>
                    <LoginWrapper>
                        <Login />
                    </LoginWrapper>
                </LoginRoute>

                <LoginRoute path="/register" exact>
                    <LoginWrapper>
                        <Register />
                    </LoginWrapper>
                </LoginRoute>

                <LoginRoute path="/confirm" exact>
                    <LoginWrapper>
                        <Confirm />
                    </LoginWrapper>
                </LoginRoute>

                <AuthenticatedRoute path="/" exact>
                    <AuthedWrapper>
                        <Dashboard />
                    </AuthedWrapper>
                </AuthenticatedRoute>

                <AuthenticatedRoute path="/patient-information" exact>
                    <AuthedWrapper>
                        <PatientInformation />
                    </AuthedWrapper>
                </AuthenticatedRoute>

                <AuthenticatedRoute path="/apply" exact>
                    <AuthedWrapper>
                        <Apply />
                    </AuthedWrapper>
                </AuthenticatedRoute>

                <AuthenticatedRoute path="/schedule/:id" exact>
                    <AuthedWrapper>
                        <Schedule />
                    </AuthedWrapper>
                </AuthenticatedRoute>

                <Route>
                    <LoginWrapper>
                        <Result
                            status="404"
                            title="404"
                            subTitle="Sorry, the page you visited does not exist."
                            extra={(
                                <Link to="/">
                                    <Button type="primary">Back Home</Button>
                                </Link>
                            )}
                        />
                    </LoginWrapper>
                </Route>
            </Switch>
        </BrowserRouter>
    )
};

export default App;