import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../etc/SocketProvider';
import * as CF from "../../config/function";
import { enum_api_uri } from '../../config/enum';
import { managerProfilePop, managerProfilePopPosition, confirmPop } from '../../store/popupSlice';
import { selectUser, newMsgData } from '../../store/commonSlice';
import ConfirmPop from '../popup/ConfirmPop';
import logo from "../../images/logo.svg";
import none_profile from "../../images/img_profile.jpg";


const Header = () => {
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const common = useSelector((state)=>state.common);
    const dispatch = useDispatch();
    const location = useLocation();
    const [confirm, setConfirm] = useState(false);
    const [menuOn, setMenuOn] = useState(1);
    const [pageMove, setPageMove] = useState(null);
    const socket = useSocket();
    const chat_count = enum_api_uri.chat_count;
    const [chatCount, setChatCount] = useState(0);
    const [newChat, setNewChat] = useState(0);
    
    

    // 소켓 채팅방 연결
    const socketInit = () => {
        const data = { room_id: user.managerInfo.m_id};
        socket.emit("join room", data);
    };


    useEffect(()=>{
        if(socket){
            socketInit();

            //매니저 메시지알림 받기
            socket.on("admin msg", (result) => {
                console.log(JSON.stringify(result, null, 2));
                dispatch(newMsgData(result));

                const selectUser = JSON.parse(sessionStorage.getItem("selectUser"));
                //회원이 매니저에게 채팅했을때 && 현재들어가있는 채팅방 제외 다른채팅방 메시지들만 안읽은메시지알림 추가
                if(result.from_id !== user.managerInfo.m_id && result.m_id !== selectUser.m_id){
                    setNewChat(newChat+1);
                }
            })
        }
    },[socket]);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);

    //페이지바뀔때마다 menu on 값 변경
    useEffect(()=>{
        const path = location.pathname;
        if(path == "/"){
            setMenuOn(1);
        }
        if(path == "/message"){
            setMenuOn(2);
        }if(path == "/chat"){
            setMenuOn(3);
        }
        if(path == "/setting"){
            setMenuOn(4);
        }
    },[location.pathname]);

    //매니저프로필 클릭시
    const profileClickHandler = (e) => {
        const element = e.currentTarget;
        let left = element.getBoundingClientRect().left;
        dispatch(managerProfilePopPosition(left + 260));
        dispatch(managerProfilePop(true));
    };

    //매니저 단체메시지설정 안되어있을때
    useEffect(()=>{
        if(user.managerSetting.set_num == 0 || user.managerSetting.set_range.length == 0){
            setPageMove(false);
        }else{
            setPageMove(true);
        }
    },[user.managerSetting]);

    //헤더메뉴 클릭시
    const navClickHandler = (e) => {
        let id = e.currentTarget.dataset.id;
        if(!pageMove){
            e.preventDefault();
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: '설정을 완료해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
        // 다른페이지로 이동시 store에 selectUser 값 지우기
        if(id != menuOn){
            dispatch(selectUser({}));
        }
    };

    //안읽은 채팅메시지 가져오기
    const getChatCount = () => {
        axios.get(`${chat_count}`,
            {headers:{Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data.unread_count;
                setChatCount(data);
            }
        })
        .catch((error) => {
            const err_msg = CF.errorMsgHandler(error);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        });
    };

    //안읽은메시지알림 추가
    useEffect(()=>{
        if(newChat > 0){
            setChatCount(chatCount + newChat);
            setNewChat(0);
        }
    },[newChat]);

    //선택한회원 변경시 안읽은 채팅메시지 가져오기
    useEffect(()=>{
        getChatCount();
    },[common.selectUser]);


    return(<>
        <header id="header">
            <div className='top_box'>
                <a href="/" className='logo' data-id={1} onClick={navClickHandler}>
                    <img src={logo} alt="로고" />
                    <span>채팅 관리자 페이지</span>
                </a>
            </div>
            <div className='menu_box scroll_wrap'>
                <ul>
                    <li>
                        <a href="/" className={menuOn === 1 ? "on" : ""} data-id={1} onClick={navClickHandler}>회원검색</a>
                    </li>
                    <li>
                        <a href="/message" className={menuOn === 2 ? "on" : ""} data-id={2} onClick={navClickHandler}>메시지{chatCount>0 && <span className='num'>{chatCount >= 999 ? 999 : chatCount}</span>}</a>
                    </li>
                    <li>
                        <a href="/chat" className={menuOn === 3 ? "on" : ""} data-id={3} onClick={navClickHandler}>연결한 대화방</a>
                    </li>
                    <li>
                        <a href="/setting" className={menuOn === 4 ? "on" : ""} data-id={4} onClick={navClickHandler}>설정</a>
                    </li>
                </ul>
            </div>
            <div className='bottom_box'>
                <div className='profile flex'>
                    <div className='box flex' onClick={profileClickHandler}>
                        <div className='img'>
                            <img src={user.managerInfo.m_f_photo ? user.managerInfo.m_f_photo : none_profile} alt="프로필이미지" />
                        </div>
                        <div className='txt'>
                            <h6>매칭매니저</h6>
                            <p>{user.managerInfo.m_id}</p>
                        </div>
                    </div>
                    <a href="/setting" data-id={4} onClick={navClickHandler}>더보기버튼</a>
                </div>
                <ul className='txt_ul flex_between'>
                    <li className='flex_between'>
                        <span>당일건수</span>
                        <span>{CF.MakeIntComma(user.managerInfo.today_introduce)} 건</span>
                    </li>
                    <li className='flex_between'>
                        <span>당월건수</span>
                        <span>{CF.MakeIntComma(user.managerInfo.month_introduce)} 건</span>
                    </li>
                </ul>
            </div>
        </header>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Header;