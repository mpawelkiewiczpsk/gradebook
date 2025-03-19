import React from 'react';
import { Form, Input, Button, Typography, ConfigProvider, Carousel,Flex } from 'antd';
import styles from './LoginForm.module.css';
import img1 from './Images/LoginImage1.jpg';
import img2 from './Images/LoginImage2.jpg';
import img3 from './Images/LoginImage3.jpg';

const { Title } = Typography;

const LoginForm = ({ onLogin }) => {
    const onFinish = (values) => {
        onLogin(values);
    };

    return (
        <div className={styles.LoginBackground}>
            <div className={styles.Login}>
                <ConfigProvider theme={{ cssVar:true}}>
                    <Flex>
                        <Carousel 
                        className={styles.LoginCarousel} 
                        autoplay={{dotDuration:true}}
                        autoplaySpeed={4500}    
                        speed={3000}
                        dots={false}  
                        >
                            <img src={img1}/>
                            <img src={img2}/>
                            <img src={img3}/>
                        </Carousel>

                        <div className={styles.LoginForm}>
                            
                                <Title level={2} className={styles.LoginTitle}>Logowanie</Title>
                                <Form
                                    name="login"
                                    onFinish={onFinish}
                                    layout="vertical"
                                >
                                    <Form.Item
                                        label={<label className={styles.LoginFormLabel}>Username</label>}
                                        name="username"
                                        className={styles.LoginFormLabel}
                                        rules={[{ required: true, message: 'Wprowadź nazwę użytkownika!' }]}
                                    >
                                        <Input 
                                        className={styles.LoginFormInput}
                                        variant='borderless'
                                        autoComplete="off"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={<label className={styles.LoginFormLabel}>Password</label>}
                                        name="password"
                                        rules={[{ required: true, message: 'Wprowadź hasło!' }]}
                                    >
                                        <Input.Password 
                                        className={styles.LoginFormInput}
                                        variant='borderless'
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block className={styles.LoginButton}>
                                            Zaloguj
                                        </Button>
                                    </Form.Item>
                                </Form>
                        </div>
                    </Flex>
                </ConfigProvider>
            </div>
        </div>
    );
};

export default LoginForm;
