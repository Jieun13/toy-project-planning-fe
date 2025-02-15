import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleService from './ScheduleService';
import InviteUser from './component/InviteUser';  // 초대 컴포넌트 추가
import './style.css';

const ScheduleDetail = () => {
    const { scheduleId } = useParams();  // URL에서 id 파라미터를 가져옴
    const [schedule, setSchedule] = useState(null);
    const [invitees, setInvitees] = useState([]);  // 초대된 사용자 목록 상태 추가
    const [showTable, setShowTable] = useState(false);  // 테이블 표시 여부
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        // 일정 조회
        ScheduleService.getScheduleById(scheduleId, token)
            .then((response) => {
                setSchedule(response.data);
            })
            .catch((error) => {
                console.error('일정 조회 오류:', error);
                alert('일정을 불러오는데 실패했습니다.');
                navigate('/schedule');
            });

        // 초대된 사용자 목록 조회
        ScheduleService.getInvitations(scheduleId, token)
            .then((response) => {
                setInvitees(response.data);  // 초대된 사용자 목록을 상태에 저장
            })
            .catch((error) => {
                console.error('초대된 사용자 조회 오류:', error);
                alert('초대된 사용자 목록을 불러오는 데 실패했습니다.');
            });
    }, [scheduleId, navigate]);

    const handleUpdate = () => {
        navigate(`/schedule/edit/${scheduleId}`, { state: { isEditing: true } });
    };

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
            navigate('/schedule');  // 삭제 후 일정 목록 페이지로 이동
        } catch (error) {
            console.error('일정 삭제 오류:', error);
            alert('일정을 삭제하는데 실패했습니다.');
        }
    };

    const homeButton = () => {
        navigate('/schedule');
    };

    const toggleTable = () => {
        setShowTable(!showTable);  // 테이블 표시 여부 토글
    };

    // 초대 취소 처리 함수
    const handleCancelInvite = async (invitationId) => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        try {
            await ScheduleService.cancelInvitation(invitationId, token);  // 초대 취소 요청
            setInvitees(invitees.filter(invitee => invitee.id !== invitationId));  // 초대 목록에서 해당 초대 삭제
            alert('초대가 취소되었습니다.');
        } catch (error) {
            console.error('초대 취소 실패:', error);
            alert('초대 취소에 실패했습니다.');
        }
    };

    // 상태를 한글로 변환하는 함수
    const translateStatus = (status) => {
        switch (status) {
            case 'PENDING':
                return '대기';
            case 'ACCEPTED':
                return '수락';
            case 'DECLINED':
                return '거절';
            default:
                return '알 수 없음';
        }
    };

    if (!schedule) return <p>일정을 불러오는 중...</p>;

    return (
        <div className="schedule-detail-container">
            <button onClick={homeButton} className='btn'>홈으로</button>
            <h2 className="schedule-title">{schedule.title}</h2>
            <p className="schedule-description">{schedule.description}</p>
            <p className="schedule-time">🕒 {new Date(schedule.startTime).toLocaleString()} ~ {new Date(schedule.endTime).toLocaleString()}</p>
            <p className="schedule-author">✍ 작성자: {schedule.author}</p>

            {/* 초대 기능 추가 */}
            <InviteUser scheduleId={scheduleId} />

            {/* 초대된 사용자 목록 표시 버튼 */}
            <button onClick={toggleTable} className="btn-toggle">
                {showTable ? '목록 숨기기' : '초대된 사용자 목록 보기'}
            </button>

            {/* 초대된 사용자 목록 테이블 */}
            {showTable && (
                <div>
                    <h3>초대된 사용자 목록</h3>
                    {invitees.length === 0 ? (
                        <p>초대된 사용자가 없습니다.</p>
                    ) : (
                        <table className="invitees-table">
                            <thead>
                            <tr>
                                <th>invitationId</th>
                                <th>scheduleId</th>
                                <th>번호</th>
                                <th>이름</th>
                                <th>이메일</th>
                                <th>권한</th>
                                <th>상태</th>
                                <th>작업</th>  {/* 작업 칼럼 추가 */}
                            </tr>
                            </thead>
                            <tbody>
                            {invitees.map((invitee, index) => (
                                <tr key={invitee.id}>
                                    <td>{invitee.id}</td>
                                    <td>{invitee.scheduleId}</td>
                                    <td>{index + 1}</td>
                                    {/* 번호는 1부터 시작 */}
                                    <td>{invitee.scheduleName}</td>
                                    {/* 일정 */}
                                    <td>{invitee.email}</td>
                                    {/* 이메일 */}
                                    <td>{invitee.role}</td>
                                    {/* 역할 */}
                                    <td>{translateStatus(invitee.status)}</td>
                                    {/* 상태 한글로 표시 */}
                                    <td>
                                        {invitee.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleCancelInvite(invitee.id)}
                                                className="invitee-cancel-btn"
                                            >
                                                취소
                                            </button>
                                        )}

                                        {invitee.status === 'ACCEPTED' && (
                                            <button
                                                onClick={() => handleCancelInvite(invitee.id)}
                                                className="invitee-delete-btn"
                                            >
                                                삭제
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

            <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center'}}>
                <button onClick={handleUpdate} className="update-btn">일정 수정</button>
                <button onClick={handleDelete} className="delete-btn">일정 삭제</button>
            </div>
        </div>
    );
};

export default ScheduleDetail;
