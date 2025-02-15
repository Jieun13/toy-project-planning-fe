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
    },

    inviteUser : (scheduleId, requestData, token) => {
        return axios.post(`${API_URL}/${scheduleId}/invitations`,
            requestData, {
            headers: { Authorization: `Bearer ${token}` }
            });
    },

    getInvitationList : (token) => {
        return axios.get(`${API_URL}/invitations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    getInvitations : (scheduleId, token) => {
        return axios.get(`${API_URL}/${scheduleId}/invitations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    cancelInvitation : (invitationId, token) => {
        return axios.delete(`${API_URL}/invitations/${invitationId}`, {
            headers: { Authorization: `Bearer ${token}` }
            }
        );
    },

    acceptInvitation: (invitationId, accept, token) => {
        return axios.patch(
            `${API_URL}/invitations/${invitationId}`,
            null,  // PATCH 요청에 본문이 필요 없으므로 `null`을 전달
            {
                headers: { Authorization: `Bearer ${token}` },  // 🔹 Authorization 헤더 추가
                params: { accept } // 초대 응답(true: 수락, false: 거절)
            }
        );
    }
};

export default ScheduleService;
