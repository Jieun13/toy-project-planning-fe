import React, { useState } from 'react';
import ScheduleService from '../ScheduleService';  // ScheduleService에서 초대 관련 API 호출

const InviteUser = ({ scheduleId }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInvite = async () => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!email) {
            alert('초대할 이메일을 입력해주세요.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await ScheduleService.inviteUser(scheduleId, { email }, token);
            setMessage('초대가 성공적으로 발송되었습니다.');
            setEmail('');
        } catch (error) {
            console.error('초대 실패:', error);
            setMessage('초대 발송에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="invite-user-container">
            <h3>사용자 초대</h3>
            <input
                type="email"
                placeholder="초대할 사용자 이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="invite-email-input"
            />
            <button onClick={handleInvite} className="invite-btn" disabled={loading}>
                {loading ? '초대 중...' : '초대 보내기'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default InviteUser;
