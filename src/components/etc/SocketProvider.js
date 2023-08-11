import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from "socket.io-client";
import { enum_api_uri } from '../../config/enum';

// 소켓 연결에 필요한 변수 선언
const socketUrl = enum_api_uri.api_uri;
const token = localStorage.getItem("token");

// Socket Context 생성
const SocketContext = createContext();

// Socket Provider
export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // 소켓 객체 생성
        const socketIo = io(socketUrl, {
            cors: {
                origin: "*",
            },
            extraHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnection: true, // 자동 재연결 활성화
        });
    
        setSocket(socketIo);
    
        return () => {
            // 컴포넌트 언마운트 시 소켓 연결 종료
            socketIo.disconnect();
        };
    }, []);
    
    useEffect(() => {
        if (socket) {
            // 소켓이 연결되어 있지 않으면 연결 시도
            if (!socket.connected) {
                socket.connect();
            }
        }
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

// useSocket Hook
export function useSocket() {
    const socket = useContext(SocketContext);
    if (socket === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return socket;
}