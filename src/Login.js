import React from 'react';

const Login = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>로그인</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <a href="http://localhost:8080/oauth2/authorization/kakao">
                    <img
                        src="/kakaoLogin.png"
                        alt="카카오 로그인"
                        style={{ width: '150px', height: 'auto' }}
                    />
                </a>
                <a href="http://localhost:8080/oauth2/authorization/google">
                    <img
                        src="/googleLogin.png"
                        alt="구글 로그인"
                        style={{ width: '150px', height: 'auto' }}
                    />
                </a>
            </div>
        </div>
    );
};

export default Login;
