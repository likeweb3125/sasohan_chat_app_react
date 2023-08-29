import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { messagePopList } from "../../store/popupSlice";
import { selectUser, pageMore, pageNo } from "../../store/commonSlice";

import MemberBox from "./MemberBox";


const MemberListCont = (props) => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const dispatch = useDispatch();
    const [listOn, setListOn] = useState(null);
    const [idList, setIdList] = useState([]);
    const listRef = useRef();

    
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
            dispatch(messagePopList([...idList]));
        }else{
            dispatch(messagePopList([]));
        }
    };


    //리스트 맨밑으로 스크롤시 그다음 리스트내역 가져오기
    const listScroll = () => {
        // 단체메시지 전송팝업이 안열려있을때만 가능 (단체메시지 리스트내역과 겹침 방지)
        if(!popup.messagePop){
            const isAtBottom = listRef.current.scrollHeight - listRef.current.scrollTop === listRef.current.clientHeight;
            if(isAtBottom){
                dispatch(pageMore(true));
            }
        }
    };

    
    //리스트값 새로가져올때 리스트 스크롤top
    useEffect(()=>{
        if(common.newList && listRef.current){
            listRef.current.scrollTop = 0;

            //store에 페이지값 지우기
            dispatch(pageNo({pageNo:1,pageLastNo:null}));
        }
    },[common.newList]);


    //선택한 회원값이 변경될때마다 li on 변경
    useEffect(()=>{
        let list = props.list;
        if(common.selectUser.hasOwnProperty("m_id") && common.selectUser.m_id.length > 0){
            let idx = list.findIndex(item=>item.m_id === common.selectUser.m_id);
            setListOn(idx);
        }else if(common.selectUser.hasOwnProperty("manager_id") && common.selectUser.manager_id.length > 0){
            let idx = list.findIndex(item=>item.manager_id === common.selectUser.manager_id);
            setListOn(idx);
        }else{
            setListOn(null);
        }
    },[common.selectUser, props.list]);


    useEffect(()=>{
        console.log(popup.messagePop);
        console.log(listOn);
        if(popup.messagePop){
            setListOn(null);
        }
    },[popup.messagePop]);


    useEffect(()=>{
        setListOn(listOn);
    },[listOn]);


    



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
                                    checked={idList.length > 0 && idList.length === popup.messagePopList.length && idList.every(item => popup.messagePopList.includes(item))}
                                />
                                <span className="check"></span>
                                <span className="txt">전체 선택</span>
                            </label>
                        </div>
                    </div>
                }
                    <div className="scroll_wrap list_box" ref={listRef} onScroll={listScroll}>
                        <ul>
                            {props.list.map((mem,i)=>{
                                return(
                                    <li key={i} className={listOn === i ? "on" : ""} 
                                        onClick={()=>{
                                            setListOn(i);

                                            // 단체메시지 전송팝업이 안열려있을때만 가능 (단체메시지 리스트내역과 겹침 방지)
                                            if(!popup.messagePop){
                                                // 연결한 대화방 페이지일때
                                                if(props.listType === "chat"){
                                                    dispatch(
                                                        selectUser(
                                                            {
                                                                room_id:mem.room_id,
                                                                idx:mem.last_idx,
                                                                manager_id:mem.manager_id,
                                                                from_id:mem.from_id,
                                                                from_user:mem.from_user.m_name,
                                                                to_user:mem.to_user.m_name,
                                                            }
                                                        )
                                                    );
                                                }else{
                                                    dispatch(
                                                        selectUser(
                                                            {
                                                                room_id:mem.room_id,
                                                                idx:mem.last_idx || mem.idx,
                                                                m_id:mem.m_id, 
                                                                m_name:mem.m_name,
                                                                m_gender:mem.m_gender,
                                                                birth:mem.birth || mem.m_born,
                                                                m_address:mem.m_address,
                                                            }
                                                        )
                                                    );
                                                }
                                            }
                                        }}
                                    >
                                        <MemberBox 
                                            listType={props.listType}
                                            data={mem}
                                            checkValue={mem.m_id}
                                            liOn={listOn === i ? true : false}
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

export default MemberListCont;