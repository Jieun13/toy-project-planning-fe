import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/schedule"; // 백엔드 서버 주소

export const inviteUser = async (scheduleId, email) => {
    return axios.post(`${API_BASE_URL}/${scheduleId}/invitations`, { email });
};

export const respondToInvite = async (scheduleId, scheduleUserId, accept) => {
    return axios.patch(`${API_BASE_URL}/${scheduleId}/invitations/${scheduleUserId}`, null, {
        params: { accept },
    });
};

export const getInvitations = async (scheduleId) => {
    const response = await axios.get(`${API_BASE_URL}/${scheduleId}/invitations`);
    return response.data;
};

export const getParticipants = async (scheduleId) => {
    const response = await axios.get(`${API_BASE_URL}/${scheduleId}/users`);
    return response.data;
};

export const cancelInvitation = async (scheduleId, invitationId) => {
    return axios.delete(`${API_BASE_URL}/${scheduleId}/invitations/${invitationId}`);
};

export const removeParticipant = async (scheduleId, userId) => {
    return axios.delete(`${API_BASE_URL}/${scheduleId}/participants/${userId}`);
};
