import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { managerProfilePop, confirmPop } from "../../store/popupSlice";
import { managerInfo } from "../../store/userSlice";
import ConfirmPop from "./ConfirmPop";


const ManagerProfilePop = () => {
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const m_profile = enum_api_uri.m_profile;
    const m_img_add = enum_api_uri.m_img_add;
    const m_img_delt = enum_api_uri.m_img_delt;
    const m_pro_modify = enum_api_uri.m_pro_modify;
    const m_info = enum_api_uri.m_info;
    const dispatch = useDispatch();
    const [nickName, setNickName] = useState("");
    const [imgList, setImgList] = useState([1,2,3,4,5,6,7,8]);
    const [imgSrcList, setImgSrcList] = useState(["","","","","","","",""]);
    const [confirm, setConfirm] = useState(false);
    const [modifyConfirm, setModifyConfirm] = useState(false);
    const [modifyOkConfirm, setModifyOkConfirm] = useState(false);
    const [deltImgList, setDeltImgList] = useState([]);


    //팝업닫기
    const closePopHandler = () => {
        dispatch(managerProfilePop(false));
    };

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setModifyConfirm(false);
            setModifyOkConfirm(false);
        }
    },[popup.confirmPop]);


    // 맨처음 매니저프로필정보 가져오기
    useEffect(()=>{
        axios.get(`${m_profile}`,
            {headers:{Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                let name = "";
                if(data.m_n_name){
                    name = data.m_n_name;
                }
                setNickName(name);

                const photoList = data.photo;
                setImgSrcList([...photoList]);
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
    },[]);

    //이미지 등록
    const imgUpHandler = (postData, idx) => {
        const formData = new FormData();
        formData.append("media", postData.target.files[0]);
        axios.post(`${m_img_add}`, formData, {
            headers: {
                Authorization: `Bearer ${user.tokenValue}`,
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            if (res.status === 201) {
                let newList = [...imgSrcList];
                newList[idx] = res.data.mediaUrls[0];
                setImgSrcList(newList);
            }else{
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt: "",
                    confirmPopBtn:1,
                }));
                setConfirm(true);
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
    };

    //이미지 삭제
    const imgDeltHandler = (idx, img) => {
        let newList = [...imgSrcList];
            newList[idx] = "";
        setImgSrcList(newList);

        const imgName = img.split('/').pop() || '';
        const newDeltImgList = [...deltImgList];
        newDeltImgList.push(imgName);
        setDeltImgList(newDeltImgList);
    };


    //프로필 수정하기 버튼클릭시
    const modifyBtnHandler = () => {
        const noneImg = imgSrcList.every((value) => value === ""); 
        if(nickName.length == 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임을 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(noneImg){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'프로필에 최소 1개의 사진을 등록해주세요.',
                confirmPopBtn:1,
            }));
        }else{
            setModifyConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'프로필을 수정하시겠습니까?',
                confirmPopBtn:2,
            }));
        }
    };


    //프로필 수정진행 -> 삭제할이미지 있으면 삭제후 프로필수정
    const modifyHandler = () => {
        if(deltImgList.length > 0){
            // 삭제할 이미지가 있는 경우 각 이미지를 순회하며 삭제
            deltImgList.forEach((imageName, index) => {
                profileImgDelt(imageName, index === deltImgList.length - 1); // 각 이미지를 삭제하는 함수 호출
            });
        }else{
            profileEdit();
        }
    };


    //프로필 이미지 삭제하기
    const profileImgDelt = (imageName, isLast) => {
        axios.delete(m_img_delt.replace(':filename',imageName), {
            headers: {
                Authorization: `Bearer ${user.tokenValue}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                //마지막 이미지 삭제후
                if (isLast) {
                    // deltImgList 값 초기화
                    setDeltImgList([]);
                    // 프로필 수정 함수 호출
                    profileEdit();
                }
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

    //프로필 수정하기
    const profileEdit = () => {
        //프로필사진 배열정렬
        const compareFunction = (a, b) => {
            if (a === "") return 1;
            if (b === "") return -1;
            return imgSrcList.indexOf(a) - imgSrcList.indexOf(b);
        };
        const photo = imgSrcList.sort(compareFunction);

        let body = {
            m_n_name:nickName,
            photo:photo
        };
        axios.put(`${m_pro_modify}`, body, {
            headers: {
                Authorization: `Bearer ${user.tokenValue}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                //매니저정보 가져오기
                axios.get(`${m_info}`,
                    {headers:{Authorization: `Bearer ${user.tokenValue}`}}
                )
                .then((res)=>{
                    if(res.status === 200){
                        //store에 매니저정보 저장
                        dispatch(managerInfo({...res.data}));

                        setModifyOkConfirm(true);
                        dispatch(confirmPop({
                            confirmPop:true,
                            confirmPopTit:'알림',
                            confirmPopTxt:'프로필수정이 완료되었습니다.',
                            confirmPopBtn:1,
                        }));
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
    };

    //프로필수정 완료 confirm팝업 확인클릭시
    const proModifyOkHandler = () => {
        closePopHandler();
        setModifyOkConfirm(false);
    };

    return(<>
        <div className="pop_wrap manager_pro_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont" style={{left:popup.managerProfilePopPosition}}>
                <div className="pop_tit flex_between">
                    <p className="f_24"><strong>매니저 프로필 {popup.memCheckPopTit}</strong></p>
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="flex_between">
                    <p>닉네임</p>
                    <div className="custom_input custom_input2 w_80">
                        <input type={"text"} value={nickName} onChange={(e)=>{setNickName(e.currentTarget.value)}} />
                    </div>
                </div>
                <div className="tm16">
                    <div className="flex_between bm8">
                        <p>프로필 사진</p>
                        <p className="f_13 f_gray">이미지 최소 크기 : 436 x 560</p>
                    </div>
                    <ul className="profile_img_ul flex_wrap bp8">
                        {imgList.map((img,i)=>{
                            return(
                                <li key={`imgUp${i}`}>
                                    <div className={`img${imgSrcList[i] ? " on" : ""}`}>
                                        {imgSrcList[i] && <img src={imgSrcList[i]} alt="프로필이미지"/>}
                                    </div>
                                    <div className="img_up">
                                        <input type="file" className="blind" id={`pic${i}`} accept="image/*" onChange={(e) => {
                                            imgUpHandler(e, i);
                                            e.currentTarget.value = '';
                                        }}/>
                                        <label htmlFor={`pic${i}`}>이미지등록</label>
                                    </div>
                                    <button type="button" className="btn_delt" onClick={()=>{imgDeltHandler(i, imgSrcList[i])}}>삭제버튼</button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <button type="button" className="btn" onClick={modifyBtnHandler}>수정</button>
            </div>
        </div>

        {/* 프로필수정 confirm팝업 */}
        {modifyConfirm && <ConfirmPop onClickHandler={modifyHandler} />}

        {/* 프로필수정 완료 confirm팝업 */}
        {modifyOkConfirm && <ConfirmPop closePop="custom" onCloseHandler={proModifyOkHandler} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ManagerProfilePop;