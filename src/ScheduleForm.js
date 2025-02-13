import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleService from './ScheduleService';
import './style.css';
import { useLocation } from 'react-router-dom';

const ScheduleForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');

    const { scheduleId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(location.state?.isEditing || false);

    const formatDateTimeForInput = (dateTimeString) => {
        if (!dateTimeString) return '';
        return dateTimeString.slice(0, 16);
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (scheduleId) {
            setIsEditing(true);
            ScheduleService.getScheduleById(scheduleId, token)
                .then((response) => {
                    const { title, description, startTime, endTime } = response.data;
                    setTitle(title);
                    setDescription(description || '');
                    setStartDateTime(formatDateTimeForInput(startTime));
                    setEndDateTime(formatDateTimeForInput(endTime));
                })
                .catch(error => {
                    console.error('일정 조회 오류:', error);
                    alert('일정을 불러오는데 실패했습니다.');
                    navigate('/schedule');
                });
        }
    }, [scheduleId, navigate]);

    const convertToUTC = (dateTime) => {
        const localDate = new Date(dateTime);
        const offset = localDate.getTimezoneOffset();
        localDate.setMinutes(localDate.getMinutes() - offset);
        return localDate.toISOString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const startDateTimeUTC = convertToUTC(startDateTime);
        const endDateTimeUTC = convertToUTC(endDateTime);

        const scheduleData = {
            title,
            description,
            startDateTime: startDateTimeUTC,
            endDateTime: endDateTimeUTC
        };

        try {
            if (isEditing) {
                await ScheduleService.updateSchedule(scheduleId, scheduleData, token);
                alert('일정이 수정되었습니다.');
            } else {
                await ScheduleService.createSchedule(scheduleData, token);
                alert('새 일정이 생성되었습니다.');
            }
            navigate('/schedule');
        } catch (error) {
            console.error('일정 저장 오류:', error);
            alert('일정을 저장하는데 실패했습니다.');
        }
    };

    return (
        <div className="form-container">
            <h2>{isEditing ? '일정 수정' : '새 일정 생성'}</h2>
            <form onSubmit={handleSubmit} className="schedule-form">
                <div className="input-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>설명</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label>시작 날짜 및 시간</label>
                    <input
                        type="datetime-local"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>끝 날짜 및 시간</label>
                    <input
                        type="datetime-local"
                        value={endDateTime}
                        onChange={(e) => setEndDateTime(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">{isEditing ? '수정' : '저장'}</button>
            </form>
        </div>
    );
};

export default ScheduleForm;
