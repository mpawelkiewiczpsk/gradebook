import React, {Component} from "react";
import {PlusOutlined} from "@ant-design/icons";
import { Button, message, Modal, Select, Input} from 'antd';

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
        typedPassword: ''
    }

    toggleShowModalHandler = () => {
        const visible = this.state.isModalVisible;
        this.setState({isModalVisible: !visible}); 
    }

    addUserHandler = async () => {
        if(this.state.selectedRole != null 
            && (this.state.typedPassword != '' && !this.state.typedPassword.includes(' ')) 
            && (this.state.typedUsername != '' && !this.state.typedUsername.includes(' '))){

                const { selectedRole, typedPassword, typedUsername } = this.state;
                            // Construct the payload with the selected values
                            const payload = {
                                username: typedUsername,
                                password: typedPassword,
                                role: selectedRole,
                            };
                        
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
                                isModalVisible: false,

                                });
                            } catch (error) {
                                message.error("Błąd sieci: " + error.message);
                            }

        }else{
            message.error('Wypełnij formularz');
        }
    }

    render() {
        return(
            <div>
                <Button 
                style={{padding:10}} 
                onClick={this.toggleShowModalHandler}
                type="primary"
                >
                    <PlusOutlined/>
                </Button>

                <Modal 
                title="Dodaj Użytkownika" 
                open={this.state.isModalVisible}
                onOk={this.addUserHandler}
                onCancel={this.toggleShowModalHandler}
                cancelText="Anuluj"
                okText="Dodaj Użytkownika"
                >

                <Select
                    style={{ width: 120 }}
                    onChange={(value) => this.setState({ selectedRole: value })}
                    >
                    {this.state.rolesList.map((r) => (
                        <Select.Option key={r.id} value={r.role}>
                        {r.role}
                        </Select.Option>
                    ))}
                </Select>

                <Input
                    placeholder="Username (no spaces)"
                    value={this.typedUsername}
                    onChange={(e) => this.setState({ typedUsername: e.target.value })}
                />

                <Input
                    placeholder="Password (no spaces)"
                    value={this.typedPassword}
                    onChange={(e) => this.setState({ typedPassword: e.target.value })}
                />

                </Modal>
            </div>
        );
    }
}

export default AddUser;