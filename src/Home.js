import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate('/login'); // 🔹 로그인 안 했으면 로그인 페이지로 이동
            return;
        }

        // 🔹 토큰을 포함하여 서버에 유저 정보 요청
        axios.get('http://localhost:8080/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setUser(response.data))
            .catch(error => {
                console.error('인증 오류:', error);
                localStorage.removeItem('access_token'); // 🔹 잘못된 토큰이면 삭제
                navigate('/login');
            });

    }, [navigate]);

    return (
        <div>
            <h1>Home</h1>
            {user ? (
                <div>
                    <h2>안녕하세요, {user.username}님!</h2>
                    <h4>가입된 이메일 : {user.email}</h4>

                    {/* 🔹 일정 보기 버튼 추가 */}
                    <button onClick={() => navigate('/schedules')}>
                        일정 보기
                    </button>

                    <button onClick={() => {
                        localStorage.removeItem('access_token'); // 로그아웃 처리
                        navigate('/login');
                    }}>
                        로그아웃
                    </button>
                </div>
            ) : (
                <p>로딩 중...</p>
            )}
        </div>
    );
};

export default Home;
