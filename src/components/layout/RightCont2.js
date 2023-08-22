import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import 'moment/locale/ko';
import { useSocket } from "../etc/SocketProvider";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { chatPop, imgPop, confirmPop } from "../../store/popupSlice";
import { msgSend, selectUser, newMsgData, socketRooms } from "../../store/commonSlice";
import ConfirmPop from "../popup/ConfirmPop";
import FloatingMember from "../component/FloatingMember";
import MemberBox from "../component/MemberBox";
import MessageInputWrap from "../component/MessageInputWrap";
import noneChatImg from "../../images/ic_none_chat.svg";
import noneSelectImg from "../../images/ic_none_select.svg";
import noneReadingImg from "../../images/ic_none_reading.svg";
import noneSetImg from "../../images/ic_none_set.svg";
import sampleImg from "../../images/sample/img_sample.jpg";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";



const RightCont = (props) => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const socket = useSocket();
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const common = useSelector((state)=>state.common);
    const api_uri = enum_api_uri.api_uri;
    const assi_list = enum_api_uri.assi_list;
    const assi_add = enum_api_uri.assi_add;
    const assi_delt = enum_api_uri.assi_delt;
    const msg_cont_list = enum_api_uri.msg_cont_list;
    const msg_cont_list_admin = enum_api_uri.msg_cont_list_admin;
    const [confirm, setConfirm] = useState(false);
    const [floatDeltconfirm, setFloatDeltConfirm] = useState(false);
    const [floatOn, setFloatOn] = useState(false);
    const [listOn, setListOn] = useState(null);
    const [memBtnOn, setMemBtnOn] = useState(false);
    const [assiList, setAssiList] = useState([]);
    const [assiCount, setAssiCount] = useState(0);
    const floatBoxRef = useRef(null);
    const floatListRef = useRef(null);
    const [btnToggle, setBtnToggle] = useState(null);
    const [chatOn, setChatOn] = useState(null);
    const [noSetting, setNoSetting] = useState(null);
    const [noSelect, setNoSelect] = useState(null);
    const [noChat, setNoChat] = useState(null);
    const [noPower, setNoPower] = useState(null);
    const [myChat, setMyChat] = useState(null);
    const [msgList, setMsgList] = useState([]);
    const chatRef = useRef();
    const innerRef = useRef();
    const [textareaValue, setTextareaValue] = useState("");
    const [floatId, setFloatId] = useState("");
    const [chatLastIdx, setChatLastIdx] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    //window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setFloatDeltConfirm(false);
        }
    },[popup.confirmPop]);

    
    useEffect(()=>{
        setMsgList(msgList);

        //로컬스토리지에 선택한회원과의 채팅수 저장
        localStorage.setItem("msgCount",msgList.length);
    },[msgList]);


    // 소켓 채팅방 연결
    const socketInit = () => {
        const data = { room_id: common.selectUser.room_id};
        if(!common.socketRooms.includes(common.selectUser.room_id)){
            socket.emit("join room", data);
        }
    };


    useEffect(()=>{
        if(socket){
            //채팅방 연결 받기
            socket.on("join room", (result) => {
                console.log(JSON.stringify(result, null, 2));

                let rooms = [...common.socketRooms];
                const roomId = result.room_id;

                if(!rooms.includes(roomId)) {
                    rooms.push(roomId);
                    dispatch(socketRooms([...rooms]));
                }
            })

            //메시지 받기
            socket.on("chat msg", (result) => {
                console.log(JSON.stringify(result, null, 2));
                const msgCount = localStorage.getItem("msgCount");
                let date = new Date();
                    date = moment(date).format("YYYY년 M월 D일 dddd");
                let start = [
                    {
                        "idx": result.idx,
                        "from_id": result.from_id,
                        "to_id": result.to_id,
                        "msg": "매니저가 회원님께 대화를 신청했어요!",
                        "time": result.time,
                        "message_type": "Q",
                        "view_cnt": result.view_cnt
                    },
                    {
                        "idx": result.idx,
                        "from_id": result.from_id,
                        "to_id": result.to_id,
                        "msg": date,
                        "time": result.time,
                        "message_type": "S",
                        "view_cnt": result.view_cnt
                    }
                ];
                let msg = {
                    "idx": result.idx,
                    "from_id": result.from_id,
                    "to_id": result.to_id,
                    "msg": result.msg,
                    "time": result.time,
                    "message_type": result.message_type,
                    "view_cnt": result.view_cnt
                };

                if(msgCount > 0){
                    setMsgList(prevList => [...prevList, msg]);
                }else{
                    setMsgList(prevList => [...prevList, ...start, msg]);
                }
                

                //메시지입력 textarea 값 비우기
                setTextareaValue("");

                //메시지내역 맨밑으로 스크롤
                setTimeout(()=>{
                    chatRef.current.scrollTop = chatRef.current.scrollHeight;
                },10);

                dispatch(newMsgData(result));
            });

            //이미지 받기
            socket.on("image upload", (result) => {
                console.log(JSON.stringify(result, null, 2));
                const msgCount = localStorage.getItem("msgCount");
                let date = new Date();
                    date = moment(date).format("YYYY년 M월 D일 dddd");
                let start = [
                    {
                        "idx": result.idx,
                        "from_id": result.from_id,
                        "to_id": result.to_id,
                        "msg": "매니저가 회원님께 대화를 신청했어요!",
                        "time": result.time,
                        "message_type": "Q",
                        "view_cnt": result.view_cnt
                    },
                    {
                        "idx": result.idx,
                        "from_id": result.from_id,
                        "to_id": result.to_id,
                        "msg": date,
                        "time": result.time,
                        "message_type": "S",
                        "view_cnt": result.view_cnt
                    }
                ];
                let imgs = result.msg.map(item => "upload/chat/" + item);
                let msg = {
                    "idx": result.idx,
                    "from_id": result.from_id,
                    "to_id": result.to_id,
                    "msg": imgs,
                    "time": result.time,
                    "message_type": result.message_type,
                    "view_cnt": result.view_cnt
                };

                if(msgCount > 0){
                    setMsgList(prevList => [...prevList, msg]);
                }else{
                    setMsgList(prevList => [...prevList, ...start, msg]);
                }

                dispatch(msgSend(true));

                //메시지내역 맨밑으로 스크롤
                setTimeout(()=>{
                    chatRef.current.scrollTop = chatRef.current.scrollHeight;
                },10);

                dispatch(newMsgData(result));
            });

            //에러메시지 받기
            socket.on("chat error", (result) => {
                console.log(JSON.stringify(result, null, 2));
            })
        }
    },[socket]);


    //회원정보팝업 닫히면 회원정보버튼 off
    useEffect(()=>{
        if(!popup.memPop){
            setMemBtnOn(false);
        }
    },[popup.memPop]);


    //응대중인회원 가져오기
    const getAssiList = () => {
        axios.get(`${assi_list}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setAssiList([...data.userList]);
                setAssiCount(data.count);
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

    
    //맨처음 응대중인회원 가져오기
    useEffect(()=>{
        getAssiList();
    },[]);


    //응대중인 회원이 많을때만 토글버튼 보이기
    useEffect(()=>{
        //windowWidth 바뀌면 floatOn = false;
        setFloatOn(false);

        if (floatBoxRef.current !== null && floatListRef.current !== null) {
            let boxH = floatBoxRef.current.offsetHeight;
            let listH = floatListRef.current.offsetHeight;

            if(listH <= boxH){
                setBtnToggle(false);
            }else{
                setBtnToggle(true);
            }
        }
    },[assiList, windowWidth]);


    //플로팅 띄우기
    const floatingAdd = () => {
        let body = {
            m_id: common.selectUser.m_id
        };

        axios.post(`${assi_add}`,body,
            {headers: {Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: data.msg,
                    confirmPopBtn:1,
                }));
                setConfirm(true);

                getAssiList();
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


    //플로팅 회원 삭제버튼 클릭시
    const floatingDeltBtn = (id) => {
        setFloatId(id);

        setFloatDeltConfirm(true);
        dispatch(confirmPop({
            confirmPop:true,
            confirmPopTit:'알림',
            confirmPopTxt: "선택 회원을 삭제하시겠습니까?",
            confirmPopBtn:2,
        }));
    };


    //플로팅 회원 삭제하기
    const floatingDelt = () => {
        axios.delete(`${assi_delt}`,
            {
                data: {m_id: floatId},
                headers: {Authorization: `Bearer ${token}`}
            }
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: data.msg,
                    confirmPopBtn:1,
                }));
                setConfirm(true);

                getAssiList();

                setFloatId();

                setListOn(null);

                dispatch(selectUser({}));
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
    

    //매니저 단체메시지설정 변경시
    useEffect(()=>{
        if(user.managerSetting.set_num > 0 && user.managerSetting.set_range.length > 0){
            setNoSetting(false);
        }else{
            setNoSetting(true);
        }
    },[user.managerSetting]);


    //store에 selectUser 값이 바뀔때
    useEffect(()=>{
        console.log(common.selectUser)

        //회원선택했을때 메시지내용가져오기
        if(Object.keys(common.selectUser).length > 0){
            
            //연결한대화방 페이지 아닐때 
            if(common.selectUser.hasOwnProperty("m_id") && common.selectUser.m_id.length > 0){
                setMyChat(true);

                //선택한회원 대화방 소켓연결
                socketInit();

                //선택한회원중에 내가응대중인회원 on
                let idx = assiList.findIndex(item=>item.m_id === common.selectUser.m_id);
                setListOn(idx);

                // 선택한회원과 대화방이 있을때만 메시지내용가져오기
                if(common.selectUser.room_id.length > 0 && common.selectUser.idx){
                    setChatOn(true);
                    setNoSelect(false);

                    //최근 메시지내용 가져오기
                    axios.get(`${msg_cont_list.replace(":to_id",common.selectUser.m_id).replace(":last_idx",common.selectUser.idx)}`,
                        {headers:{Authorization: `Bearer ${token}`}}
                    )
                    .then((res)=>{
                        if(res.status === 200){ 
                            let data = res.data;

                            //대화내용이 있을때
                            if(data.length > 0){
                                data = data.reverse();
                                setMsgList([...data]);

                                setChatOn(true);
                                setNoChat(false);

                                let idx = data[0].idx; 
                                setChatLastIdx(idx);

                                //메시지내역 맨밑으로 스크롤
                                setTimeout(()=>{
                                    chatRef.current.scrollTop = chatRef.current.scrollHeight;
                                },10);
                            }
                            //대화내용이 없을때
                            else{
                                setMsgList([]);
                                setChatOn(true);
                                setNoChat(true);
                            }
                        }
                    })
                    .catch((error) => {
                        const err_msg = CF.errorMsgHandler(error);
                        if(err_msg == "대화방이 존재하지 않습니다."){
                            setChatOn(true);
                            setNoChat(true);
                        }else{
                            dispatch(confirmPop({
                                confirmPop:true,
                                confirmPopTit:'알림',
                                confirmPopTxt: err_msg,
                                confirmPopBtn:1,
                            }));
                            setConfirm(true);
                        }
                    });
                }else{
                    setMsgList([]);
                    setChatOn(true);
                    setNoChat(true);
                }
            }

            //연결한대화방 페이지 일때 
            if(common.selectUser.hasOwnProperty("manager_id") && common.selectUser.manager_id.length > 0){
                setMyChat(false);
                
                // 선택한 연결한대화방이 있을때만 메시지내용가져오기
                if(common.selectUser.room_id.length > 0 && common.selectUser.idx){
                    setChatOn(true);

                    //최근 메시지내용 가져오기 - 연결된 회원끼리 대화
                    axios.get(`${msg_cont_list_admin.replace(":room_id",common.selectUser.room_id).replace(":last_idx",common.selectUser.idx)}`,
                        {headers:{Authorization: `Bearer ${token}`}}
                    )
                    .then((res)=>{
                        if(res.status === 200){ 
                            let data = res.data;

                            //대화내용이 있을때
                            if(data.length > 0){
                                data = data.reverse();
                                setMsgList([...data]);

                                setChatOn(true);

                                let idx = data[0].idx; 
                                setChatLastIdx(idx);

                                //메시지내역 맨밑으로 스크롤
                                setTimeout(()=>{
                                    chatRef.current.scrollTop = chatRef.current.scrollHeight;
                                },10);
                            }
                            //대화내용이 없을때
                            else{
                                setMsgList([]);
                                setChatOn(true);
                            }
                        }
                    })
                    .catch((error) => {
                        const err_msg = CF.errorMsgHandler(error);
                        if(err_msg == "대화방이 존재하지 않습니다."){
                            setChatOn(true);
                        }else{
                            dispatch(confirmPop({
                                confirmPop:true,
                                confirmPopTit:'알림',
                                confirmPopTxt: err_msg,
                                confirmPopBtn:1,
                            }));
                            setConfirm(true);
                        }
                    });
                }
            }
        }else{
            setChatOn(false);
            setNoSelect(true);
        }
    },[common.selectUser]);


    //메시지내용 가져오기 - 매니저와 회원의 대화
    const getMessage = (idx) => {
        axios.get(`${msg_cont_list.replace(":to_id",common.selectUser.m_id).replace(":last_idx",idx)}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                //대화내용이 있을때
                if(data.length > 0){
                    data = data.reverse();
                    setMsgList([...data,...msgList]);

                    setChatOn(true);
                    setNoChat(false);

                    let idx = data[0].idx; 
                    setChatLastIdx(idx);
                }
            }
        })
        .catch((error) => {
            const err_msg = CF.errorMsgHandler(error);
            if(err_msg == "대화방이 존재하지 않습니다."){
                setChatOn(true);
                setNoChat(true);
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: err_msg,
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        });
    };


    //메시지내용 가져오기 - 연결된 회원끼리 대화
    const getMessageAdmin = (idx) => {
        axios.get(`${msg_cont_list_admin.replace(":room_id",common.selectUser.room_id).replace(":last_idx",idx)}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                //대화내용이 있을때
                if(data.length > 0){
                    data = data.reverse();
                    setMsgList([...data,...msgList]);

                    setChatOn(true);
                    setNoChat(false);

                    let idx = data[0].idx; 
                    setChatLastIdx(idx);
                }
            }
        })
        .catch((error) => {
            const err_msg = CF.errorMsgHandler(error);
            if(err_msg == "대화방이 존재하지 않습니다."){
                setChatOn(true);
                setNoChat(true);
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: err_msg,
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }
        });
    };


    //이미지 첨부하기
    const imgAttach = () => {
        let data = {
            room_id: common.selectUser.room_id,
            to_id: common.selectUser.m_id,
            msg: common.msgImgs
        }
        socket.emit("file upload", data);
    };


    //메시지 보내기
    const textSend = () => {
        let data = {
            room_id: common.selectUser.room_id,
            to_id: common.selectUser.m_id,
            msg: textareaValue
        }
        socket.emit("chat message", data);
    };


    //채팅전송 버튼 클릭시
    const msgSendHandler = () => {
        if(textareaValue){
            textSend();
        }
        if(common.msgImgs.length > 0){
            imgAttach();
        }
    };


    //채팅창 맨위로 스크롤시 그 전 메시지내용 가져오기
    const chatScroll = () => {
        const chatH = chatRef.current.offsetHeight;
        const innerH = innerRef.current.offsetHeight;
        const scrollTop = chatRef.current.scrollTop;
        if(innerH > chatH){
            if (scrollTop === 0) {
                const prevScrollHeight = chatRef.current.scrollHeight;
                if(myChat){
                    getMessage(chatLastIdx);
                }else{
                    getMessageAdmin(chatLastIdx);
                }

                setTimeout(() => {
                    const newScrollHeight = chatRef.current.scrollHeight;
                    const addedHeight = newScrollHeight - prevScrollHeight;
                    chatRef.current.scrollTop = addedHeight;
                }, 100);
            }
        }
    };


    const onDragStart = () => {
        if(!floatOn){
            setFloatOn(true);
        }
        

        console.log(floatBoxRef.current.offsetHeight);
        console.log(floatListRef.current.offsetHeight);

        // if (floatBoxRef.current !== null && floatListRef.current !== null) {
        //     let boxH = floatBoxRef.current.offsetHeight;
        //     let listH = floatListRef.current.offsetHeight;

        //     if(listH <= boxH){
        //         setBtnToggle(false);
        //     }else{
        //         setBtnToggle(true);
        //     }
        // }

        
    };


    const onDragEnd = (result) => {
        const { destination, source } = result;
        
        // 드래그 위치 및 동작에 따라 필요한 동작을 수행합니다.
        if (!destination) {
          // 드롭 영역 밖으로 드래그한 경우 처리 로직을 추가하세요.
          return;
        }
      
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
          // 같은 위치로 드래그한 경우 처리 로직을 추가하세요.
          return;
        }
        
        console.log(result);
        // 드롭된 요소를 재배치하는 로직을 추가하세요.

        let list = assiList;
        let id = result.draggableId;
        let idx = result.destination.index;

        // m_id 값이 id인 객체의 인덱스 찾기
        const targetIndex = list.findIndex(item => item.m_id === id);

        // targetIndex가 유효하다면 배열에서 해당 객체 제거 후, 새로운 위치에 삽입
        if (targetIndex !== -1) {
            const targetItem = list.splice(targetIndex, 1)[0]; // 해당 객체 제거 및 반환
            list.splice(idx, 0, targetItem); // 새로운 위치에 삽입
        }

        console.log(list);
        setAssiList([...list]);
    };

    
    return(<>
        <div className="right_cont">
            <div className="top_box">
                <div className="tit flex">
                    <strong>내가 응대중인 회원</strong>
                    <span><strong>{CF.MakeIntComma(assiCount)}</strong> 명</span>
                </div>

                {assiList && 
                    <div className={`floating_box flex_between flex_top ${floatOn ? "on" : ""}`} ref={floatBoxRef}>
                        {assiList.length > 0 ?
                            <>
                                <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                                    <div className={`list_box ${floatOn ? "scroll_wrap" : ""}`}>
                                        <Droppable droppableId="droppable" direction="horizontal">
                                            {(provided) => (
                                                <ul className="flex flex_wrap" 
                                                    ref={(element) => {
                                                        provided.innerRef(element);
                                                        floatListRef.current = element;
                                                    }} 
                                                    {...provided.droppableProps}
                                                >
                                                    {assiList.map((mem,i)=>{
                                                        return(
                                                            <Draggable key={mem.m_id} draggableId={mem.m_id} index={i}>
                                                                {(provided) => (
                                                                    <li className={listOn === i ? "on" : ""} 
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        onClick={()=>{
                                                                            setListOn(i);
                                                                            dispatch(
                                                                                selectUser(
                                                                                    {
                                                                                        room_id:mem.room_id,
                                                                                        idx:mem.last_idx || mem.idx,
                                                                                        m_id:mem.m_id, 
                                                                                        m_name:mem.m_name,
                                                                                        m_gender:mem.m_gender,
                                                                                        birth:mem.birth || mem.m_born,
                                                                                        m_address:mem.m_address,
                                                                                    }
                                                                                )
                                                                            );
                                                                        }}
                                                                    >
                                                                        <FloatingMember 
                                                                            data={mem} 
                                                                            onDeltHandler={()=>{floatingDeltBtn(mem.m_id)}}
                                                                        />
                                                                    </li>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    {provided.placeholder}
                                                </ul>
                                            )}
                                        </Droppable>
                                    </div>
                                </DragDropContext>
                                {btnToggle && <button type="button" className="btn_toggle" onClick={()=>{setFloatOn(!floatOn)}}>토글버튼</button>}
                            </>
                            :   <div className="none_txt">플로팅 띄운 회원이 없습니다.</div>
                        }
                    </div>
                }

            </div>
            <div className={`bottom_box ${floatOn ? "small" : ""}`}>
                <div className="over_hidden">
                    {chatOn && props.page != "chat" &&
                        <div className="mem_box flex_between">
                            <MemberBox 
                                listType="member"
                                data={common.selectUser}
                            />
                            <div className="btn_box flex">
                                <button type="button" onClick={floatingAdd}>플로팅 띄우기</button>
                                <button type="button" onClick={()=>{dispatch(chatPop(true))}}>대화방 연결</button>
                            </div>
                        </div>
                    }
                    <div className="chat_wrap scroll_wrap" ref={chatRef} onScroll={chatScroll}>
                        {chatOn && msgList && msgList.length > 0 ?
                            <div className="inner" ref={innerRef}>
                                {msgList.map((cont,i)=>{
                                    let send;
                                    if(myChat){
                                        if(cont.from_id === user.managerInfo.m_id){
                                            send = true;
                                        }else{
                                            send = false;
                                        }
                                    }else{
                                        if(cont.from_id === common.selectUser.from_id){
                                            send = true;
                                        }else{
                                            send = false;
                                        }
                                    }

                                    return(<div key={i}>
                                        {cont.message_type == "Q" ?
                                            <div className="tit_box">{common.selectUser.m_name} 님께 대화를 신청했어요!</div>
                                        : cont.message_type == "N" ?
                                            <div className="tit_box">{cont.msg}</div>
                                        : cont.message_type == "S" ?
                                            <div className="date_box">
                                                <span>{cont.msg}</span>
                                            </div>
                                        :   <div className={`chat_box ${send ? "send" : ""}`}>
                                                {send ?
                                                    <>
                                                    {!myChat && <p className="name tx_r">{common.selectUser.from_user}</p>}
                                                    <ul className="txt_ul">
                                                        <li>
                                                            <div className="box flex_bottom">
                                                                <p className="time">{cont.view_cnt == 0 && <span>읽음</span>}{cont.time}</p>
                                                                {cont.message_type == "T" ? <div className="txt">{cont.msg}</div>
                                                                    :   cont.message_type == "I" && 
                                                                        <ul className="img_ul flex_wrap">
                                                                            {cont.msg.map((imgSrc,i)=>{
                                                                                let img = api_uri+imgSrc;
                                                                                return(
                                                                                    <li key={i} 
                                                                                        onClick={()=>{
                                                                                            dispatch(imgPop({imgPop:true,imgPopList:[...cont.msg],imgPopIdx:i}));
                                                                                        }}
                                                                                    >
                                                                                        <img src={img} alt="이미지" />
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                }
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    </>
                                                    :   <>
                                                        <p className="name">{myChat ? common.selectUser.m_name : common.selectUser.to_user}</p>
                                                        <ul className="txt_ul">
                                                            <li>
                                                                <div className="box flex_bottom">
                                                                    {cont.message_type == "T" ? <div className="txt">{cont.msg}</div>
                                                                        :   cont.message_type == "I" && 
                                                                            <ul className="img_ul flex_wrap">
                                                                                {cont.msg.map((imgSrc,i)=>{
                                                                                    let img = api_uri+imgSrc;
                                                                                    return(
                                                                                        <li key={i} 
                                                                                            onClick={()=>{
                                                                                                dispatch(imgPop({imgPop:true,imgPopList:[...cont.msg],imgPopIdx:i}));
                                                                                            }}
                                                                                        >
                                                                                            <img src={img} alt="이미지" />
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                    }
                                                                    <p className="time">{cont.time}</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        </>
                                                }
                                            </div>
                                        }
                                    </div>);
                                })}
                            </div>
                            : !chatOn && noSetting ? //설정 완료전 일때
                                <div className="none_box">
                                    <img src={noneSetImg} alt="아이콘" />
                                    <p>설정이 완료된 후, <br/>채팅 관리자를 이용하실 수 있습니다.</p>
                                </div>
                            : !chatOn && noSelect ? //선택한 대화방이 없을때
                                <div className="none_box">
                                    <img src={noneSelectImg} alt="아이콘" />
                                    <p>선택한 대화방이 없습니다. <br/>대화방을 선택해주세요.</p>
                                </div>
                            : noChat && //대화내용이 없을때
                                <div className="none_box">
                                    <img src={noneChatImg} alt="아이콘" />
                                    <p>대화 내용이 없습니다. 메시지를 전송하세요.</p>
                                </div> 
                            //대화내용 열람못할때
                            // : !chatOn && noPower && 
                            //     <div className="none_box">
                            //         <img src={noneReadingImg} alt="아이콘" />
                            //         <p>연결한 대화방의 대화 내용을 <br/>열람할 수 없습니다.</p>
                            //     </div>
                        }

                    </div>
                </div>
                {chatOn && myChat &&
                    <MessageInputWrap 
                        textareaValue={textareaValue}
                        onTextareaChange={(e)=>{setTextareaValue(e.currentTarget.value)}}
                        onMsgSendHandler={msgSendHandler}
                    />
                }
            </div>
        </div>

        {/* 응대중인회원 삭제 confirm팝업 */}
        {floatDeltconfirm && <ConfirmPop onClickHandler={floatingDelt} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default RightCont;