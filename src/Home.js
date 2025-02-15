import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css'; // 스타일 파일 import

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate('/login');
            return;
        }

        axios.get('http://localhost:8080/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setUser(response.data))
            .catch(error => {
                console.error('인증 오류:', error);
                localStorage.removeItem('access_token');
                navigate('/login');
            });

    }, [navigate]);

    return (
        <div className="container">
            <h1>Home</h1>
            {user ? (
                <div>
                    <h2>안녕하세요, {user.username}님!</h2>
                    <h4>가입된 이메일 : {user.email}</h4>

                    <button onClick={() => navigate('/schedule')}>
                        일정 보기
                    </button>

                    <button
                        className="logout"
                        onClick={() => {
                            localStorage.removeItem('access_token');
                            navigate('/login');
                        }}
                    >로그아웃
                    </button>

                    <button
                        onClick={()=>{
                            navigate('/invitations');
                        }}
                    >초대 신청 목록</button>
                </div>
            ) : (
                <p>로딩 중...</p>
            )}
        </div>
    );
};

export default Home;
