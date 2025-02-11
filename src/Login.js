import React from 'react';

const Login = () => {
    return (
        <div>
            <h1>로그인 페이지</h1>
            <a href="http://localhost:8080/oauth2/authorization/kakao">
                <img
                    src="/kakaoLogin.png"
                    alt="카카오 로그인"
                    style={{ width: '150px', height: 'auto' }} // 버튼 크기 조정 가능
                />
            </a>
        </div>
    );
};

export default Login;
