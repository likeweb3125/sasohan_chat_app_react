import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import * as CF from "../config/function";
import { enum_api_uri } from "../config/enum";
import { confirmPop, messagePopList } from "../store/popupSlice";
import { newMsgData, groupMsg, pageNo, pageMore, newList } from "../store/commonSlice";
import LeftCont from "../components/layout/LeftCont";
import RightCont from "../components/layout/RightCont";
import ConfirmPop from "../components/popup/ConfirmPop";


const Message = () => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const user = useSelector((state)=>state.user);
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const msg_list = enum_api_uri.msg_list;
    const [confirm, setConfirm] = useState(false);
    const [allCount, setAllCount] = useState(0);
    const [msgList, setMsgList] = useState([]);
    const [listSelected, setListSelected] = useState("높은 일차순");
    const [searchValue, setSearchValue] = useState("");
    const [searchOn, setSearchOn] = useState(false);
    const [listCount, setListCount] = useState(0);
    const firstRender = useRef(true);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //메시지리스트 가져오기
    const getList = (page, sort, newGet) => {
        axios.get(`${msg_list}?page_no=${page}${sort ? "&sort="+sort : ""}${searchOn ? "&search="+searchValue : ""}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                if(newGet){
                    setMsgList([...data.chat_list]);
                }else{
                    setMsgList([...msgList,...data.chat_list]);
                }

                setListCount(data.chat_count);

                //store에 페이지저장
                dispatch(pageNo({pageNo:data.current_page,pageLastNo:data.last_page}));

                //store에 newList false
                dispatch(newList(false));
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


    //맨처음 메시지리스트 가져오기
    useEffect(()=>{
        axios.get(`${msg_list}?page_no=${1}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setMsgList([...data.chat_list]);

                setAllCount(data.chat_count);

                setListCount(data.chat_count);

                //store에 페이지저장
                dispatch(pageNo({pageNo:data.current_page,pageLastNo:data.last_page}));

                //store에 newList false
                dispatch(newList(false));
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
    },[]);


    //회원리스트내역에서 스크롤시 그다음페이지내역 추가로 가져오기
    useEffect(()=>{
        if(common.pageMore && common.pageNo < common.pageLastNo){
            if(listSelected == "낮은 일차순"){
                getList(common.pageNo+1,"row");
            }else{
                getList(common.pageNo+1);
            }

            dispatch(pageMore(false));
        }
    },[common.pageMore]);


    //회원명 검색하기
    const searchHandler = () => {
        if(searchValue.length > 0){
            dispatch(newList(true));
            dispatch(pageMore(false));
            setSearchOn(true);
        }else{
            setSearchOn(false);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: "검색할 회원명을 입력해주세요.",
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };

    
    useEffect(()=>{
        if(searchOn){
            //검색할때만 store messagePopList 값 지우기 (체크리스트)
            dispatch(messagePopList([]));

            //searchOn true 일때는 회원명으로 검색하기
            let sel = "";
            if(listSelected == "낮은 일차순"){
                sel = "row";
            }
            getList(1,sel,true);
        }
    },[searchOn]);


    //메시지리스트 정렬하기
    const listSortHandler = () => {
        dispatch(newList(true));
        dispatch(pageMore(false));
        if(listSelected == "높은 일차순"){
            getList(1,"",true);
        }
        if(listSelected == "낮은 일차순"){
            getList(1,"row",true);
        }
    };


    //맨처음 렌더링될때 말고 listSelected 값이 바뀔때만 listSortHandler 함수실행
    useEffect(()=>{
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        
        listSortHandler();
    },[listSelected]);


    //단체메시지 전송완료시 리스트 다시 불러오기
    useEffect(()=>{
        if(common.groupMsg){
            getList(1,"",true);
            dispatch(groupMsg(false));
        }
    },[common.groupMsg]);

    
    //소켓 메시지 받으면 메시지 리스트값 변경 - 관리자전용 알림
    useEffect(()=>{
        console.log(common.newMsgDataAdmin)
        if(Object.keys(common.newMsgDataAdmin).length > 0){  
            const updatedMsgList = [...msgList]; // 복사해서 수정할 새로운 배열 생성

            let selectedItem = null;
            for (let i = 0; i < updatedMsgList.length; i++) {
                if (updatedMsgList[i].m_id === common.newMsgDataAdmin.m_id) {
                    selectedItem = updatedMsgList.splice(i, 1)[0]; // 선택한 아이템을 배열에서 제거하고 해당 아이템 저장
                    break;
                }
            }

            //채팅방 있을때
            if (selectedItem) {
                selectedItem = {
                    ...selectedItem,
                    idx: common.newMsgDataAdmin.idx,
                    from_id: common.newMsgDataAdmin.from_id,
                    to_id: common.newMsgDataAdmin.to_id,
                    msg: common.newMsgDataAdmin.message_type == "I" ? "사진" : common.newMsgDataAdmin.msg,
                    w_date: common.newMsgDataAdmin.w_date,
                    to_view_count: selectedItem.to_view_count + common.newMsgDataAdmin.to_view_count
                };
                updatedMsgList.unshift(selectedItem); // 선택한 아이템을 배열의 맨 앞에 추가
            }
            //채팅방 없을때
            else if(!selectedItem && common.newMsgDataAdmin.m_id != user.managerInfo.m_id){
                updatedMsgList.unshift(common.newMsgDataAdmin);
            }
            setMsgList(updatedMsgList);

            //store messagePopList 값 지우기 (체크리스트)
            dispatch(messagePopList([]));
        }
    },[common.newMsgDataAdmin]);


    //소켓 메시지 받으면 메시지 리스트값 변경
    useEffect(()=>{
        console.log(common.newMsgData)
        if(Object.keys(common.newMsgData).length > 0){  
            const updatedMsgList = [...msgList]; // 복사해서 수정할 새로운 배열 생성

            let selectedItem = null;
            for (let i = 0; i < updatedMsgList.length; i++) {
                if (updatedMsgList[i].m_id === common.selectUser.m_id) {
                    selectedItem = updatedMsgList.splice(i, 1)[0]; // 선택한 아이템을 배열에서 제거하고 해당 아이템 저장
                    break;
                }
            }

            //채팅방 있을때
            if (selectedItem) {
                selectedItem = {
                    ...selectedItem,
                    idx: common.newMsgData.idx,
                    from_id: common.newMsgData.from_id,
                    to_id: common.newMsgData.to_id,
                    msg: common.newMsgData.message_type == "I" ? "사진" : common.newMsgData.msg,
                    w_date: common.newMsgData.time,
                    to_view_count: common.newMsgData.to_id === user.managerInfo.m_id ? selectedItem.to_view_count + common.newMsgData.view_cnt : selectedItem.to_view_count
                };
                updatedMsgList.unshift(selectedItem); // 선택한 아이템을 배열의 맨 앞에 추가
            }
            //채팅방 없을때
            else{
                updatedMsgList.unshift(common.newMsgData);
            }
            setMsgList(updatedMsgList);

            //store messagePopList 값 지우기 (체크리스트)
            dispatch(messagePopList([]));
        }
    },[common.newMsgData]);


    //store msgViewId 값이 있으면 메시지리스트중 그 회원에게 온 메시지 읽음처리
    useEffect(()=>{
        if(common.msgViewId.length > 0){
            const updatedMsgList = msgList.map(item => {
                if (item.m_id === common.msgViewId) {
                    return {
                        ...item,
                        to_view_count: 0,
                    };
                }
                return item;
            });
            setMsgList(updatedMsgList);
        }
    },[common.msgViewId]);



    return(<>
        <LeftCont
            page="message"
            allCount={allCount}
            searchValue={searchValue}
            onSearchChange={(e)=>{setSearchValue(e.currentTarget.value)}}
            onSearchHandler={searchHandler}
            listSelected={listSelected}
            onSelChange={(e)=>{setListSelected(e.currentTarget.value)}}
            selHidden={true}
            listCount={listCount}
            list={msgList}
            allCheck={true}
            listType="message"
        />
        <RightCont />

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Message;