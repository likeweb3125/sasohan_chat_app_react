import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { memCheckPopCheckList } from "../../store/popupSlice";
import MemberBoxPop from "./MemberBoxPop";


//단체메시지 삭제,추가팝업에만 사용
const MemberListContPop = (props) => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const dispatch = useDispatch();
    const [listOn, setListOn] = useState(null);
    const [idList, setIdList] = useState([]);

    //맨처음 리스트 회원아이디값만 배열로
    useEffect(()=>{
        if(props.list){
            const list = props.list.map((item) => item.m_id).filter(Boolean);
            setIdList([...list]);
        }
    },[props.list]);


    //전체선택 체크박스 체크시
    const allCheckHandler = (checked) => {
        if(checked){
            dispatch(memCheckPopCheckList([...idList]));
        }else{
            dispatch(memCheckPopCheckList([]));
        }
    };


    return(
        <div className="member_list_wrap">
            {props.list && props.list.length > 0 ? <>
                {props.allCheck &&
                    <div className="top_all_check">
                        <div className="custom_check">
                            <label className="clearfix">
                                <input 
                                    type="checkbox" 
                                    onChange={(e)=>{allCheckHandler(e.currentTarget.checked)}} 
                                    checked={idList.length > 0 && idList.length === popup.memCheckPopCheckList.length && idList.every(item => popup.memCheckPopCheckList.includes(item))}
                                />
                                <span className="check"></span>
                                <span className="txt">전체 선택</span>
                            </label>
                        </div>
                    </div>
                }
                    <div className="scroll_wrap list_box">
                        <ul>
                            {props.list.map((mem,i)=>{
                                return(
                                    <li key={i} className={listOn === i ? "on" : ""} 
                                        onClick={()=>{
                                            setListOn(i);
                                        }}
                                    >
                                        <MemberBoxPop 
                                            listType={props.listType}
                                            data={mem}
                                            checkValue={mem.m_id}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </>
                : props.list && props.list.length === 0 && <div className="none_data tx_c">데이터가 없습니다.</div>
            }
        </div>
    );
};

export default MemberListContPop;