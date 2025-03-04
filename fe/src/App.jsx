import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import GradeList from './components/GradeList';
import { message, Button } from 'antd';

function App() {
    const [token, setToken] = useState('');
    const [grades, setGrades] = useState([]);

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
            setToken(data.token);
            message.success('Zalogowano pomyślnie');
        } catch (error) {
            message.error('Błąd podczas logowania');
        }
    };

    // Pobieranie ocen
    const fetchGrades = async () => {
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
            setGrades(data);
        } catch (error) {
            message.error('Błąd pobierania ocen');
        }
    };

    // Po zmianie tokena pobieramy oceny
    useEffect(() => {
        if (token) {
            fetchGrades();
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
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                        <Button type="primary" danger onClick={handleLogout}>
                            Wyloguj
                        </Button>
                    </div>
                    <GradeList grades={grades} />
                </>
            )}
        </div>
    );
}

export default App;
