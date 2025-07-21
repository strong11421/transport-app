import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Typography } from 'antd';
import {
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-[#001529] w-full shadow-md z-10" style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
      <Title level={3} style={{ color: 'white', margin: '0 24px 0 0', lineHeight: '64px' }}>
        Kings Transport
      </Title>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{
          backgroundColor: 'transparent',
          lineHeight: '64px',
          flex: 1,
        }}
      >
        <Menu.Item key="/add" icon={<PlusOutlined />}>
          <Link to="/add">Add</Link>
        </Menu.Item>
        <Menu.Item key="/view" icon={<UnorderedListOutlined />}>
          <Link to="/view">View</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Navbar;
