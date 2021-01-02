import React, { CSSProperties, useEffect, useState } from 'react';
import styles from './App.module.css';
import {
    DashboardOutlined,
    ExperimentOutlined,
    LogoutOutlined,
    OrderedListOutlined,
    SafetyCertificateOutlined,
    SolutionOutlined,
    UserOutlined
} from '@ant-design/icons';
import logo from './assets/VallurX Logo Dark Transparent.png';
import { useRouteMatch } from 'react-router';
import { axios } from './lib/axios';
import { Button, Layout, Menu } from 'antd';
import { BrowserRouter, Link } from 'react-router-dom';
import 'antd/dist/antd.min.css';

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
    const [inviteUserVisible, setInviteUserVisible] = useState(false);

    const routes = [
        { href: `/`, title: 'Dashboard', icon: <DashboardOutlined /> },
        { href: '/patient-information', title: 'Patient Information', icon: <UserOutlined /> },
        { href: '/apply', title: 'Vaccine Application', icon: <SolutionOutlined /> }
    ];

    const logOut = () => {
        localStorage.removeItem('session_id');
        localStorage.removeItem('user_id');
    };

    useEffect(() => {
        axios.defaults = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('session_id')
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

            <Layout.Content style={{padding: '0 50px', overflow: 'scroll'}}>
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
        <BrowserRouter>
            <AuthedWrapper>
                <h1>Hello World!</h1>
            </AuthedWrapper>
        </BrowserRouter>
    )
};

export default App;