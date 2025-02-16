import React, { useEffect, useState } from 'react';
import ScheduleService from './ScheduleService';
import './InviteList.css';

const InviteResponse = ({ scheduleId }) => {
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);

    // 초대 목록 가져오기
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("토큰이 없습니다.");
            return;
        }

        ScheduleService.getInvitationList(token)  // 🔹 토큰 전달 추가
            .then((response) => {
                console.log("초대 목록:", response.data);  // 🔹 로그 추가
                setInvites(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("초대 목록 불러오기 실패:", error);
                setLoading(false);
            });
    }, []);


    const handleResponse = async (invitationId, accept) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            await ScheduleService.acceptInvitation(invitationId, accept, token);
            setInvites(invites.map(invite =>
                invite.id === invitationId ? { ...invite, status: accept ? 'ACCEPTED' : 'DECLINED' } : invite
            ));
        } catch (error) {
            console.error('응답 처리 실패:', error);
            alert('응답 처리에 실패했습니다.');
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

    if (loading) return <p>초대 목록을 불러오는 중...</p>;

    return (
        <div style={{padding: '20px'}}>
            <h2 style={{textAlign: 'center', margin: '30px 30px'}}>초대 목록</h2>
            <div>
                <div className="invite-response-container">
                    {invites.length === 0 ? (
                        <p>초대가 없습니다.</p>
                    ) : (
                        <table className="invitees-table">
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>일정</th>
                                <th>초대한 사람</th>
                                <th>상태</th>
                                <th>응답</th>
                            </tr>
                            </thead>
                            <tbody>
                            {invites.map((invite, index) => (
                                <tr key={invite.id}>
                                    <td>{index + 1}</td>
                                    <td>{invite.scheduleName}</td>
                                    <td>{invite.email}</td>
                                    <td>{translateStatus(invite.status)}</td>
                                    <td>
                                        {invite.status === 'PENDING' ? (
                                            <>
                                                <button onClick={() => handleResponse(invite.id, true)}
                                                        className="accept-btn">수락
                                                </button>
                                                <button onClick={() => handleResponse(invite.id, false)}
                                                        className="decline-btn">거절
                                                </button>
                                            </>
                                        ) : (
                                            <span>{invite.status === 'ACCEPTED' ? '수락됨' : '거절됨'}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InviteResponse;
