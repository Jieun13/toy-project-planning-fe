import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSuccess from './LoginSuccess';
import Home from './Home';
import Login from './Login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/loginSuccess" element={<LoginSuccess />} /> {/* ✅ 추가 */}
            </Routes>
        </Router>
    );
}

export default App;
