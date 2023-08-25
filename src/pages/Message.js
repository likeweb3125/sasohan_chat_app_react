import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import * as CF from "../config/function";
import { enum_api_uri } from "../config/enum";
import { confirmPop, messagePopList, messagePopAllCount, messagePopSearch, messagePopSort, loadingPop } from "../store/popupSlice";
import { groupMsg, pageNo, pageMore, newList } from "../store/commonSlice";
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
        dispatch(loadingPop(true));

        axios.get(`${msg_list}?page_no=${page}${sort ? "&sort="+sort : ""}${searchOn ? "&search="+searchValue : ""}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                let data = res.data;
                if(newGet){
                    setMsgList([...data.chat_list]);
                }else{
                    setMsgList([...msgList,...data.chat_list]);
                }

                setListCount(data.all_cnt);

                //store에 페이지저장
                dispatch(pageNo({pageNo:data.current_page,pageLastNo:data.last_page}));

                //store에 newList false
                dispatch(newList(false));
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


    //맨처음 메시지리스트 가져오기
    useEffect(()=>{
        dispatch(loadingPop(true));

        axios.get(`${msg_list}?page_no=${1}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                let data = res.data;
                setMsgList([...data.chat_list]);

                setAllCount(data.all_cnt);

                setListCount(data.all_cnt);

                //store에 단체메시지 회원수 저장
                dispatch(messagePopAllCount(data.all_cnt));

                //store에 페이지저장
                dispatch(pageNo({pageNo:data.current_page,pageLastNo:data.last_page}));

                //store에 newList false
                dispatch(newList(false));
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

            dispatch(messagePopSearch(searchValue));
        }
    },[searchOn]);


    //회원명 검색 input값 변경시 searchOn false
    useEffect(()=>{
        if(searchOn){
            setSearchOn(false);
        }
    },[searchValue]);


    //메시지리스트 정렬하기
    const listSortHandler = () => {
        dispatch(newList(true));
        dispatch(pageMore(false));
        if(listSelected == "높은 일차순"){
            getList(1,"",true);
            dispatch(messagePopSort(""));
        }
        if(listSelected == "낮은 일차순"){
            getList(1,"row",true);
            dispatch(messagePopSort("row"));
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

    
    //소켓 메시지 받으면 메시지 리스트값 변경
    useEffect(()=>{
        if(Object.keys(common.newMsgData).length > 0){  
            const updatedMsgList = [...msgList]; // 복사해서 수정할 새로운 배열 생성

            let selectedItem = null;
            for (let i = 0; i < updatedMsgList.length; i++) {
                if (updatedMsgList[i].m_id === common.newMsgData.m_id) {
                    selectedItem = updatedMsgList.splice(i, 1)[0]; // 선택한 아이템을 배열에서 제거하고 해당 아이템 저장
                    break;
                }
            }

            //채팅방 있을때
            if (selectedItem) {
                let view;
                if(common.selectUser.hasOwnProperty("m_id") && common.selectUser.m_id.length > 0 && common.selectUser.m_id === common.newMsgData.m_id){
                    view = 0;
                }else{
                    view = selectedItem.to_view_count + common.newMsgData.to_view_count;
                }
                selectedItem = {
                    ...selectedItem,
                    idx: common.newMsgData.idx,
                    from_id: common.newMsgData.from_id,
                    to_id: common.newMsgData.to_id,
                    msg: common.newMsgData.message_type == "I" ? "사진" : common.newMsgData.msg,
                    w_date: common.newMsgData.w_date,
                    to_view_count: view
                };
                updatedMsgList.unshift(selectedItem); // 선택한 아이템을 배열의 맨 앞에 추가
            }
            //채팅방 없을때
            else if(!selectedItem && common.newMsgData.m_id != user.managerInfo.m_id){
                updatedMsgList.unshift(common.newMsgData);
            }
            setMsgList(updatedMsgList);

            //store messagePopList 값 지우기 (체크리스트)
            dispatch(messagePopList([]));
        }
    },[common.newMsgData]);


    // 메시지 읽음처리
    useEffect(()=>{
        if(common.selectUser.hasOwnProperty("m_id") && common.selectUser.m_id.length > 0){
            const updatedMsgList = msgList.map(item => {
                if (item.m_id === common.selectUser.m_id) {
                    return {
                        ...item,
                        to_view_count: 0,
                    };
                }
                return item;
            });
            setMsgList(updatedMsgList);
        }
    },[common.selectUser]);



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