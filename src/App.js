import './App.scss';
import { useState } from 'react';
import { Routes, Route } from "react-router-dom"
import Nav from './pages/nav/nav';
import FeHeader from './components/header/header';
import Home from './pages/home/home';
import Category from './pages/problemManage/categoryManage/category';
import Topic from './pages/problemManage/topicManage/topic';

function App() {

  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }

  return (
    <div className="App">
      <Nav collapsed={collapsed} />
      <main className='app-main'>
        <FeHeader collapsed={collapsed} onClick={ e => toggleCollapsed() }/>
        <div className='app-main-wrap'>
          <Routes>
            {/* 首页 */}
            <Route path="/" element={<Home />} />
            {/* 分类 */}
            <Route path="/category" element={<Category />} />
            {/* 题目 */}
            <Route path="/topic" element={<Topic />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
