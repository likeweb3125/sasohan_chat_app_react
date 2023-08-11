import { useEffect, useState } from "react";
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
    const [msgList, setMsgList] = useState([]);
    const [listSelected, setListSelected] = useState("마지막 소개 이력순");
    const [searchValue, setSearchValue] = useState("");
    const [searchOn, setSearchOn] = useState(false);
    const [listCount, setListCount] = useState(0);

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


    //회원리스트내역에서 스크롤시 그다음페이지내역 추가로 가져오기
    useEffect(()=>{
        if(common.pageMore && common.pageNo < common.pageLastNo){
            if(listSelected == "최근 가입일자순"){
                getList(common.pageNo+1,"sign");
            }else if(common.filterData){
                let sel = "";
                if(listSelected == "최근 가입일자순"){
                    sel = "sign";
                }
                getList(common.pageNo+1,sel,false);
            }else if(searchOn){
                searchHandler()
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
            setSearchOn(true);

            let sel = "";
            if(listSelected == "최근 가입일자순"){
                sel = "sign";
            }
            getList(1,sel,true);
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


    //메시지리스트 정렬하기
    const listSortHandler = () => {
        dispatch(newList(true));
        if(listSelected == "마지막 소개 이력순"){
            getList(1,"",true);
        }
        if(listSelected == "최근 가입일자순"){
            getList(1,"sign",true);
        }
    };

    useEffect(()=>{
        listSortHandler();
    },[listSelected]);


    //검색할때만 store messagePopList 값 지우기 (체크리스트)
    useEffect(()=>{
        if(searchOn){
            dispatch(messagePopList([]));
        }
    },[searchOn]);


    //메시지리스트 바뀔때마다 
    useEffect(()=>{
        //store messagePopList 값 지우기 (체크리스트)
        dispatch(messagePopList([]));
    },[msgList]);


    useEffect(()=>{
        if(common.groupMsg){
            getList(1,"",true);
            dispatch(groupMsg(false));
        }
    },[common.groupMsg]);

    
    //소켓 메시지 받으면 메시지 리스트값 변경
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
            else{
                updatedMsgList.unshift(common.newMsgDataAdmin);
            }
            setMsgList(updatedMsgList);
        }
    },[common.newMsgDataAdmin]);


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
            allCount={listCount}
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