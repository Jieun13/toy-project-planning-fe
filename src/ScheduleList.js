import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import ScheduleService from './ScheduleService';
import 'react-calendar/dist/Calendar.css';
import './style.css';

const ScheduleList = () => {
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();

    // 일정 가져오는 함수
    const fetchSchedules = useCallback(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        ScheduleService.getSchedule(token)
            .then((response) => {
                console.log("백엔드 응답 데이터:", response.data);
                setSchedules(response.data);
            })
            .catch((error) => {
                console.error('일정 조회 오류:', error);
                alert('일정을 불러오는데 실패했습니다.');
                navigate('/login');
            });
    }, [navigate]);

    // 페이지 처음 로드 시 일정 가져오기
    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const filteredSchedules = schedules.filter(schedule => {
        const startDate = new Date(schedule.startTime);
        const endDate = new Date(schedule.endTime);
        const selected = new Date(selectedDate);

        // 시간 정보를 무시하고 날짜만 비교
        startDate.setHours(0, 0, 0, 0);  // startDate의 시간을 00:00로 설정
        endDate.setHours(23, 59, 59, 999);  // endDate의 시간을 23:59로 설정
        selected.setHours(0, 0, 0, 0);  // selectedDate의 시간을 00:00로 설정

        // 선택된 날짜가 시작일자와 종료일자 사이에 있는지 확인
        return selected >= startDate && selected <= endDate;
    });

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0); // targetDate의 시간을 00:00으로 설정

            const scheduleForDate = schedules.filter(schedule => {
                const startDate = new Date(schedule.startTime);
                const endDate = new Date(schedule.endTime);

                startDate.setHours(0, 0, 0, 0);  // startDate의 시간을 00:00로 설정
                endDate.setHours(23, 59, 59, 999);  // endDate의 시간을 23:59로 설정

                // 날짜가 범위 내에 포함되는지 체크
                return targetDate >= startDate && targetDate <= endDate;
            });

            if (scheduleForDate.length > 0) {
                return (
                    <div style={{ fontSize: '12px', color: 'blue', textAlign: 'center' }}>
                        {scheduleForDate.map((s, index) => (
                            <div key={index} style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '80px'
                            }}>
                                {s.title.length > 8 ? s.title.substring(0, 8) + '...' : s.title}
                            </div>
                        ))}
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div style={{padding: '20px'}}>

            <h1 style={{textAlign: 'center', marginBottom: '40px'}}>Schedule</h1>

            {/* 📅 달력 추가 - 요일을 한글로 표시 */}
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px', width: '100%'}}>
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                    locale="ko-KR"
                    formatShortWeekday={(locale, date) =>
                        ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
                    }
                    style={{width: '100%', maxWidth: '1000px', margin: '0 auto'}}
                />
            </div>

            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                <Link to="/schedule/new">
                    <button style={buttonStyle}>새 일정 생성</button>
                </Link>
            </div>

            <ul style={{listStyleType: 'none', paddingLeft: '0'}}>
                {filteredSchedules.length > 0 ? (
                    filteredSchedules.map((schedule) => {
                        const startDate = new Date(schedule.startTime);
                        const endDate = new Date(schedule.endTime);

                        // 날짜 포맷팅 함수
                        const formatDate = (date) => {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            return `${year}-${month}-${day} ${hours}:${minutes}`;
                        };

                        const startTimeFormatted = formatDate(startDate);
                        const endTimeFormatted = formatDate(endDate);

                        // 시작일과 종료일이 다르면 다르게 표시
                        const timeRange = startDate.toDateString() === endDate.toDateString()
                            ? `${startTimeFormatted} ~ ${endTimeFormatted}`
                            : `${startTimeFormatted} ~ ${endTimeFormatted}`;

                        return (
                            <div key={schedule.id} style={scheduleItemStyle}>
                                <li>
                                    <Link to={`/schedule/${schedule.id}`} style={linkStyle}>
                                        <strong>{schedule.title}</strong>
                                    </Link>
                                    <div className="schedule-list-time">
                                        <span style={{color: 'dimgray'}}>created_at : </span> {timeRange}<br/>
                                        <span style={{color: 'dimgray'}}>created_by : </span> {schedule.author}
                                    </div>
                                    <p className="schedule-list-description">
                                        {schedule.description.length > 50
                                            ? `${schedule.description.substring(0, 50)} ...`
                                            : schedule.description}
                                    </p>
                                </li>
                            </div>
                        );
                    })
                ) : (
                    <p>선택한 날짜에 등록된 일정이 없습니다.</p>
                )}
            </ul>
        </div>
    );
};

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: 'midnightblue',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const scheduleItemStyle = {
    fontColor: 'black',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '0.1px solid #d3d3d3',
    transition: 'transform 0.2s ease-in-out',
};

const linkStyle = {
    textDecoration: 'none',
    color: 'black',
    fontSize: '18px',
    fontWeight: 'bold',
};

export default ScheduleList;
