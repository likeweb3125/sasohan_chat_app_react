import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useSocket } from "../etc/SocketProvider";
import Header from "./Header";


const Layout = (props) => {
    const location = useLocation();
    const socket = useSocket();
    const common = useSelector((state)=>state.common);


    //페이지 변경시
    useEffect(()=>{
        //전에 입장한 채팅방이있으면 그 채팅방은 나감
        if(common.activeRoom !== null){
            let data = {
                room_id: common.activeRoom
            }
            socket.emit("leave room", data);
        }

    },[location]);


    return(
        <>
            <Header />
            <div className="content_wrap">
                {props.children}
            </div>
        </>
    );
};

export default Layout;