import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as CF from "../../config/function";
import { memPop, memPopPosition, messagePopList } from "../../store/popupSlice";

const MemberBox = (props) => {
    const popup = useSelector((state)=>state.popup);
    const dispatch = useDispatch();
    const [btnOn, setBtnOn] = useState(false);

    //회원정보버튼 클릭시
    const memBtnClickHandler = (e, id) => {
        const bodyH = document.body.offsetHeight;
        const element = e.currentTarget;
        let top = element.getBoundingClientRect().top;
        let left = element.getBoundingClientRect().left;
        if(bodyH - 250 < top){
            top = top - 250;
        }
        dispatch(memPopPosition([top + 30,left]));
        dispatch(memPop({memPop:!popup.memPop,memPopId:id}));
        setBtnOn(!btnOn);
    };

    //회원정보팝업 닫히면 회원정보버튼 off
    useEffect(()=>{
        if(!popup.memPop){
            setBtnOn(false);
        }
    },[popup.memPop]);

    //체크박스 체크시
    const checkHandler = async (checked, value) => {
        let newList = popup.messagePopList;
        if(checked){
            newList = newList.concat(value);
        }else if(!checked && newList.includes(value)){
            newList = newList.filter((el)=>el !== value);
        }
        dispatch(messagePopList(newList));
    };


    return(<>

        {props.listType === "check_member" ? //체크박스있는 회원리스트일때
            <div className="custom_check member_box flex">
                <label htmlFor={`check${props.checkValue}`}>
                    <input 
                        type="checkbox" 
                        id={`check${props.checkValue}`} 
                        value={props.checkValue} 
                        onChange={(e) => {
                            const isChecked = e.currentTarget.checked;
                            const value = e.currentTarget.value;
                            checkHandler(isChecked, value);
                        }}
                        checked={popup.messagePopList.includes(props.checkValue)}
                    />
                    <span className="check"></span>
                </label>
                <div className="box flex_between">
                    <div className="flex">
                        <p className={`name${props.data.m_gender == "2" ? " mem_w" : ""}${props.data.m_app ? " app" : ""}`}>{props.data.m_name}</p>
                        <p className="age">{props.data.m_address}<span>&nbsp;·&nbsp;{props.data.birth}</span></p>
                    </div>
                    <button type="button" className={`btn_mem${btnOn ? " on" : ""}`} 
                        onClick={(e)=>{
                            memBtnClickHandler(e, props.data.m_id);
                        }}
                    >회원정보버튼</button>
                </div>
            </div>
            
            : props.listType === "member" ? //체크박스없는 회원리스트일때
            <div className="member_box">
                <div className="box flex_between">
                    <div className="flex">
                        <p className={`name${props.data.m_gender == "2" ? " mem_w" : ""}`}>{props.data.m_name}</p>
                        <p className="age">{props.data.m_address}<span>&nbsp;·&nbsp;{props.data.birth}</span></p>
                    </div>
                    <button type="button" className={`btn_mem${btnOn ? " on" : ""}`} 
                        onClick={(e)=>{
                            memBtnClickHandler(e,props.data.m_id);
                        }}
                    >회원정보버튼</button>
                </div> 
            </div>

            : props.listType === "message" ? //메시지리스트일때
            <div className="custom_check member_box flex">
                <label htmlFor={`check${props.checkValue}`}>
                    <input 
                        type="checkbox" 
                        id={`check${props.checkValue}`} 
                        value={props.checkValue} 
                        onChange={(e) => {
                            const isChecked = e.currentTarget.checked;
                            const value = e.currentTarget.value;
                            checkHandler(isChecked, value);
                        }}
                        checked={popup.messagePopList.includes(props.checkValue)}
                    />
                    <span className="check"></span>
                </label>
                <div className="box flex_between flex_top">
                    <div className="txt_box">
                        <div className="flex">
                            <p className={`name${props.data.m_gender == "2" ? " mem_w" : ""}`}>{props.data.m_name}</p>
                            <p className="age">{props.data.m_address}<span>&nbsp;·&nbsp;{props.data.m_born}</span></p>
                        </div>
                        <p className="ellipsis">{props.data.msg}</p>
                    </div>
                    <div className="tx_r">
                        <p className="time">{props.data.w_date}</p>
                        {!props.liOn && props.data.to_view_count > 0 && <span className="num">{props.data.to_view_count >= 999 ? 999 : props.data.to_view_count}</span>}
                    </div>
                </div>
            </div>

            : props.listType === "chat" && //연결한 대화방리스트일때
            <div className="member_box member_box_chat flex">
                <div>
                    <div className={`tag${props.data.meet_intention == "미결정" ? " ing" : props.data.meet_intention == "결정완료" ? " done" : ""}`}>{props.data.meet_intention}</div>
                    <p className="txt">{props.data.day}</p>
                </div>
                <div className="box flex_between">
                    <div className="txt_box">
                        <ul>
                            <li className="flex">
                                {props.data.from_user ? 
                                    <>
                                        <p className={`name${props.data.from_user.m_gender == 2 ? ' mem_w' : ''}`}>{props.data.from_user && props.data.from_user.m_name}</p>
                                        <p className="age">{props.data.from_user && props.data.from_user.m_address}<span>&nbsp;·&nbsp;{props.data.from_user && props.data.from_user.birth}</span></p>
                                    </>
                                    :<p>탈퇴한 회원입니다.</p>
                                }
                            </li>
                            <li className="flex">
                                {props.data.to_user ? 
                                    <>
                                        <p className={`name${props.data.to_user.m_gender == 2 ? ' mem_w' : ''}`}>{props.data.to_user.m_name}</p>
                                        <p className="age">{props.data.to_user && props.data.to_user.m_address}<span>&nbsp;·&nbsp;{props.data.to_user && props.data.to_user.birth}</span></p>
                                    </>
                                    :<p>탈퇴한 회원입니다.</p>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        }

        
    </>);
};

export default MemberBox;