import React from 'react';
import { List, Table } from 'antd';
import AddUser from './AddUser';
import styles from './UserList.module.css';

const UserList = ({users, token, refreshUsers }) => {
  const columns = [
    {
      title: 'Nazwa użytkownika',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Rola',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Przedmiot 1',
      dataIndex: 'assigned_subject1',
      key: 'assigned_subject1',
    },
    {
      title: 'Przedmiot 2',
      dataIndex: 'assigned_subject2',
      key: 'assigned_subject2',
    }
  ] 

    return (
      <div>
          {/* <List
            bordered
            dataSource={users}
            renderItem={(user) => (
              <List.Item key={user.id}>
                {user.username} ({user.role})
              </List.Item>
            )}
          /> */}
          
          <Table
          dataSource={users}
          columns={columns}
          pagination={false} 
          rowHoverable={false}
          sticky={true}
          className={styles.UserListTable}
          >
          </Table>

          <div style={{
            // margin:50,
            height:100,
            position:"relative"
          }}>
            <AddUser token={token} refreshUsers={refreshUsers}/>
          </div>
        </div>
    );
}

export default UserList;