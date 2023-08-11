import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { chatPop, imgPop } from "../../store/popupSlice";

import FloatingMember from "../component/FloatingMember";
import MemberBox from "../component/MemberBox";
import MemberPop from "../popup/MemberPop";
import MessageInputWrap from "../component/MessageInputWrap";
import noneChatImg from "../../images/ic_none_chat.svg";
import noneSelectImg from "../../images/ic_none_select.svg";
import noneReadingImg from "../../images/ic_none_reading.svg";
import noneSetImg from "../../images/ic_none_set.svg";
import sampleImg from "../../images/sample/img_sample.jpg";


const RightCont = (props) => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [floatOn, setFloatOn] = useState(false);
    const [listOn, setListOn] = useState(null);
    const [memBtnOn, setMemBtnOn] = useState(false);
    const [enabled, setEnabled] = useState(false);

    // useEffect(() => {
    //     const animation = requestAnimationFrame(() => setEnabled(true));

    //     return () => {
    //         cancelAnimationFrame(animation);
    //         setEnabled(false);
    //     };
    // }, []);

    // useEffect(()=>{
    //     if (!enabled) {
    //         return null;
    //     }
    // },[]);

    //회원정보팝업 닫히면 회원정보버튼 off
    useEffect(()=>{
        if(!popup.memPop){
            setMemBtnOn(false);
        }
    },[popup.memPop]);

    const onDragEnd = (result) => {
        const { destination, source } = result;
        
        // 드래그 위치 및 동작에 따라 필요한 동작을 수행합니다.
        if (!destination) {
          // 드롭 영역 밖으로 드래그한 경우 처리 로직을 추가하세요.
          return;
        }
      
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
          // 같은 위치로 드래그한 경우 처리 로직을 추가하세요.
          return;
        }
      
        // 드롭된 요소를 재배치하는 로직을 추가하세요.
    };

    return(
        <div className="right_cont">
            <div className="top_box">
                <div className="tit flex">
                    <strong>내가 응대중인 회원</strong>
                    {props.floatList && props.floatList.length > 0 && <span><strong>5</strong> 명</span>}
                </div>

                {props.floatList && 
                    <div className={`floating_box flex_between flex_top ${floatOn ? "on" : ""}`}>
                        {props.floatList.length > 0 ?
                            <>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <div className={`list_box ${floatOn ? "scroll_wrap" : ""}`}>
                                        <Droppable droppableId="droppable" direction="horizontal">
                                            {(provided) => (
                                                <ul className="flex flex_wrap" ref={provided.innerRef} {...provided.droppableProps}>
                                                    {props.floatList.map((mem,i)=>{
                                                        return(
                                                            <Draggable key={"id_"+i} draggableId={"id_"+i} index={i}>
                                                                {(provided) => (
                                                                    <li key={i} className={listOn === i ? "on" : ""} 
                                                                        onClick={()=>{setListOn(i)}}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <FloatingMember name={mem} />
                                                                    </li>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    {provided.placeholder}
                                                </ul>
                                            )}
                                        </Droppable>
                                    </div>
                                </DragDropContext>
                                <button type="button" className="btn_toggle" onClick={()=>{setFloatOn(!floatOn)}}>토글버튼</button>
                            </>
                            :   <div className="none_txt">플로팅 띄운 회원이 없습니다.</div>
                        }
                    </div>
                }

            </div>
            <div className={`bottom_box ${floatOn ? "small" : ""}`}>
                <div className="over_hidden">
                    <div className="mem_box flex_between">
                        <MemberBox 
                            listType="member"
                        />
                        <div className="btn_box flex">
                            <button type="button">플로팅 띄우기</button>
                            <button type="button" onClick={()=>{dispatch(chatPop(true))}}>대화방 연결</button>
                        </div>
                    </div>
                    <div className="chat_wrap scroll_wrap">
                        <div className="inner">
                            <div className="tit">윤지후 님께 대화를 신청했어요!</div>
                            <div className="chat_box">
                                <div className="date">
                                    <span>2023년 05월 15일 월요일</span>
                                </div>
                                <ul className="chat_ul">
                                    <li className="send">
                                        <ul className="txt_ul">
                                            <li>
                                                <div className="box flex_bottom">
                                                    <p className="time"><span>읽음</span>오후 2:32</p>
                                                    <div className="txt">안녕하세요~ 94년생 김사소 님 어떠세요? 성격도 좋으시고~ 직장인이십니다!</div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="box flex_bottom">
                                                    <p className="time"><span>읽음</span>오후 2:32</p>
                                                    <div className="txt">숨 막힐 듯한 밤이 밀려와 (싫어 이 어둠이)난 발버둥 쳐 힘을 잃어가 (니가 없인)고통만 남은 감각 죽어가는 heart망각의 미로 속에 길을 잃은 night 제발 날 잊은 채 버려두지 마요 애원해 save me (save me) I'm twisted (twisted) 아득해끝도 없는 나의 falling (falling), deeper (deeper)</div>
                                                </div>
                                            </li>
                                            <li>
                                                <ul className="img_ul flex_wrap">
                                                    <li onClick={()=>{dispatch(imgPop(true))}}>
                                                        <img src={sampleImg} alt="이미지" />
                                                    </li>
                                                    <li>
                                                        <img src={sampleImg} alt="이미지" />
                                                    </li>
                                                    <li>
                                                        <img src={sampleImg} alt="이미지" />
                                                    </li>
                                                </ul>
                                                <div className="box flex_bottom">
                                                    <p className="time"><span>읽음</span>오후 2:32</p>
                                                    <div className="txt">소개받으면 잘맞으실 거예요~ 😀</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <p className="name">윤지후</p>
                                        <ul className="txt_ul">
                                            <li>
                                                <div className="box flex_bottom">
                                                    <div className="txt">이분 마음에 들어요~ 소개해주세요!</div>
                                                    <p className="time">오후 2:32</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="box flex_bottom">
                                                    <div className="txt">사진 보내 주실 수 있나요?</div>
                                                    <p className="time">오후 2:34</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <p className="name">윤지후</p>
                                        <ul className="txt_ul">
                                            <li>
                                                <div className="box flex_bottom">
                                                    <div className="txt">이분 마음에 들어요~ 소개해주세요!</div>
                                                    <p className="time">오후 2:32</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="box flex_bottom">
                                                    <div className="txt">사진 보내 주실 수 있나요?</div>
                                                    <p className="time">오후 2:34</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <p className="name">윤지후</p>
                                        <ul className="txt_ul">
                                            <li>
                                                <div className="box flex_bottom">
                                                    <div className="txt">이분 마음에 들어요~ 소개해주세요!</div>
                                                    <p className="time">오후 2:32</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="box flex_bottom">
                                                    <div className="txt">사진 보내 주실 수 있나요?</div>
                                                    <p className="time">오후 2:34</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 대화내용이 없을때 */}
                        {/* <div className="none_box">
                            <img src={noneChatImg} alt="아이콘" />
                            <p>대화 내용이 없습니다. 메시지를 전송하세요.</p>
                        </div> */}

                        {/* 선택한 대화방이 없을때 */}
                        {/* <div className="none_box">
                            <img src={noneSelectImg} alt="아이콘" />
                            <p>선택한 대화방이 없습니다. <br/>대화방을 선택해주세요.</p>
                        </div> */}

                        {/* 설정 완료전 일때 */}
                        {/* <div className="none_box">
                            <img src={noneSetImg} alt="아이콘" />
                            <p>설정이 완료된 후, <br/>채팅 관리자를 이용하실 수 있습니다.</p>
                        </div> */}

                        {/* 대화내용 열람못할때 */}
                        {/* <div className="none_box">
                            <img src={noneReadingImg} alt="아이콘" />
                            <p>연결한 대화방의 대화 내용을 <br/>열람할 수 없습니다.</p>
                        </div> */}

                    </div>
                </div>
                <MessageInputWrap />
            </div>
        </div>
    );
};

export default RightCont;