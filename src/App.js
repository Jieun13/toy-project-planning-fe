import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSuccess from './LoginSuccess';
import Home from './Home';
import Login from './Login';
import ScheduleList from './ScheduleList';  // 일정 목록 컴포넌트 추가
import ScheduleForm from './ScheduleForm';
import ScheduleDetail from "./ScheduleDetail";  // 일정 생성 및 수정 폼 컴포넌트 추가
import Chat from "./Chat"
import InviteList from "./InviteList";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/loginSuccess" element={<LoginSuccess/>}/> {/* ✅ 추가 */}

                {/* 일정 관련 페이지 추가 */}
                <Route path="/schedule" element={<ScheduleList/>}/> {/* 일정 목록 페이지 */}
                <Route path="/schedule/new" element={<ScheduleForm/>}/> {/* 새 일정 생성 폼 */}
                <Route path="/schedule/edit/:scheduleId" element={<ScheduleForm/>}/> {/* 일정 수정 폼 */}
                <Route path="/schedule/:scheduleId" element={<ScheduleDetail/>}/>
                <Route path="/chat" element={<Chat/>}/>

                <Route path="/invitations" element={<InviteList/>}/>

            </Routes>
        </Router>
    );
}

export default App;
