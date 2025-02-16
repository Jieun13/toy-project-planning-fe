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
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div className="container" style={{
            width: '80%',
            display: 'flex',
            marginTop: '30px',
            marginBottom: '30px',
            justifyContent: 'center',  // 수평 중앙 정렬
            alignItems: 'center',      // 수직 중앙 정렬
            flexDirection: 'column',   // 세로로 정렬하려면 추가
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 경계 그림자 적용
            borderRadius: '8px', // 경계 모서리 둥글게
            padding: '50px 20px', // 내부 여백
            border: '0.1px solid #d3d3d3'
        }}>
            <h1>Home</h1>
            {user ? (
                <div>
                    <img src={"./img.png"} alt="profileIcon" className="profile-icon"/>
                    <h2>안녕하세요, {user.username}님!</h2>
                    <h4>가입된 이메일 : {user.email}</h4>

                    <button onClick={() => navigate('/schedule')}>
                        일정 보기
                    </button>

                    <button
                        onClick={() => {
                            navigate('/invitations');
                        }}
                    >초대 신청 목록
                    </button>
                </div>
            ) : (
                <p>로딩 중...</p>
            )}
        </div>
        </div>
    );
};

export default Home;
