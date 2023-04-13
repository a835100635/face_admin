import './header.scss'
import { Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
function FeHeader(props) {
  const { collapsed, onClick } = props;

  return (
    <header className="fe-header">
      <Button type="primary" onClick={ onClick }>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <h1>Frontend Masters Intro to React</h1>
    </header>
  )
}

export default FeHeader;