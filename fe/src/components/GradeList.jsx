import React from 'react';
import { Card, List, Typography } from 'antd';

const { Title } = Typography;

const GradeList = ({ grades }) => {
    // Grupowanie ocen wg przedmiotów
    const groupedGrades = grades.reduce((acc, grade) => {
        const { subject } = grade;
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(grade);
        return acc;
    }, {});

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Twoje Oceny</Title>
            {Object.keys(groupedGrades).length === 0 ? (
                <p>Brak ocen do wyświetlenia.</p>
            ) : (
                Object.keys(groupedGrades).map((subject) => (
                    <Card title={subject} key={subject} style={{ marginBottom: '20px' }}>
                        <List
                            dataSource={groupedGrades[subject]}
                            renderItem={(item) => (
                                <List.Item>
                                    <div>Ocena: {item.grade} (ID: {item.id})</div>
                                </List.Item>
                            )}
                        />
                    </Card>
                ))
            )}
        </div>
    );
};

export default GradeList;
