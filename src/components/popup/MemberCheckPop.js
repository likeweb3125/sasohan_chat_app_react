import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as CF from "../../config/function";
import { memCheckPop, memCheckPopCheckList, confirmPop, messagePopList, loadingPop, messagePopDeltList } from "../../store/popupSlice";
import SearchBox from "../component/SearchBox";
import MemberListContPop from "../component/MemberListContPop";
import ConfirmPop from "./ConfirmPop";

const MemberCheckPop = (props) => {
    const popup = useSelector((state)=>state.popup);
    const dispatch = useDispatch();
    const [memList, setMemList] = useState([]);
    const [confirm, setConfirm] = useState(false);
    const [changeConfirm, setChangeConfirm] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchOn, setSearchOn] = useState(false);
    
    //팝업닫기
    const closePopHandler = () => {
        dispatch(memCheckPop({memCheckPop:false}));
        dispatch(memCheckPopCheckList([]));
    };


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setChangeConfirm(false);
        }
    },[popup.confirmPop]);

    
    useEffect(()=>{
        setMemList(popup.memCheckPopList);
    },[popup.memCheckPopList]);


    // 회원삭제 or 추가 
    const changeHandler = () => {
        let list = popup.messagePopList;
        let selList = popup.memCheckPopCheckList;
        let newList;
        if(list.length > 0){ //전체회원 전송이 아닐때
            if(popup.memCheckPopTit == "삭제"){
                newList = list.filter((item) => !selList.includes(item));
            }if(popup.memCheckPopTit == "추가"){
                newList = list.concat(selList);
            }
            dispatch(messagePopList(newList));
        }else{ //전체회원 전송일때 - 삭제만 가능
            if(popup.memCheckPopTit == "삭제"){
                dispatch(messagePopDeltList(selList));
            }
        }
        closePopHandler();
    };


    //회원명 검색하기
    const searchHandler = () => {
        if(searchValue.length > 0){
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


    //회원명검색시 리스트에서 찾기
    useEffect(()=>{
        if(searchOn){
            let newList = memList.filter((item) => item.m_name.includes(searchValue));
            setMemList(newList);
        }
    },[searchOn]);


    //회원명 검색 input값 변경시 searchOn false
    useEffect(()=>{
        if(searchOn){
            setSearchOn(false);
        }
    },[searchValue]);


    return(<>
        <div className="pop_wrap mem_check_pop">
            <div className="dim"></div>
            <div className="pop_cont">
                <div className="pop_tit flex_between">
                    <p className="f_20"><strong>회원 {popup.memCheckPopTit}</strong></p>
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <SearchBox 
                    placeholder="회원명 검색" 
                    searchValue={searchValue}
                    onChangeHandler={(e)=>{setSearchValue(e.currentTarget.value)}}
                    onSearchHandler={searchHandler}
                />
                <MemberListContPop
                    allCheck={true}
                    list={memList}
                    listType="check_member"
                />
                <div className="btn_box flex_between">
                    <div className="txt flex"><strong>선택한 회원수</strong><span><strong>{CF.MakeIntComma(popup.memCheckPopCheckList.length)}</strong> 명</span></div>
                    <button type="button" className="btn_round" onClick={()=>{
                        if(popup.memCheckPopCheckList.length > 0){
                            dispatch(confirmPop({
                                confirmPop:true,
                                confirmPopTit:'알림',
                                confirmPopTxt: "선택한 회원을 " + popup.memCheckPopTit + "하시겠습니까?",
                                confirmPopBtn:2,
                            }));
                            setChangeConfirm(true);
                        }else{
                            dispatch(confirmPop({
                                confirmPop:true,
                                confirmPopTit:'알림',
                                confirmPopTxt: "선택된 회원이 없습니다.",
                                confirmPopBtn:1,
                            }));
                            setConfirm(true);
                        }
                    }}>{popup.memCheckPopTit}</button>
                </div>
            </div>
        </div>

        {/* 회원삭제 or 추가 confirm팝업 */}
        {changeConfirm && <ConfirmPop onClickHandler={changeHandler} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default MemberCheckPop;