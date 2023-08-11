import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as CF from "../../config/function";
import { memCheckPop, memCheckPopCheckList, confirmPop, messagePopList, loadingPop } from "../../store/popupSlice";
import SearchBox from "../component/SearchBox";
import MemberListContPop from "../component/MemberListContPop";
import ConfirmPop from "./ConfirmPop";

const MemberCheckPop = (props) => {
    const popup = useSelector((state)=>state.popup);
    const dispatch = useDispatch();
    const [confirm, setConfirm] = useState(false);
    const [changeConfirm, setChangeConfirm] = useState(false);
    
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


    // 회원삭제 or 추가 
    const changeHandler = () => {
        let list = popup.messagePopList;
        let selList = popup.memCheckPopCheckList;
        let newList;
        if(popup.memCheckPopTit == "삭제"){
            newList = list.filter((item) => !selList.includes(item));
        }if(popup.memCheckPopTit == "추가"){
            newList = list.concat(selList);
        }
        dispatch(messagePopList(newList));
        closePopHandler();
    };



    return(<>
        <div className="pop_wrap mem_check_pop">
            <div className="dim"></div>
            <div className="pop_cont">
                <div className="pop_tit flex_between">
                    <p className="f_20"><strong>회원 {popup.memCheckPopTit}</strong></p>
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <SearchBox placeholder="회원명 검색" />
                <MemberListContPop
                    allCheck={true}
                    list={popup.memCheckPopList}
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