import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as CF from "../../config/function";
import { messagePop, filterPop, messagePopList, confirmPop } from "../../store/popupSlice"; 
import { filter } from "../../store/commonSlice";
import SearchBox from "../component/SearchBox";
import SelectBox from "../component/SelectBox";
import MemberListCont from "../component/MemberListCont";
import ConfirmPop from "../popup/ConfirmPop";

const LeftCont = (props) => {
    const popup = useSelector((state)=>state.popup);
    const dispatch = useDispatch();
    const selectList = ["마지막 소개 이력순","최근 가입일자순"];
    const selectList2 = ["높은 일차순","낮은 일차순"];
    const [checkNum, setCheckNum] = useState(0);
    const [confirm, setConfirm] = useState(false);

    
    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //단체메시지 보낼 선택한 회원수
    useEffect(()=>{
        const num = popup.messagePopList.length;
        setCheckNum(num);
    },[popup.messagePopList]);


    //단체메시지 전송버튼 클릭시
    const groupMsgSend = () => {
        let num;
        if(checkNum){
            num = checkNum;
        }else{
            num = props.listCount;
        }
        
        if(num > 0){
            dispatch(messagePop(true));
        }else{
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: "선택된 회원이 없습니다.",
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };


    return(<>
        <div className="left_cont">
            <div className="top_box">
                <div className="tit_box flex w_100">
                    <h1>{props.page === "member" ? "회원검색" : props.page === "message" ? "메시지함" : props.page === "chat" ? "연결한 대화방" : props.page === "setting" && "설정"}</h1>
                    {props.page !== "setting" &&
                        <p className="flex">{props.page === "member" ? "전체 회원수 " : props.page === "message" ? "전체 메시지수 " : props.page === "chat" && "전체 소개팅 "}
                        <span><strong>{CF.MakeIntComma(props.allCount)}</strong> {props.page === "member" ? "명" : props.page === "message" ? "개" : props.page === "chat" && "건"}</span></p>
                    }
                </div>
                {props.page === "member" || props.page === "message" ? //회원검색, 메시지 페이지일때
                    <div className="round_box flex_between w_100">
                        <div className="flex">
                            <h6>단체메시지</h6>
                            <p className="txt flex">회원수 <span><strong>{checkNum ? CF.MakeIntComma(checkNum) : CF.MakeIntComma(props.listCount)}</strong> 명</span></p>
                        </div>
                        <button className="btn_send" onClick={groupMsgSend}>전송</button>
                    </div>
                    : props.page === "chat" && //연결한대화방 페이지일때
                    <div className="round_box round_box2 flex_between w_100">
                        <ul className="flex_between w_100">
                            <li className="flex_between">
                                <p>진행중인 소개팅</p>
                                <p><strong>{CF.MakeIntComma(props.isConnect)}</strong> 건</p>
                            </li>
                            <li className="flex_between">
                                <p>진행종료된 소개팅</p>
                                <p><strong>{CF.MakeIntComma(props.endConnect)}</strong> 건</p>
                            </li>
                        </ul>
                    </div>
                }
            </div>
            <div className="bottom_box">
                {props.page !== "setting" ?
                    <>
                        <div className="top_search">
                            <SearchBox 
                                placeholder="회원명 검색"
                                searchValue={props.searchValue}
                                onChangeHandler={props.onSearchChange}
                                onSearchHandler={props.onSearchHandler}
                            />
                            <div className="flex_between tp8">
                                <p className="txt">{`검색된 ${props.page == "chat" ? "대화방수" : "회원수"}`} <span><strong>{CF.MakeIntComma(props.listCount)}</strong> {props.page == "chat" ? "개" : "명"}</span></p>
                                <div className="flex">
                                    <SelectBox 
                                        list={props.page === "member" ? selectList : selectList2}
                                        selected={props.listSelected}
                                        onChangeHandler={props.onSelChange}
                                        selHidden={props.selHidden}
                                    />
                                    {props.page === "member" &&
                                        <button className="btn_filter" onClick={()=>{
                                            dispatch(filterPop(true));
                                            dispatch(filter(false));
                                        }}>필터버튼</button>
                                    }
                                </div>
                            </div>
                        </div>
                        <MemberListCont
                            allCheck={props.allCheck}
                            list={props.list}
                            listType={props.listType}
                        />
                    </>
                    :   <div className="setting_box">
                            <div className="scroll_wrap">
                                <p className="tit">단체메시지 설정</p>
                                <ul className="select_ul">
                                    <li className="flex_between">
                                        <p>최대 전체선택 인원수</p>
                                        <SelectBox 
                                            list={["100","200","300","400","500","600","700","800","900","1000"]}
                                            selected={props.selectedNum}
                                            onChangeHandler={props.onSelNumChange}
                                            listType={"number"}
                                        />
                                    </li>
                                    <li className="flex_between">
                                        <p>할당된 회원 번호</p>
                                        <SelectBox 
                                            list={["0~1","2~3","4~6","7~9"]}
                                            selected={props.selectedRange}
                                            onChangeHandler={props.onSelRangeChange}
                                        />
                                    </li>
                                </ul>
                            </div>
                            <button type="button" className="btn" onClick={props.onSaveHandler}>설정 저장</button>
                        </div>
                }
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default LeftCont;