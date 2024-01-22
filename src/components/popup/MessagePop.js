import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import QueryString from "qs";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { messagePop, memCheckPop, confirmPop, loadingPop, messagePopList } from "../../store/popupSlice";
import { groupMsg } from "../../store/commonSlice";
import ConfirmPop from "./ConfirmPop";
import MemberListCont from "../component/MemberListCont";
import MessageInputWrap from "../component/MessageInputWrap";


const MessagePop = (props) => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const user = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const api_uri = enum_api_uri.api_uri;
    const g_msg_list = enum_api_uri.g_msg_list;
    const g_msg_list_add = enum_api_uri.g_msg_list_add;
    const g_msg_list2 = enum_api_uri.g_msg_list2;
    const g_msg_list_add2 = enum_api_uri.g_msg_list_add2;
    const g_msg_send = enum_api_uri.g_msg_send;
    const g_msg_img_send = enum_api_uri.g_msg_img_send;
    const [confirm, setConfirm] = useState(false);
    const [sendConfirm, setSendConfirm] = useState(false);
    const [sendOkConfirm, setSendOkConfirm] = useState(false);
    const [list, setList] = useState([]);
    const [idList, setIdList] = useState([]);
    const [textareaValue, setTextareaValue] = useState("");
    const location = useLocation();
    const [photoPath, setPhotoPath] = useState("upload/chat/");


    //팝업닫기
    const closePopHandler = () => {
        dispatch(messagePop(false));
        dispatch(messagePopList([]));
    };

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setSendConfirm(false);
            setSendOkConfirm(false);
        }
    },[popup.confirmPop]);


    //회원리스트 값 변경될때마다 회원아이디값만 배열로
    useEffect(()=>{
        let newIdList = list.map(item => item.m_id).filter(Boolean);
        setIdList(newIdList);
    },[list]);


    //단체메시지 보낼회원정보 리스트 가져오기 - 회원검색 페이지
    const getList = () => {
        dispatch(loadingPop(true));

        let body = {
            to_id: popup.messagePopList
        };

        let search;
        if(popup.messagePopSearch && popup.messagePopSearch.length > 0){
            search = true;
        }else{
            search = false;
        }

        let params;
        if(common.filter){
            let data = {...common.filterData};
            if(data.j_M_log && data.j_M_log != null){
                data.j_M_log = moment(data.j_M_log).format("YYYY-MM-DD");
            }else if(data.j_M_log == null){
                data.j_M_log = "";
            }
            if(data.j_last_in1 && data.j_last_in1 != null){
                data.j_last_in1 = moment(data.j_last_in1).format("YYYY-MM-DD");
            }else if(data.j_last_in1 == null){
                data.j_last_in1 = "";
            }
            if(data.j_last_in2 && data.j_last_in2 != null){
                data.j_last_in2 = moment(data.j_last_in2).format("YYYY-MM-DD");
            }else if(data.j_last_in2 == null){
                data.j_last_in2 = "";
            }
            if(data.j_reg_date1 && data.j_reg_date1 != null){
                data.j_reg_date1 = moment(data.j_reg_date1).format("YYYY-MM-DD");
            }else if(data.j_reg_date1 == null){
                data.j_reg_date1 = "";
            }
            if(data.j_reg_date2 && data.j_reg_date2 != null){
                data.j_reg_date2 = moment(data.j_reg_date2).format("YYYY-MM-DD");
            }else if(data.j_reg_date2 == null){
                data.j_reg_date2 = "";
            }
            params = QueryString.stringify(data);
        }

        axios.post(`${g_msg_list}?sort=${popup.messagePopSort}${search ? "&search="+popup.messagePopSearch : ""}${params ? "&"+params : ""}`,body,
            {headers: {Authorization: `Bearer ${user.tokenValue}`}}
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


    //단체메시지 보낼회원정보 리스트 가져오기 - 메시지 페이지
    const getList2 = () => {
        dispatch(loadingPop(true));

        let body = {
            to_id: popup.messagePopList
        };

        let search;
        if(popup.messagePopSearch && popup.messagePopSearch.length > 0){
            search = true;
        }else{
            search = false;
        }

        axios.post(`${g_msg_list2}?sort=${popup.messagePopSort}${search ? "&search="+popup.messagePopSearch : ""}`,body,
            {headers: {Authorization: `Bearer ${user.tokenValue}`}}
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
        console.log(popup.memCheckPopCheckList);
    },[popup.memCheckPopCheckList]);


    useEffect(()=>{
        console.log(popup.messagePopList);
        const path = location.pathname;
        if(path == "/message"){
            getList2();
        }else{
            // 최고매니저계정으로 단체메시지설정값 최대전체선택 인원수가 제한없음일때만 리스트 안가져옴
            if(user.superManager){
                if(user.managerSetting.set_num > 0){
                    getList();
                }
            }else{
                getList();
            }
        }
    },[popup.messagePopList]);


    //회원 삭제시
    useEffect(()=>{
        let deltList = popup.messagePopDeltList;
        let newList = list.filter(item => !deltList.includes(item.m_id));
        setList(newList);
    },[popup.messagePopDeltList]);

    
    //회원 추가시
    useEffect(()=>{
        let addList = popup.messagePopAddList;
        setList([...addList,...list]);
    },[popup.messagePopAddList]);


    //회원 삭제버튼 클릭시
    const deltHandler = () => {
        if(list.length > 0){
            dispatch(memCheckPop({memCheckPop:true,memCheckPopTit:"삭제",memCheckPopList:list}));
        }else{
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'삭제할 회원이 없습니다.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };
 

    //회원 추가버튼 클릭시
    const addHandler = () => {
        const path = location.pathname;

        if(list.length == popup.messagePopAllCount){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'추가할 회원이 없습니다.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }else{
            if(path == "/message"){ //메시지 페이지일때 단체회원가져오기
                dispatch(loadingPop(true));

                let body = {
                    to_id: idList
                };

                axios.post(`${g_msg_list_add2}`,body,
                    {headers: {Authorization: `Bearer ${user.tokenValue}`}}
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
                dispatch(loadingPop(true));

                let body = {
                    to_id: idList
                };

                axios.post(`${g_msg_list_add}`,body,
                    {headers: {Authorization: `Bearer ${user.tokenValue}`}}
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
            }
        }
    };


    //이미지 첨부하기
    const imgAttach = () => {
        dispatch(loadingPop(true));

        //이미지 이름만 전송하기
        let imgList = common.msgImgs;
        imgList = imgList.map(url => {
            let updatedUrl = url.replace(api_uri, "");
            updatedUrl = updatedUrl.replace(photoPath, "");
            return updatedUrl;
        });

        let body = {
            to_id: idList,
            image_array: imgList
        };

        axios.post(`${g_msg_img_send}`,body,
            {headers: {Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res) => {
            if (res.status === 200) {
                dispatch(loadingPop(false));

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


    //메시지 보내기
    const textSend = () => {
        dispatch(loadingPop(true));

        let body = {
            to_id: idList,
            msg: textareaValue
        };

        axios.post(`${g_msg_send}`,body,
            {headers: {Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res) => {
            if (res.status === 200) {
                dispatch(loadingPop(false));

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

   
    //단체메시지전송 버튼 클릭시
    const msgSendHandler = () => {
        //최고매니저계정일때 list [] 빈배열로 메시지전송
        if(user.superManager){
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: "단체메시지를 선택한 회원에게 전송하시겠습니까?",
                confirmPopBtn:2,
            }));
            setSendConfirm(true);
        }else{
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


    return(<>
        <div className="pop_wrap message_pop">
            <div className="dim"></div>
            <div className="pop_cont pop_cont3">
                <div className="pop_tit flex_between">
                    <p className="f_24"><strong>단체 메시지</strong></p>
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                {/* 최고매니저계정으로 단체메시지설정값 최대전체선택 인원수가 제한없음일때만 미노출 */}
                {(!user.superManager || (user.superManager && user.managerSetting.set_num > 0)) &&
                    <div className="list_cont">
                        <div className="top_box flex_between">
                            <div className="tit flex"><strong>선택한 회원</strong><span><strong>{CF.MakeIntComma(list.length)}</strong> 명</span></div>
                            <div className="flex">
                                <button type="button" className="btn_round3 rm4" onClick={deltHandler}>삭제</button>
                                <button type="button" className="btn_round2" onClick={addHandler}>추가</button>
                            </div>
                        </div>
                        <MemberListCont
                            list={list}
                            listType="member"
                        />
                    </div>
                }
                <div style={user.superManager ? {"borderTop": "1px solid #EAEAEA"} : {}}>
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

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default MessagePop;