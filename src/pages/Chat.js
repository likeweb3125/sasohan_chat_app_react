import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../config/enum";
import * as CF from "../config/function";
import { confirmPop, loadingPop } from "../store/popupSlice";
import { pageNo, pageMore, newList } from "../store/commonSlice";

import LeftCont from "../components/layout/LeftCont";
import RightCont from "../components/layout/RightCont";
import ConfirmPop from "../components/popup/ConfirmPop";

const Chat = () => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const user = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const chat_list = enum_api_uri.chat_list;
    const [confirm, setConfirm] = useState(false);
    const [allCount, setAllCount] = useState(0);
    const [chatList, setChatList] = useState([]);
    const [listSelected, setListSelected] = useState("높은 일차순");
    const [searchValue, setSearchValue] = useState("");
    const [searchOn, setSearchOn] = useState(false);
    const [listCount, setListCount] = useState(0);
    const [isCount, setIsCount] = useState(0);
    const [endCount, setEndCount] = useState(0);
    const firstRender = useRef(true);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //연결한대화방 리스트 가져오기
    const getList = (page, sort, newGet) => {
        dispatch(loadingPop(true));

        axios.get(`${chat_list}?page_no=${page}${sort ? "&sort="+sort : ""}${searchOn ? "&search="+searchValue : ""}`,
            {headers:{Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                let data = res.data;
                if(newGet){
                    setChatList([...data.chat_list]);
                }else{
                    setChatList([...chatList,...data.chat_list]);
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
            if(error.response.status === 401){//토큰에러시 에러팝업
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'세션이 종료되었습니다.<br/> 현재창을 닫고 다시 로그인해주세요.',
                }));
                setConfirm(true);
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


    //맨처음 연결한대화방 리스트 가져오기
    useEffect(()=>{
        dispatch(loadingPop(true));

        axios.get(`${chat_list}?page_no=${1}`,
            {headers:{Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                let data = res.data;
                setChatList([...data.chat_list]);

                setListCount(data.all_cnt);

                setAllCount(data.all_cnt);
                setIsCount(data.is_connect_cnt);
                setEndCount(data.end_connect_cnt);

                //store에 페이지저장
                dispatch(pageNo({pageNo:data.current_page,pageLastNo:data.last_page}));

                //store에 newList false
                dispatch(newList(false));
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));

            const err_msg = CF.errorMsgHandler(error);
            if(error.response.status === 401){//토큰에러시 에러팝업
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'세션이 종료되었습니다.<br/> 현재창을 닫고 다시 로그인해주세요.',
                }));
                setConfirm(true);
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
    },[]);


    //회원리스트내역에서 스크롤시 그다음페이지내역 추가로 가져오기
    useEffect(()=>{
        if(common.pageMore && common.pageNo < common.pageLastNo){
            if(listSelected == "낮은 일차순"){
                getList(common.pageNo+1,"low");
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


    //searchOn true 일때는 회원명으로 검색하기
    useEffect(()=>{
        if(searchOn){
            let sel = "";
            if(listSelected == "낮은 일차순"){
                sel = "low";
            }
            getList(1,sel,true);
        }
    },[searchOn]);


    //회원명 검색 input값 변경시 searchOn false
    useEffect(()=>{
        if(searchOn){
            setSearchOn(false);
        }
    },[searchValue]);


    //연결한대화방리스트 정렬하기
    const listSortHandler = () => {
        dispatch(newList(true));
        dispatch(pageMore(false));
        if(listSelected == "높은 일차순"){
            getList(1,"",true);
        }
        if(listSelected == "낮은 일차순"){
            getList(1,"low",true);
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



    return(<>
        <LeftCont
            page="chat"
            allCount={allCount}
            searchValue={searchValue}
            onSearchChange={(e)=>{setSearchValue(e.currentTarget.value)}}
            onSearchHandler={searchHandler}
            listSelected={listSelected}
            onSelChange={(e)=>{setListSelected(e.currentTarget.value)}}
            selHidden={true}
            listCount={listCount}
            list={chatList}
            listType="chat"
            isConnect={isCount}
            endConnect={endCount}
        />
        <RightCont 
            page="chat"
        />

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Chat;