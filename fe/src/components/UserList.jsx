import React from 'react';
import { List } from 'antd';
import AddUser from './AddUser';

const UserList = ({users, token, refreshUsers }) => {
    return (
      <div>
          <List
            bordered
            dataSource={users}
            renderItem={(user) => (
              <List.Item key={user.id}>
                {user.username} ({user.role})
              </List.Item>
            )}
          />
          <AddUser token={token} refreshUsers={refreshUsers}/>
        </div>
    );
}

export default UserList;