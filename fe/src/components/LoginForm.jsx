import React from 'react';
import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

const LoginForm = ({ onLogin }) => {
    const onFinish = (values) => {
        onLogin(values);
    };

    return (
        <div style={{ maxWidth: 300, margin: '0 auto', marginTop: 50 }}>
            <Title level={2} style={{ textAlign: 'center' }}>Logowanie</Title>
            <Form
                name="login"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Wprowadź nazwę użytkownika!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Wprowadź hasło!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Zaloguj
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginForm;
