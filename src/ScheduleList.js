import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ScheduleService from './ScheduleService';
import './style.css';

const ScheduleList = () => {
    const [schedules, setSchedules] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    const fetchSchedules = useCallback(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        ScheduleService.getSchedule(token, startDate, endDate)
            .then((response) => {
                console.log("백엔드 응답 데이터:", response.data); // 👀 응답 확인

                const formattedSchedules = response.data.map(schedule => ({
                    ...schedule,
                    startDate: formatDateTimeForInput(schedule.startDate),
                    endDate: formatDateTimeForInput(schedule.endDate),
                }));
                setSchedules(formattedSchedules);
            })
            .catch((error) => {
                console.error('일정 조회 오류:', error);
                alert('일정을 불러오는데 실패했습니다.');
                navigate('/login');
            });
    }, [startDate, endDate, navigate]);


    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    // 날짜 변환 함수 추가
    const formatDateTimeForInput = (dateTimeString) => {
        if (!dateTimeString) return ''; // null 체크
        const date = new Date(dateTimeString);
        const year = String(date.getFullYear()).slice(2); // 마지막 두 자리를 가져옴
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };


    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>일정 목록</h2>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <button onClick={fetchSchedules} style={buttonStyle}>필터</button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Link to="/schedule/new">
                    <button style={buttonStyle}>새 일정 생성</button>
                </Link>
            </div>
            <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <div key={schedule.id} style={scheduleItemStyle}>
                            <li>
                                <Link to={`/schedule/${schedule.id}`} style={linkStyle}>
                                    <strong>{schedule.title}</strong>
                                </Link>
                                <br />
                                {schedule.description && <p>{schedule.description}</p>}
                                🕒 {new Date(schedule.startTime).toLocaleString()} ~ {new Date(schedule.endTime).toLocaleString()}
                                <br />
                                ✍ 작성자: {schedule.author}
                            </li>
                        </div>
                    ))
                ) : (
                    <p>등록된 일정이 없습니다.</p>
                )}
            </ul>
        </div>
    );
};

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const scheduleItemStyle = {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out',
};

const linkStyle = {
    textDecoration: 'none',
    color: 'black',
    fontSize: '18px',
    fontWeight: 'bold',
};

export default ScheduleList;
