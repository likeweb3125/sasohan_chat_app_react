import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { msgImgs, msgSend } from "../../store/commonSlice";
import { confirmPop } from "../../store/popupSlice";
import ConfirmPop from "../popup/ConfirmPop";
import ic_plus from "../../images/ic_plus.svg";


const MessageInputWrap = (props) => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const user = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const msg_img_add = enum_api_uri.msg_img_add;
    const g_msg_img_add = enum_api_uri.g_msg_img_add;
    const [uploadOn, setUploadOn] = useState(false);
    const [imgNameList, setImgNameList] = useState([]);
    const textareaRef = useRef(null);
    const [confirm, setConfirm] = useState(false);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //메시지 textarea 높이조정
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // 초기화
            textarea.style.height = `${textarea.scrollHeight}px`; // 높이 조정
        }
    }, [props.textareaValue]);


    //이미지 첨부-----------------------------------------
    //이미지첨부 리스트 store에 저장
    useEffect(()=>{
        setImgNameList(imgNameList);
        dispatch(msgImgs([...imgNameList]));
    },[imgNameList]);


    //채팅메시지 전송시 이미지첨부리스트 값 비우기
    useEffect(()=>{
        if(common.msgSend){
            setImgNameList([]);
            setUploadOn(false);
            dispatch(msgSend(false));
        }
    },[common.msgSend]);


    // 이미지 등록
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        multiple: true, // 여러 개의 파일 선택 가능하도록 설정
        onDrop: acceptedFiles => {
            const files = acceptedFiles.length + imgNameList.length;

            if(acceptedFiles.length === 0){
                return;
            }else if(files > 9){
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'이미지는 최대 9개까지 첨부 가능합니다.',
                    confirmPopBtn:1,
                }));
                setConfirm(true);
            }else{
                const formData = new FormData();
                acceptedFiles.forEach((item)=>{
                    formData.append("media", item);
                });
                
                axios.post(`${props.group ? g_msg_img_add : msg_img_add}`, formData, {
                    headers: {
                        Authorization: `Bearer ${user.tokenValue}`,
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    if (res.status === 201) {
                        const mediaUrls = res.data.mediaUrls;
                        const newList = [...imgNameList, ...mediaUrls];
                        setImgNameList(newList);
                    }
                })
                .catch((error) => {
                    const err_msg = CF.errorMsgHandler(error);
                    if(error.response.status === 401){//토큰에러시 에러팝업
                        dispatch(confirmPop({
                            confirmPop:true,
                            confirmPopTit:'알림',
                            confirmPopTxt:'세션이 종료되었습니다.<br/> 현재창을 닫고 다시 로그인해주세요.',
                        }));
                        setConfirm(true);
                    }else{
                        dispatch(confirmPop({
                            confirmPop:true,
                            confirmPopTit:'알림',
                            confirmPopTxt: err_msg,
                            confirmPopBtn:1,
                        }));
                        setConfirm(true);
                    }
                });
            }
        }
    });
   

    //이미지 삭제
    const handleRemove = (idx) => {
        let newNameList = [...imgNameList];
            newNameList.splice(idx,1);
        setImgNameList(newNameList);
    };

    
    // 썸네일 미리보기 생성
    const thumbs = imgNameList.map((url,i) => (
        <li key={i}>
            <img
                src={url}
                alt="이미지"
            />
            <button className="btn_delt" onClick={() => handleRemove(i)}>삭제버튼</button> {/* 삭제 버튼 추가 */}
        </li>
    ));

    //이미지 첨부-----------------------------------------


    return(<>
        <div className="message_input_wrap">
            <div className={`upload_box${uploadOn ? " on" : ""}`}>
                <div className="flex_between">
                    <p className="tit">이미지 첨부</p>
                    <button type="button" className="btn_close" onClick={()=>{setUploadOn(false)}}>닫기버튼</button>
                </div>
                <div className="drop_box">
                    {thumbs && thumbs.length === 0 &&
                        <div {...getRootProps({className: 'dropzone'})}>
                            <input {...getInputProps()} />
                        </div>
                    }
                    <ul className={`flex_wrap${thumbs.length > 0 ? " w_fit" : ""}`}>
                        {thumbs}
                        {thumbs && thumbs.length < 9 &&
                            <li className={`drop_li${imgNameList && imgNameList.length > 0 ? "" : " w_100"}`}>
                                <div {...getRootProps({className: 'dropzone'})}>
                                    <input {...getInputProps()} />
                                    {imgNameList && imgNameList.length > 0 ?
                                        <div className="add_box"></div>
                                        :   <div className="txt_box tx_c">
                                                <div className="txt1">이미지 첨부</div>
                                                <p className="txt2">이미지를 드래그 앤 드롭하여 첨부하세요!<span>파일 업로드는 jpg, jpeg, png, gif 형식만 첨부 가능</span></p>
                                            </div>
                                    }
                                </div>
                            </li>
                        }
                    </ul>
                </div>
                {thumbs && thumbs.length > 0 && <p className="f_14 flex_center tm5">이미지를 <img src={ic_plus} alt="플러스아이콘" /> 아이콘이있는 박스를 클릭하거나 드래그 앤 드롭하여 첨부하세요!</p>}
            </div>
            <div className="input_box flex_between">
                <div className="box">
                    <div className="custom_text">
                        <textarea
                            ref={textareaRef}
                            value={props.textareaValue}
                            onChange={props.onTextareaChange}
                            placeholder="메시지를 입력해주세요"
                            rows={1}
                            onKeyDown={(e)=>{
                                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                                    e.preventDefault(); // Enter 키의 기본 동작(줄 바꿈)을 막음
                                    props.onMsgSendHandler(); // 엔터 키를 눌렀을 때 이벤트 핸들러 실행
                                }
                            }}
                        />
                    </div>
                    <button type="button" className={`btn_upload${uploadOn ? " on" : ""}`} onClick={()=>{setUploadOn(!uploadOn)}}>업로드버튼</button>
                </div>
                <button 
                    type="button" 
                    className={`btn_send${props.textareaValue || imgNameList.length > 0 ? " on" : ""}`} 
                    disabled={props.textareaValue || imgNameList.length > 0 ? false : true} 
                    onClick={props.onMsgSendHandler}
                >전송버튼</button>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default MessageInputWrap;