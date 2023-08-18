import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { messagePop, memCheckPop, confirmPop, loadingPop } from "../../store/popupSlice";
import { groupMsg } from "../../store/commonSlice";
import ConfirmPop from "./ConfirmPop";
import MemberListCont from "../component/MemberListCont";
import MessageInputWrap from "../component/MessageInputWrap";

const MessagePop = (props) => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const g_msg_list = enum_api_uri.g_msg_list;
    const g_msg_list_add = enum_api_uri.g_msg_list_add;
    const g_msg_send = enum_api_uri.g_msg_send;
    const g_msg_img_send = enum_api_uri.g_msg_img_send;
    const [confirm, setConfirm] = useState(false);
    const [closeConfirm, setCloseConfirm] = useState(false);
    const [sendConfirm, setSendConfirm] = useState(false);
    const [sendOkConfirm, setSendOkConfirm] = useState(false);
    const [list, setList] = useState([]);

    const [textareaValue, setTextareaValue] = useState("");

    //팝업닫기
    const closePopHandler = () => {
        dispatch(messagePop(false));
    };

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setCloseConfirm(false);
            setSendConfirm(false);
            setSendOkConfirm(false);
        }
    },[popup.confirmPop]);


    //단체메시지 보낼회원정보 리스트 가져오기
    const getList = () => {
        dispatch(loadingPop(true));

        let body = {
            to_id: popup.messagePopList
        };

        axios.post(`${g_msg_list}`,body,
            {headers: {Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                let data = res.data;
                setList([...data]);
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));
            
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


    useEffect(()=>{
        getList();
    },[popup.messagePopList]);


    useEffect(()=>{
        let deltList = popup.messagePopDeltList;
        let newList = list.filter(item => !deltList.includes(item.m_id));
        setList(newList);
    },[popup.messagePopDeltList]);
 

    //회원 추가버튼 클릭시
    const addHandler = () => {
        if(popup.messagePopList.length > 0){
            dispatch(loadingPop(true));

            let body = {
                to_id: popup.messagePopList
            };

            axios.post(`${g_msg_list_add}`,body,
                {headers: {Authorization: `Bearer ${token}`}}
            )
            .then((res)=>{
                if(res.status === 200){
                    dispatch(loadingPop(false));

                    let data = res.data;
                    dispatch(memCheckPop({memCheckPop:true,memCheckPopTit:"추가",memCheckPopList:data}));
                }
            })
            .catch((error) => {
                dispatch(loadingPop(false));
                
                const err_msg = CF.errorMsgHandler(error);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: err_msg,
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            });
        }else{
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'추가할 회원이 없습니다.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };


    //이미지 첨부하기
    const imgAttach = () => {
        let body = {
            to_id: popup.messagePopList,
            image_array: common.msgImgs
        };

        axios.post(`${g_msg_img_send}`,body,
            {headers: {Authorization: `Bearer ${token}`}}
        )
        .then((res) => {
            if (res.status === 200) {
                dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                    confirmPopTxt: "단체메시지를 선택된 회원들에게 전송했습니다!",
                    confirmPopBtn:1,
                }));
                setSendOkConfirm(true);

                dispatch(groupMsg(true));
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


    //메시지 보내기
    const textSend = () => {
        let body = {
            to_id: popup.messagePopList,
            msg: textareaValue
        };

        axios.post(`${g_msg_send}`,body,
            {headers: {Authorization: `Bearer ${token}`}}
        )
        .then((res) => {
            if (res.status === 200) {
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: "단체메시지를 선택된 회원들에게 전송했습니다!",
                    confirmPopBtn:1,
                }));
                setSendOkConfirm(true);

                dispatch(groupMsg(true));
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

   
    //단체메시지전송 버튼 클릭시
    const msgSendHandler = () => {
        if(list.length > 0){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: "단체메시지를 선택한 회원에게 전송하시겠습니까?",
                confirmPopBtn:2,
            }));
            setSendConfirm(true);
        }else{
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'선택된 회원이 없습니다.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };

    //단체메시지전송 
    const sendHandler = () => {
        if(textareaValue){
            textSend();
        }
        if(common.msgImgs.length > 0){
            imgAttach();
        }
    };


    //닫기, 취소버튼 클릭시
    const cancelHandler = () => {
        dispatch(confirmPop({
            confirmPop:true,
            confirmPopTit:'알림',
            confirmPopTxt: "작성중인 내용을 저장하지 않고 나가시겠습니까?",
            confirmPopBtn:2,
        }));
        setCloseConfirm(true);
    };


    return(<>
        <div className="pop_wrap message_pop">
            <div className="dim"></div>
            <div className="pop_cont pop_cont3">
                <div className="pop_tit flex_between">
                    <p className="f_24"><strong>단체 메시지</strong></p>
                    <button type="button" className="btn_close" onClick={cancelHandler}>닫기버튼</button>
                </div>
                <div className="list_cont">
                    <div className="top_box flex_between">
                        <div className="tit flex"><strong>선택한 회원</strong><span><strong>{CF.MakeIntComma(list.length)}</strong> 명</span></div>
                        <div className="flex">
                            <button type="button" className="btn_round3 rm4" onClick={()=>{
                                dispatch(memCheckPop({memCheckPop:true,memCheckPopTit:"삭제",memCheckPopList:list}));
                            }}>삭제</button>
                            <button type="button" className="btn_round2" onClick={addHandler}>추가</button>
                        </div>
                    </div>
                    <MemberListCont
                        list={list}
                        listType="member"
                    />
                </div>
                <div>
                    <MessageInputWrap 
                        textareaValue={textareaValue}
                        onTextareaChange={(e)=>{setTextareaValue(e.currentTarget.value)}}
                        onMsgSendHandler={msgSendHandler}
                        group={true}
                    />
                </div>
            </div>
        </div>

        {/* 단체메시지 보내기 confirm팝업 */}
        {sendConfirm && <ConfirmPop onClickHandler={sendHandler} />}

        {/* 단체메시지 보내기 완료 confirm팝업 */}
        {sendOkConfirm && <ConfirmPop closePop="custom" onCloseHandler={closePopHandler} />}

        {/* 단체메시지 닫기 confirm팝업 */}
        {closeConfirm && <ConfirmPop onClickHandler={closePopHandler} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default MessagePop;