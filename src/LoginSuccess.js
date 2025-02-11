import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("🔥 LoginSuccess 컴포넌트 실행됨"); // ✅ 실행되는지 확인

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        console.log("📌 받은 토큰:", token); // ✅ 토큰이 제대로 넘어오는지 확인

        if (token) {
            // ✅ JWT 저장
            localStorage.setItem('access_token', token);

            // ✅ URL에서 token 제거
            window.history.replaceState({}, document.title, '/loginSuccess');

            // ✅ 메인 페이지로 이동
            setTimeout(() => {
                console.log("🔄 메인 페이지로 이동 중...");
                navigate('/');
            }, 500);
        } else {
            console.log("⚠️ 토큰 없음. 홈으로 이동");
            navigate('/');
        }
    }, [navigate]);

    return <h1>로그인 중...</h1>;
};

export default LoginSuccess;
