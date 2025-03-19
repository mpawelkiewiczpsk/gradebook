import React from 'react';
import { Collapse, Card, List, Tooltip, ConfigProvider } from 'antd';
import AddGrade from './AddGrade';
import Panel from 'antd/es/splitter/Panel';
import styles from './GradeList.module.css';
// import {PlusOutlined} from "@ant-design/icons"

const GradeList = ({ grades,role,token,students,fetchGrades }) => {
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
        <div className={styles.GradeListBackground}>
            <ConfigProvider theme={{ cssVar:true}}>
                <br/>
                <br/>
                <br/>
                {Object.keys(groupedGrades).length === 0 ? (
                    <p>Brak ocen do wyświetlenia.</p>
                ) : (
                    Object.keys(groupedGrades).map((subject) => (
                        <Card 
                        title={subject} 
                        className={styles.GradeListCard}
                        extra={role === 'student' ? (
                                <span style={{ marginRight: '8px' , color:'var(--Login-input-color)'}}>
                                    Średnia ważona: &nbsp; {
                                        (
                                            groupedGrades[subject].reduce(
                                            (sum, grade) => sum + Number(grade.grade) * Number(grade.weight || 1),
                                            0
                                            ) / groupedGrades[subject].reduce(
                                            (sum, grade) => sum + Number(grade.weight || 1),
                                            0
                                            )
                                        ).toFixed(2)
                                    }       
                                </span>
                            ) : (
                                <Tooltip title={`Dodaj nową ocenę z przedmiotu: ${subject}`}>
                                    <span>
                                        <AddGrade subject={subject} token={token} students={students} refreshGrades={fetchGrades} />
                                    </span>
                                </Tooltip>
                            )
                        } key={subject} style={{ marginBottom: '20px' }}>
                            <List
                                dataSource={groupedGrades[subject]}
                                renderItem={(item) => (
                                    <List.Item className={styles.GradeListLi}>
                                            <div
                                            style = {{
                                            fontWeight: item.isNew ? 'bold' : 'normal'  
                                            }}>Ocena: {item.grade} (ID: {item.id}, Waga: {item.weight})</div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    ))
                )}
            </ConfigProvider>
        </div>
    );
};

export default GradeList;
