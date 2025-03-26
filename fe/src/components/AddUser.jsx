import React, {Component} from "react";
import {PlusOutlined} from "@ant-design/icons";
import { Button, message, Modal, Select, Input} from 'antd';
import styles from './AddUser.module.css';

class AddUser extends Component  
{
    state = {
        rolesList: [
            {id:1, role:'student'},
            {id:2, role:'teacher'},
            {id:3, role:'admin'}
        ],
        isModalVisible:false,
        selectedRole: null,
        typedUsername: '',
        typedPassword: '',
        subjects: [
            {id: 1, subject: 'Matematyka'},
            {id: 2, subject: 'Fizyka'},
            {id: 3, subject: 'Chemia'},
            {id: 4, subject: 'Biologia'},
            {id: 5, subject: 'Historia'},
            {id: 6, subject: 'Geografia'}
        ],
        selectedSubject1: null,
        selectedSubject2: null
    }

    toggleShowModalHandler = () => {
        const visible = this.state.isModalVisible;
        this.setState({isModalVisible: !visible}); 
    }

    addUserHandler = async () => {
        if(this.state.selectedRole != null 
            && (this.state.typedPassword != '' && !this.state.typedPassword.includes(' ')) 
            && (this.state.typedUsername != '' && !this.state.typedUsername.includes(' ')) ){

                const { selectedRole, typedPassword, typedUsername, selectedSubject1, selectedSubject2 } = this.state;
                            // Construct the payload with the selected values
                            const payload = {
                                username: typedUsername,
                                password: typedPassword,
                                role: selectedRole,
                                assigned_subject1: selectedSubject1,
                                assigned_subject2: selectedSubject2,
                            };

                            if(selectedRole==='teacher' && !selectedSubject1){
                                message.error('Nauczyciel musi mieć przynajmniej 1 przedmiot');
                            } else if(selectedSubject1 == selectedSubject2) {
                                message.error('Przedmioty nie mogą być takie same');
                            }else{
                        
                            try {
                                const response = await fetch("http://localhost:3000/users", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${this.props.token}`,
                                },
                                body: JSON.stringify(payload),
                                });
                        
                                if (!response.ok) {
                                const errorData = await response.json();
                                message.error(errorData.message || "Wystąpił błąd podczas dodawania użytkownika");
                                return;
                                }
                        
                                const data = await response.json();
                                message.success("Użytkownik został dodany!");
                                
                                this.props.refreshUsers(); // Fetch updated grades

                                this.setState({
                                selectedRole: null,
                                typedPassword: '',
                                typedUsername: '',
                                selectedSubject1: null,
                                selectedSubject2: null,
                                isModalVisible: false,

                                });
                            } catch (error) {
                                message.error("Błąd sieci: " + error.message);
                            }
                        }

        }else{
            message.error('Wypełnij formularz');
        }
    }

    render() {
        return(
            <div style={{position:'absolute', left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
                <Button 
                className={styles.AddUserButton}
                style={{padding:10}} 
                onClick={this.toggleShowModalHandler}
                type="primary"
                >
                    <PlusOutlined/> dodaj nowego użytkownika
                </Button>

                <Modal 
                title="Dodaj Użytkownika" 
                open={this.state.isModalVisible}
                onOk={this.addUserHandler}
                onCancel={this.toggleShowModalHandler}
                cancelText="Anuluj"
                okText="Dodaj Użytkownika"
                className={styles.AddUserModal}
                >

                    <Select
                        placeholder="Rola"
                        style={{ width: '100%',marginBottom:20 }}
                        onChange={(value) => this.setState({ selectedRole: value })}
                        variant="filled"
                        >
                        {this.state.rolesList.map((r) => (
                            <Select.Option key={r.id} value={r.role}>
                            {r.role}
                            </Select.Option>
                        ))}
                    </Select>

                    <Input
                        placeholder="Nazwa Użytkownika (baz spacji)"
                        style={{marginBottom:20 }}
                        value={this.typedUsername}
                        onChange={(e) => this.setState({ typedUsername: e.target.value })}
                        variant="filled"
                    />

                    <Input
                        placeholder="Hasło (baz spacji)"
                        style={{marginBottom:20 }}
                        value={this.typedPassword}
                        onChange={(e) => this.setState({ typedPassword: e.target.value })}
                        variant="filled"
                    />

                    {this.state.selectedRole === 'teacher' ? (
                    <div>
                        <Select
                            placeholder="Przedmiot nr 1"
                            style={{ width: '100%',marginBottom:20 }}
                            onChange={(value) => this.setState({ selectedSubject1: value })}
                            variant="filled">
                                {this.state.subjects.map((r) => (
                                <Select.Option key={r.id} value={r.subject}>
                                {r.subject}
                                </Select.Option>
                                ))}
                        </Select>

                        <Select
                            placeholder="Przedmiot nr 2 (opcjonalnie)"
                            style={{ width: '100%',marginBottom:20 }}
                            onChange={(value) => this.setState({ selectedSubject2: value })}
                            variant="filled"
                            allowClear
                            >
                                {this.state.subjects.map((r) => (
                                <Select.Option key={r.id} value={r.subject}>
                                {r.subject}
                                </Select.Option>
                                ))}
                        </Select>
                    </div>
                    ) : (null)}
                </Modal>
            </div>
        );
    }
}

export default AddUser;