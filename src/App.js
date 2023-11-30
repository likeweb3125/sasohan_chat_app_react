import { Routes, Route, Outlet } from 'react-router-dom';
import Popup from './components/popup/Popup';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Main from './pages/Main';
import Message from './pages/Message';
import Chat from './pages/Chat';
import Setting from './pages/Setting';
import './css/reset.css';
import './css/common.css';
import './css/main.css';
import './css/content.css';


function App() {

    return(
        <div id="wrap" className="flex">
            <Routes>
                {/* 매니저로그인 */}
                <Route path="/login/:m_id" element={<Login />} />

                {/* 메인 - 회원검색 */}
                <Route path="/" element={<Layout><Outlet/></Layout>}>
                    <Route path="" element={<Main />}/>
                    <Route path=":gender_num" element={<Main />}/>
                </Route>

                {/* 메시지 */}
                <Route path="/message" element={<Layout><Message /></Layout>} />

                {/* 연결한 대화방 */}
                <Route path="/chat" element={<Layout><Chat /></Layout>} />

                {/* 설정 */}
                <Route path="/setting" element={<Layout><Setting /></Layout>} />

            </Routes>

            {/* 팝업 */}
            <Popup />
        </div>
    );
}

export default App;
