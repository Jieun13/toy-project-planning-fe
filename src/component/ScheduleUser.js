import React, { useEffect, useState } from "react";
import { getInvitations, getParticipants, cancelInvitation, removeParticipant } from "../api/scheduleApi";

const ScheduleList = ({ scheduleId }) => {
    const [invitees, setInvitees] = useState([]);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        fetchData();
    }, [scheduleId]);

    const fetchData = async () => {
        const invites = await getInvitations(scheduleId);
        const users = await getParticipants(scheduleId);
        setInvitees(invites);
        setParticipants(users);
    };

    const handleCancelInvite = async (invitationId) => {
        await cancelInvitation(scheduleId, invitationId);
        fetchData();
    };

    const handleRemoveParticipant = async (userId) => {
        await removeParticipant(scheduleId, userId);
        fetchData();
    };

    return (
        <div>
            <h2>초대된 사용자 목록</h2>
            <ul>
                {invitees.map((invitee) => (
                    <li key={invitee.id}>
                        {invitee.email}
                        <button onClick={() => handleCancelInvite(invitee.id)}>초대 취소</button>
                    </li>
                ))}
            </ul>

            <h2>참여 중인 사용자 목록</h2>
            <ul>
                {participants.map((participant) => (
                    <li key={participant.id}>
                        {participant.email}
                        <button onClick={() => handleRemoveParticipant(participant.id)}>강제 퇴출</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScheduleList;
