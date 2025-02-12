import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleService from './ScheduleService';
import './style.css';

const ScheduleDetail = () => {
    const { scheduleId } = useParams();  // URL에서 id 파라미터를 가져옴
    const [schedule, setSchedule] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        ScheduleService.getScheduleById(scheduleId, token)
            .then((response) => {
                setSchedule(response.data);
            })
            .catch((error) => {
                console.error('일정 조회 오류:', error);
                alert('일정을 불러오는데 실패했습니다.');
                navigate('/schedule');
            });
    }, [scheduleId, navigate]);

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

    if (!schedule) return <p>일정을 불러오는 중...</p>;

    return (
        <div className="schedule-detail-container">
            <h2 className="schedule-title">{schedule.title}</h2>
            <p className="schedule-description">{schedule.description}</p>
            <p className="schedule-time">🕒 {new Date(schedule.startTime).toLocaleString()} ~ {new Date(schedule.endTime).toLocaleString()}</p>
            <p className="schedule-author">✍ 작성자: {schedule.author}</p>
            <button onClick={handleDelete} className="delete-btn">일정 삭제</button>
        </div>
    );
};

export default ScheduleDetail;
