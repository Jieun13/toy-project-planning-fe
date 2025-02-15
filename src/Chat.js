import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);
    const [message, setMessage] = useState("");
    const [connected, setConnected] = useState(false); // 연결 상태 추적

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: "ws://localhost:8080/ws",  // WebSocket 서버 URL
            onConnect: () => {
                console.log("Connected");
                setConnected(true);
                stompClient.subscribe("/topic/messages", (msg) => {
                    setMessages((prev) => [...prev, JSON.parse(msg.body)]);
                });
            },
            onStompError: (frame) => {
                console.error(frame);
                setConnected(false);
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
            setConnected(false); // 컴포넌트가 unmount 될 때 연결 상태 초기화
        };
    }, []);

    const sendMessage = () => {
        if (client && connected && message.trim() !== "") {
            client.publish({
                destination: "/app/send",
                body: JSON.stringify({ sender: "User", content: message, type: "CHAT" }),
            });
            setMessage("");
        } else {
            console.warn("메시지를 보낼 수 없습니다: 연결되지 않았거나 빈 메시지입니다.");
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {messages.map((msg, idx) => (
                    <p key={idx}>
                        <strong>{msg.sender}: </strong> {msg.content}
                    </p>
                ))}
            </div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage} disabled={!connected}>Send</button> {/* 연결되지 않으면 버튼 비활성화 */}
        </div>
    );
};

export default Chat;
