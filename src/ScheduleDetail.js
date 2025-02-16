import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleService from './ScheduleService';
import InviteUser from './component/InviteUser'; // 초대 컴포넌트 추가
import './style.css';

const ScheduleDetail = () => {
    const { scheduleId } = useParams();
    const [schedule, setSchedule] = useState(null);
    const [invitees, setInvitees] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [authEmail, setAuthEmail] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        // 현재 로그인한 사용자 이메일 가져오기
        ScheduleService.getCurrentUser(token)
            .then((response) => setAuthEmail(response.data))
            .catch(() => alert('사용자 정보를 불러올 수 없습니다.'));

        // 일정 조회
        ScheduleService.getScheduleById(scheduleId, token)
            .then((response) => setSchedule(response.data))
            .catch(() => {
                alert('일정을 불러오는데 실패했습니다.');
                navigate('/schedule');
            });

        // 초대된 사용자 목록 조회
        ScheduleService.getInvitations(scheduleId, token)
            .then((response) => setInvitees(response.data))
            .catch(() => alert('초대된 사용자 목록을 불러오는 데 실패했습니다.'));
    }, [scheduleId, navigate]);

    const handleUpdate = () => navigate(`/schedule/edit/${scheduleId}`, { state: { isEditing: true } });

    const handleDelete = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        try {
            await ScheduleService.deleteSchedule(scheduleId, token);
            alert('일정이 삭제되었습니다.');
            navigate('/schedule');
        } catch {
            alert('일정을 삭제하는데 실패했습니다.');
        }
    };

    const handleCancelInvite = async (invitationId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        try {
            await ScheduleService.cancelInvitation(invitationId, token);
            setInvitees(invitees.filter((invitee) => invitee.id !== invitationId));
            alert('초대가 취소되었습니다.');
        } catch {
            alert('초대 취소에 실패했습니다.');
        }
    };

    const translateStatus = (status) => {
        switch (status) {
            case 'PENDING': return '대기';
            case 'ACCEPTED': return '수락';
            case 'DECLINED': return '거절';
            default: return '알 수 없음';
        }
    };

    if (!schedule) return <p>일정을 불러오는 중...</p>;

    return (
        <div className="schedule-detail-container">
            <h2 className="schedule-title">{schedule.title}</h2>

            <p className="schedule-time">
                🕒 {new Date(schedule.startTime).toLocaleString()} ~ {new Date(schedule.endTime).toLocaleString()}
            </p>
            <p className="schedule-author">✍ 작성자: {schedule.author}</p>

            <div className="description-container">
                <p className="schedule-description">{schedule.description}</p>
            </div>

            {/* 일정 수정/삭제 버튼 (작성자만 가능) */}
            {authEmail === schedule.author && (
                <div className="button-group">
                    <button onClick={handleUpdate} className="update-btn">일정 수정</button>
                    <button onClick={handleDelete} className="delete-btn">일정 삭제</button>
                </div>
            )}

            <div>
                {/* 일정 작성자일 경우에만 초대 UI 표시 */}
                {authEmail === schedule.author && (
                    <>
                        <InviteUser scheduleId={scheduleId}/>
                        <button onClick={() => setShowTable(!showTable)} className="btn-toggle">
                            {showTable ? '목록 숨기기' : '초대된 사용자 목록 보기'}
                        </button>
                    </>
                )}
            </div>

            {/* 초대된 사용자 목록 */}
            {showTable && (
                <div>
                    <h3>초대된 사용자 목록</h3>
                    {invitees.length === 0 ? (
                        <p>초대된 사용자가 없습니다.</p>
                    ) : (
                        <table className="invitees-table">
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>이메일</th>
                                <th>권한</th>
                                <th>상태</th>
                                <th>작업</th>
                            </tr>
                            </thead>
                            <tbody>
                            {invitees.map((invitee, index) => (
                                <tr key={invitee.id}>
                                    <td>{index + 1}</td>
                                    <td>{invitee.email}</td>
                                    <td>{invitee.role}</td>
                                    <td className={getStatusColor(invitee.status)}>
                                        {translateStatus(invitee.status)}
                                    </td>
                                    <td>
                                        {(invitee.status === 'PENDING' || invitee.status === 'ACCEPTED') && (
                                            <button
                                                onClick={() => handleCancelInvite(invitee.id)}
                                                className="invitee-action-btn"
                                            >
                                                {invitee.status === 'PENDING' ? '취소' : '삭제'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

// 상태별 색상 설정 함수
const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING': return 'text-yellow-500';
        case 'ACCEPTED': return 'text-green-500';
        case 'DECLINED': return 'text-red-500';
        default: return 'text-gray-500';
    }
};

export default ScheduleDetail;
