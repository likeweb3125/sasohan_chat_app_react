import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import QueryString from "qs";
import { enum_api_uri } from "../config/enum";
import * as CF from "../config/function";
import { confirmPop, messagePopList } from "../store/popupSlice";
import { filter, filterData, pageNo, pageMore, newList } from "../store/commonSlice";
import LeftCont from "../components/layout/LeftCont";
import RightCont from "../components/layout/RightCont";
import ConfirmPop from "../components/popup/ConfirmPop";

const Main = () => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const u_all_count = enum_api_uri.u_all_count;
    const u_list = enum_api_uri.u_list;
    const [confirm, setConfirm] = useState(false);
    const [allCount, setAllCount] = useState(0);
    const [userList, setUserList] = useState([]);
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


    //맨처음 전체회원수 가져오기, 조건검색기 지우기
    useEffect(()=>{
        //전체회원수 가져오기
        getAllCount();

        //store에 조건검색기데이터 지우기
        dispatch(filter(false));
        dispatch(filterData({}));
    },[]);


    //전체회원수 가져오기
    const getAllCount = () => {
        axios.get(`${u_all_count}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setAllCount(data.user_all_count);
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


    //회원리스트 가져오기
    const getList = (page, sort, newGet, params) => {
        //조검검색기값 있을때 params 추가
        let filter;
        if(params){
            filter = params;
        }

        axios.get(`${u_list}?page_no=${page}${sort ? "&sort="+sort : ""}${filter ? "&"+filter : ""}${searchOn ? "&search="+searchValue : ""}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                if(newGet){
                    setUserList([...data.user_list]);
                }else{
                    setUserList([...userList,...data.user_list]);
                }

                setListCount(data.set_cnt);

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
                const params = QueryString.stringify(common.filterData);
                getList(common.pageNo+1,sel,false,params);
            }else if(searchOn){
                searchHandler()
            }else{
                getList(common.pageNo+1);
            }

            dispatch(pageMore(false));
        }
    },[common.pageMore]);

 
    //조건검색기로 회원검색하기
    useEffect(()=>{
        if(common.filter){
            dispatch(newList(true));
            dispatch(filter(false));

            let sel = "";
            if(listSelected == "최근 가입일자순"){
                sel = "sign";
            }
            const params = QueryString.stringify(common.filterData);
            getList(1,sel,true,params);
        }
    },[common.filter]);


    //회원명 검색하기
    const searchHandler = () => {
        if(searchValue.length > 0){
            dispatch(newList(true));
            setSearchOn(true);

            let sel = "";
            if(listSelected == "최근 가입일자순"){
                sel = "sign";
            }
            const params = QueryString.stringify(common.filterData);
            getList(1,sel,true,params);
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


    //회원리스트 정렬하기
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


    


    return(<>
        <LeftCont
            page="member"
            allCount={allCount}
            searchValue={searchValue}
            onSearchChange={(e)=>{setSearchValue(e.currentTarget.value)}}
            onSearchHandler={searchHandler}
            listSelected={listSelected}
            onSelChange={(e)=>{setListSelected(e.currentTarget.value)}}
            selHidden={true}
            listCount={listCount}
            list={userList}
            allCheck={true}
            listType="check_member"
        />
        <RightCont />

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Main;