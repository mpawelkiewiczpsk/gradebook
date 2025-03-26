import React from "react";
import {Typography,Button, Tooltip} from "antd";
import styles from './MenuBar.module.css';
import {RedoOutlined} from '@ant-design/icons';

const {Title} = Typography;

const MenuBar = ({role,logout,fetchGrades}) =>
{
    return(
        // <Menu
        // mode="horizontal"
        // theme="light"
        // // selectable={false}
        // className={styles.MenuBar}
        // > 
        <React.Fragment>
                <Button type="primary" danger onClick={logout} style={{height:'100%',borderRadius:0, width:100}}>
                    Wyloguj
                </Button>


                <Tooltip title='Odśwież oceny' mouseEnterDelay={1}>
                    <Button type="primary" onClick={()=>{fetchGrades(); message.success('Odświeżono oceny')}} style={{height:"100%", borderRadius:0, width:65}}>
                        <RedoOutlined />
                    </Button>
                </Tooltip>

                <Button  style={{ cursor: 'default', marginLeft:25, marginBottom:'auto', marginTop:'auto', background:'none'}} disabled>
                    <Title level={4} style={{margin: 0, color:'var(--Login-font-color)'}}>Zalogowano jako {role=='teacher' ? 'nauczyciel' : role=='student' ? 'uczen' : 'admin'} </Title>
                </Button>

                <Button style={{ cursor: 'default' , marginRight: '10px', marginLeft: 'auto', marginBottom:'auto', marginTop:'auto', background:'none'}} disabled>
                    <Title level={2} style={{ margin: 0, color:'var(--Login-font-color)'}}>Twoje Oceny</Title>
                </Button>


        </React.Fragment>
    )
}

export default MenuBar;