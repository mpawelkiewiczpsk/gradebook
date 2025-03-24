import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import GradeList from './components/GradeList';
import UserList from './components/UserList';
import { message, Button, Menu, Typography, Tooltip } from 'antd';
import {RedoOutlined} from '@ant-design/icons';
import styles from './App.module.css';

const { Title } = Typography;

function App() {
    const [token, setToken] = useState('');
    const [grades, setGrades] = useState([]);
    const [role, setRole] = useState('');
    const [students,setStudents] = useState([]);
    const [users, setUsers] = useState([]);

    // Obsługa logowania
    const handleLogin = async (values) => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });
            if (!response.ok) {
                const err = await response.json();
                message.error(err.message || 'Błąd logowania');
                return;
            }
            const data = await response.json();
            // console.log(JSON.stringify(values));
            setRole(data.role)
            setToken(data.token);
            message.success('Zalogowano pomyślnie');
        } catch (error) {
            message.error('Błąd podczas logowania');
        }
    };

    // Pobieranie ocen
    const fetchGrades = async (newGradeId = null) => {
        try {
            const response = await fetch('http://localhost:3000/grades', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                message.error('Błąd pobierania ocen');
                return;
            }
            const data = await response.json();
            const updatedGrades = data.map(grade => ({
                ...grade,
                isNew: grade.id === newGradeId // Set isNew to true for the new grade
            }));
            setGrades(updatedGrades);
        } catch (error) {
            message.error('Błąd pobierania ocen');
        }
    };
    
    const loadStudents = async () => {
    try {
        const response = await fetch('http://localhost:3000/students', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const err = await response.json();
            console.log(err.message || 'Błąd Pobierania Uczniów');
            return;
        }
        const data = await response.json();
        console.log("http: "+ data);
        setStudents(data)
        // this.setState({studentsList: data})
    } catch (error) {
        console.log('Błąd podczas pobierania uczniów');
    }
};

const loadUsers = async () => {
    try {
        const response = await fetch('http://localhost:3000/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const err = await response.json();
            console.log(err.message || 'Błąd Pobierania Użytkowników');
            return;
        }
        const data = await response.json();
        console.log("http: "+ data);
        setUsers(data);
    } catch (error) {
        console.log('Błąd podczas pobierania użytkowików');
    }
};

    // useEffect(() =>{
    //     loadStudents();
    // },[])

    // Po zmianie tokena pobieramy oceny
    useEffect(() => {
        loadStudents()
        if (token) {
            fetchGrades();
            if (role == 'admin'){
            loadUsers();
            }
        }
    }, [token]);

    // Funkcja wylogowania
    const handleLogout = () => {
        setToken('');
        setGrades([]);
        message.success('Wylogowano pomyślnie');
    };

    return (
        <div>
            {!token ? (
                <LoginForm onLogin={handleLogin} />
            ) : (
                <>
                    {/* <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}> */}
                    {/* <Menu className={styles.Menu}>
                        <Button type="primary" onClick={()=>{fetchGrades()}} style={{margin:'0 5px',padding:10}}>
                            <RedoOutlined />
                        </Button>


                        <Button type="primary" danger onClick={handleLogout} style={{margin:'0 5px'}}>
                            Wyloguj
                        </Button>
                    </Menu> */}
                    <Menu
                    mode="horizontal"
                    theme="light"
                    // selectable={false}
                    className={styles.Menu}
                    > 
                        <Menu.Item style={{padding:0}}>
                            <Button type="primary" danger onClick={handleLogout} style={{height:'100%',borderRadius:0, width:100}}>
                                Wyloguj
                            </Button>
                        </Menu.Item>
                        
                        <Menu.Item style={{padding:0}}>
                            <Tooltip title='Odśwież oceny' mouseEnterDelay={1}>
                                <Button type="primary" onClick={()=>{fetchGrades(); message.success('Odświeżono oceny')}} style={{height:"100%", borderRadius:0, width:50}}>
                                    <RedoOutlined />
                                </Button>
                            </Tooltip>
                        </Menu.Item>

                        <Menu.Item style={{ cursor: 'default', marginLeft:25, marginBottom:'auto', marginTop:'auto'}} disabled>
                            <Title level={4} style={{margin: 0, color:'var(--Login-font-color)'}}>Zalogowano jako {role=='teacher' ? 'nauczyciel' : role=='uczen' ? 'uczen' : 'admin'} </Title>
                        </Menu.Item>

                        <Menu.Item style={{ cursor: 'default' , marginRight: '10px', marginLeft: 'auto', marginBottom:'auto', marginTop:'auto'}} disabled>
                            <Title level={2} style={{ margin: 0, color:'var(--Login-font-color)' }}>Twoje Oceny</Title>
                        </Menu.Item>

                    </Menu>
                    {/* </div> */}
                    <GradeList grades={grades} role={role} token={token} students={students} fetchGrades={fetchGrades}/>
                    {role == 'admin' ? 
                    <UserList 
                        users={users}
                        token={token}
                        refreshUsers={loadUsers}
                        /> 
                    : null}
                </>
            )}
        </div>
    );
}

export default App;
