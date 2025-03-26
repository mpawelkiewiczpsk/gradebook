import React, { useEffect, useState } from 'react';
import { Layout,Menu, Card, List, Tooltip, ConfigProvider, Table, Button, message} from 'antd';
import AddGrade from './AddGrade';
import MenuBar from './MenuBar';
import styles from './GradeList.module.css';
import Sider from 'antd/es/layout/Sider';
import { Content,Header } from 'antd/es/layout/layout';
import UserList from './UserList';
// import Panel from 'antd/es/splitter/Panel';
// import {PlusOutlined} from "@ant-design/icons"

// const CurrentContent = (currentContentChosen)=>
// {
//     switch(currentContentChosen)
//     {
//         case 'grades':
//         return (<div>elo grades</div>);
//         case 'users':
//         return (<div>elo grades</div>);
//     }
// }

const GradeList = ( {grades,role,token,students,fetchGrades,logout,users,refreshUsers} ) => {
    
    const [currentContentChosen, setCurrentContentChosen] = useState("grades");
    const [columns, setColumns] = useState( [
        {
          title: 'Ocena',
          dataIndex: 'grade',
          key: 'grade',
        },
        {
          title: 'Waga',
          dataIndex: 'weight',
          key: 'weight',
        }
      ]);
    
    // Grupowanie ocen wg przedmiotów
    const groupedGrades = grades.reduce((acc, grade) => {
        const { subject } = grade;
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(grade);
        return acc;
    }, {});

    // setDataSource(oldDataSource=>[...oldDataSource,{
    //     key: '2',
    //     name: 'Mike2',
    //     age: 32,
    //     address: '10 Downing Street',
    //   }]);
      
    //   const columns = [
    //     {
    //       title: 'Ocena',
    //       dataIndex: 'grade',
    //       key: 'grade',
    //     },
    //     {
    //       title: 'Waga',
    //       dataIndex: 'weight',
    //       key: 'weight',
    //     }
    //   ];

        useEffect(()=>{
            role === 'student'? 
        null
        :
            setColumns([...columns,
                {
                title: 'UczenId',
                dataIndex: 'studentId',
                key: 'studentId',
                }
            ]);
        },[])

    return (
        <div className={styles.GradeListBackground}>
            <ConfigProvider theme={{ cssVar:true}}>
                {/* <br/>
                <br/>
                <br/> */}
                <Layout>
                    <Header className={styles.GradeListHeader}>
                        <MenuBar role={role} logout={logout} fetchGrades={fetchGrades} />
                    </Header>

                    <Layout>
                        <Sider style={{marginTop:64, position:'fixed', height:'calc(100% - 64px)'}} className={styles.GradeListSider}>
                            <Menu theme='dark' defaultSelectedKeys={['1']}>
                                <Menu.Item key="1" className={styles.GradeListMenuItem} onClick={()=>{setCurrentContentChosen("grades")}}>
                                    Oceny
                                    {/*<Button onClick={()=>{setCurrentContentChosen("grades")}} type="text">Oceny</Button>*/}
                                </Menu.Item>
                                
                                {role === "admin" ? <Menu.Item className={styles.GradeListMenuItem} onClick={()=>{setCurrentContentChosen("users")}}>Użytkownicy</Menu.Item>:null}
                            </Menu>
                        </Sider>

                    
                        <Content 
                        // style={{marginTop:64, overflow: 'auto',overflowY:'scroll',marginLeft: 200, width:'75%',height:'calc(100vh - 64px)'}} 
                        className={styles.GradeListContent}>
                            {currentContentChosen == "grades" ? (
                                Object.keys(groupedGrades).length === 0 ? (
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
                                            {/* <List
                                                dataSource={groupedGrades[subject]}
                                                renderItem={(item) => (
                                                    <List.Item className={styles.GradeListLi}>
                                                            <div
                                                            style = {{
                                                            fontWeight: item.isNew ? 'bold' : 'normal'  
                                                            }}>Ocena: {item.grade} (ID: {item.id}, Waga: {item.weight})</div>
                                                    </List.Item>
                                                )}
                                            /> */}
                                            <Table dataSource={groupedGrades[subject]} columns={columns} pagination={false} rowHoverable={false} className={styles.GradeListTable}/>
                                        </Card>
                                    ))
                                )
                            ):(<UserList 
                                users={users}
                                token={token}
                                refreshUsers={refreshUsers}
                                /> ) }
                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </div>
    );
};

export default GradeList;
