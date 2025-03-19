import React, {Component} from "react";
import {PlusOutlined} from "@ant-design/icons";
import { Button, message, Modal, Select,ConfigProvider} from 'antd';
import styles from './AddGrade.module.css';

class AddGrade extends Component
{
    // const[isModalVisible,setIsModalVisible] = useState(false);
    state = 
    {
        gradesList:[
            {id:1,grade:1},
            {id:2,grade:2},
            {id:3,grade:3},
            {id:4,grade:4},
            {id:5,grade:5},
            {id:6,grade:6}
        ],
        weightList:[
            {id:1,weight:1},
            {id:2,weight:2},
            {id:3,weight:3},
            {id:4,weight:4},
            {id:5,weight:5}
        ],
        studentsList:this.props.students,
        isModalVisible:false,
        selectedStudent:null,
        selectedGrade:null,
        selectedWeight:null
    }


    // loadStudents = async () => {
    //     try {
    //         const response = await fetch('http://localhost:3000/students', {
    //             headers: {
    //                 'Authorization': `Bearer ${this.props.token}`
    //             }
    //         });
    //         if (!response.ok) {
    //             const err = await response.json();
    //             console.log(err.message || 'Błąd Pobierania Uczniów');
    //             return;
    //         }
    //         const data = await response.json();
    //         console.log("http: "+JSON.stringify(data));
    //         // setStudents(JSON.stringify(data))
    //         this.setState({studentsList: data})
    //     } catch (error) {
    //         console.log('Błąd podczas pobierania uczniów');
    //     }
    // };

    // componentDidMount()
    // {
    //     this.loadStudents();
    // }
   
    toggleShowModalHandler = () =>{
        // alert("dodano ocene czy coś");
        // <Modal></Modal>
        // toggleVisibleModal();
        this.setState({
            selectedStudent:null,
            selectedGrade:null,
            selectedWeight:null
        })
        const visible = this.state.isModalVisible;
        this.setState({isModalVisible: !visible});
    }   

    addGradeHandler = async () =>
    {
        if(this.state.selectedGrade != null && this.state.selectedStudent != null && this.state.selectedWeight != null){

            const { selectedStudent, selectedGrade, selectedWeight } = this.state;
            const subject = this.props.subject;

            // Construct the payload with the selected values
            const payload = {
                studentId: selectedStudent,
                grade: selectedGrade,
                weight: selectedWeight,
                subject: subject,
            };
        
            try {
                const response = await fetch("http://localhost:3000/grades", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.props.token}`, // using teacher's token
                },
                body: JSON.stringify(payload),
                });
        
                if (!response.ok) {
                const errorData = await response.json();
                message.error(errorData.message || "Wystąpił błąd podczas dodawania oceny");
                return;
                }
        
                const data = await response.json();
                message.success("Ocena została dodana!");
                
                this.props.refreshGrades(data.id); // Fetch updated grades
                // Clear selections and close the modal after successful submission
                this.setState({
                selectedStudent: null,
                selectedGrade: null,
                selectedWeight: null,
                isModalVisible: false,
                });
            } catch (error) {
                message.error("Błąd sieci: " + error.message);
            }

        }else{
                message.error("Wypełnij formularz");
        }
        
    }

    render()
    {   
        
        return (
            <div>
            <ConfigProvider theme={{ cssVar:true}}>
                <Button 
                style={{padding:10}} 
                onClick={this.toggleShowModalHandler}
                className={styles.AddGradeButton}
                type="primary"
                >
                    <PlusOutlined/>
                </Button>



                <Modal 
                title="Dodaj Ocene" 
                open={this.state.isModalVisible}
                onOk={this.addGradeHandler}
                onCancel={this.toggleShowModalHandler}
                cancelText="Anuluj"
                okText="Dodaj Ocenę"
                className={styles.AddGradeModal}
                >

                    <Select
                    placeholder="Wybierz Ocenę"
                    value={this.state.selectedGrade}
                    onChange={(value) => this.setState({ selectedGrade: value })}
                    style={{ width: '300px', marginBottom: '20px' }}
                    variant="filled"
                    >
                        {
                            this.state.gradesList.map((grades,index)=>{
                                return(
                                    <Select.Option
                                    key={index}
                                    value={grades.id}
                                    >
                                        {grades.grade}
                                    </Select.Option>
                                )
                            })
                        }
                    </Select>
                    <br />
                    <Select 
                    placeholder="Wybierz Ucznia"
                    value={this.state.selectedStudent}
                    onChange={(value) => this.setState({ selectedStudent: value })}
                    style={{ width: '300px', marginBottom: '20px' }}
                    variant="filled"
                    >
                        {this.state.studentsList.map((student, index) => (
                            <Select.Option
                                key={student.id} // Używamy student.id zamiast index
                                value={student.id}
                            >
                                {student.username}
                            </Select.Option>
                        ))}
                    </Select>

                    <Select
                    placeholder="Waga oceny"
                    value={this.state.selectedWeight}
                    onChange={(value) => this.setState({ selectedWeight: value })}
                    style={{ width: '300px', marginBottom: '20px' }}
                    variant="filled"
                    >
                        {
                        this.state.weightList.map((weight,index)=>{
                                return(
                                    <Select.Option
                                    key={index}
                                    value={weight.id}
                                    >
                                        {weight.grade}
                                    </Select.Option>
                                )
                            })
                        }
                    </Select>
                </Modal>
            </ConfigProvider>
        </div> 
        );
    }
}

export default AddGrade;