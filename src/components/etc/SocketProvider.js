import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { io } from "socket.io-client";
import { enum_api_uri } from '../../config/enum';

// Socket Context 생성
const SocketContext = createContext();

// useSocket Hook
export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (socket === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return socket;
};

// Socket Provider
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const socketUrl = enum_api_uri.api_uri;
    const user = useSelector((state)=>state.user);
    const [token, setToken] = useState("");

    useEffect(()=>{
        setToken(user.tokenValue);
    },[user.tokenValue]);

    useEffect(() => {
        // 소켓 객체 생성
        if(token){
            const socketIo = io(socketUrl, {
                cors: {
                    // origin: "*",
                    origin: ['https://www.sasohan.net', 'https://sasohan.net', 'https://chat.sasohan.net'],
                },
                extraHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                reconnection: true, // 자동 재연결 활성화
                withCredentials: true,
                // transports: ['websocket']
            });
        
            setSocket(socketIo);
            
            return () => {
                // 컴포넌트 언마운트 시 소켓 연결 종료
                socketIo.disconnect();
            };
        }
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};