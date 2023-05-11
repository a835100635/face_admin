import './App.scss';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './pages/nav/nav';
import FeHeader from './components/header/header';
import Home from './pages/home/home';
import Category from './pages/problemManage/categoryManage/category';
import Topic from './pages/problemManage/topicManage/topic';
import FileResource from './pages/resourceManage/fileResource/fileResource';
import IntegralTypes from './pages/integralManage/types/types';

function App() {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className="App">
      <Nav collapsed={collapsed} />
      <main className="app-main">
        <FeHeader collapsed={collapsed} onClick={() => toggleCollapsed()} />
        <div className="app-main-wrap">
          <Routes>
            {/* 首页 */}
            <Route path="/" element={<Home />} />
            {/* 分类 */}
            <Route path="/problemManage/category" element={<Category />} />
            {/* 题目 */}
            <Route path="/problemManage/topic" element={<Topic />} />
            {/* 文件资源 */}
            <Route path="/resource/file" element={<FileResource />} />
            {/* 积分类型 */}
            <Route path="/integral/type" element={<IntegralTypes />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
