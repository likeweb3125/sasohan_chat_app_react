import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import QueryString from "qs";
import { enum_api_uri } from "../config/enum";
import * as CF from "../config/function";
import { confirmPop, messagePopList } from "../store/popupSlice";
import { filter, pageNo, pageMore } from "../store/commonSlice";
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
    const [listSelected, setListSelected] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(1);
    const [filterOn, setFilterOn] = useState(false);

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //전체회원수 가져오기
    const getAllCount = () => {
        axios.get(`${u_all_count}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setAllCount(data.user_all_count);
                setListSelected("마지막 소개 이력순");
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


    //회원리스트 페이지값이 바뀔때마다 회원리스트 가져오기
    // useEffect(()=>{
    //     getList("",true);
    // },[page]);


    //회원리스트 가져오기 - 마지막소개이력 순
    const getList = (params, newList) => {
        console.log(params);
        console.log(newList);
        //조검검색기값 있을때 params 추가
        let filter;
        if(params){
            filter = params;
        }

        axios.get(`${u_list}?page_no=${page}${filter ? "&"+filter : ""}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                if(newList){
                    setUserList([...data.user_list]);
                }else{
                    setUserList([...userList,...data.user_list]);
                }

                //store에 페이지저장
                dispatch(pageNo({pageNo:data.current_page,pageLastNo:data.last_page}));
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


    //회원리스트 가져오기 - 최근가입일자 순
    const getListSign = () => {
        axios.get(`${u_list}?sort=sign`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setUserList({...data});
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

    //맨처음 전체회원수 가져오기, 조건검색기 지우기
    useEffect(()=>{
        //전체회원수 가져오기
        getAllCount();
        
        //store에 조건검색기데이터 지우기
        dispatch(filter({filter:false,filterData:{}}));
    },[]);


    //회원리스트내역에서 스크롤시 그다음페이지내역 추가로 가져오기
    useEffect(()=>{
        if(common.pageMore && common.pageNo < common.pageLastNo){
            setPage(page+1);
            const params = QueryString.stringify(common.filterData);
            getList(params,false);
            dispatch(pageMore(false));
        }
    },[common.pageMore]);

 
    //조건검색기로 회원검색하기
    useEffect(()=>{
        if(common.filter){
            setPage(1);
            const params = QueryString.stringify(common.filterData);
            setTimeout(()=>{
                getList(params,true);
            },200);
        }
    },[common.filter]);


    //회원명 검색하기
    const searchHandler = () => {
        axios.get(`${u_list}?search=${searchValue}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setUserList({...data});
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


    //회원리스트 정렬하기
    const listSortHandler = () => {
        if(listSelected == "마지막 소개 이력순"){
            getList();
        }
        if(listSelected == "최근 가입일자순"){
            getListSign();
        }
    };

    useEffect(()=>{
        listSortHandler();
    },[listSelected]);

    
    //회원리스트 바뀔때마다 store messagePopList 값 지우기 (체크리스트)
    useEffect(()=>{
        dispatch(messagePopList([]));
    },[userList]);


    


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
            listCount={1}
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