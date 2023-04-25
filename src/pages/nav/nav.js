import './nav.scss';
import React from 'react';
import { ProfileOutlined, AreaChartOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

import { useNavigate } from 'react-router-dom';

const navItems = [
  {
    key: '/',
    icon: <AreaChartOutlined />,
    label: '概览'
  },
  {
    key: '/problemManage',
    icon: <ProfileOutlined />,
    label: '习题管理',
    children: [
      {
        key: '/problemManage/category',
        label: '分类管理'
      },
      {
        key: '/problemManage/topic',
        label: '题目管理'
      }
    ]
  },
  {
    key: '/resource',
    icon: <ProfileOutlined />,
    label: '资源管理',
    children: [
      {
        key: '/resource/file',
        label: '文件资源'
      }
    ]
  }
];

const Nav = (props) => {
  const { collapsed } = props;

  const navigate = useNavigate();
  const onSelect = (e) => {
    navigate(e.key);
  };

  return (
    <div className="nav-block" style={{ width: collapsed ? 'auto' : 256 }}>
      <div className="nav-header">admin</div>
      <Menu
        className="nav-menu"
        defaultSelectedKeys={[1]}
        defaultOpenKeys={[1]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={navItems}
        onSelect={(e) => onSelect(e)}
      />
    </div>
  );
};

export default Nav;
