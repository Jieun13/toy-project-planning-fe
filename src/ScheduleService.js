import axios from 'axios';

const API_URL = 'http://localhost:8080/api/schedule';

const ScheduleService = {

    getSchedule: (token, startDate, endDate) => {
        return axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
            params: { startDate, endDate } // 🔹 필터링 파라미터 전달
        });
    },

    getScheduleById: (scheduleId, token) => {
        return axios.get(`${API_URL}/${scheduleId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    createSchedule: (scheduleData, token) => {
        return axios.post(API_URL, scheduleData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    updateSchedule: (scheduleId, scheduleData, token) => {
        return axios.put(`${API_URL}/${scheduleId}`, scheduleData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    deleteSchedule: (scheduleId, token) => {
        return axios.delete(`${API_URL}/${scheduleId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default ScheduleService;
