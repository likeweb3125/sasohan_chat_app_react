import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as CF from "../../config/function";
import { memPop, memPopPosition, memCheckPopCheckList } from "../../store/popupSlice";


//단체메시지 삭제,추가팝업에만 사용
const MemberBoxPop = (props) => {
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
        let newList = popup.memCheckPopCheckList;
        if(checked){
            newList = newList.concat(value);
        }else if(!checked && newList.includes(value)){
            newList = newList.filter((el)=>el !== value);
        }
        dispatch(memCheckPopCheckList(newList));
    };


    return(
        <div className="custom_check member_box flex">
            <label htmlFor={`check_${props.checkValue}`}>
                <input 
                    type="checkbox" 
                    id={`check_${props.checkValue}`} 
                    value={props.checkValue} 
                    onChange={(e) => {
                        const isChecked = e.currentTarget.checked;
                        const value = e.currentTarget.value;
                        checkHandler(isChecked, value);
                    }}
                    checked={popup.memCheckPopCheckList.includes(props.checkValue)}
                />
                <span className="check"></span>
            </label>
            <div className="box flex_between">
                <div className="flex">
                    <p className={`name${props.data.m_gender == "2" ? " mem_w" : ""}`}>{props.data.m_name}</p>
                    <p className="age">{props.data.m_address}<span>&nbsp;·&nbsp;{props.data.birth}</span></p>
                </div>
                <button type="button" className={`btn_mem${btnOn ? " on" : ""}`} 
                    onClick={(e)=>{
                        memBtnClickHandler(e, props.data.m_id);
                    }}
                >회원정보버튼</button>
            </div>
        </div>
    );
};

export default MemberBoxPop;