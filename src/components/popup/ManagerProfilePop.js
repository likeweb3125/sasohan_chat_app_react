import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { managerProfilePop, confirmPop } from "../../store/popupSlice";
import { managerInfo } from "../../store/userSlice";
import ConfirmPop from "./ConfirmPop";

const ManagerProfilePop = (props) => {
    const popup = useSelector((state)=>state.popup);
    const m_profile = enum_api_uri.m_profile;
    const m_img_add = enum_api_uri.m_img_add;
    const m_pro_modify = enum_api_uri.m_pro_modify;
    const m_info = enum_api_uri.m_info;
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const [nickName, setNickName] = useState("");
    const [imgList, setImgList] = useState([1,2,3,4,5,6,7,8]);
    const [imgSrcList, setImgSrcList] = useState(["","","","","","","",""]);
    const [imgNameList, setImgNameList] = useState(["","","","","","","",""]);
    const [photoPath, setPhotoPath] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [modifyConfirm, setModifyConfirm] = useState(false);
    const [modifyOkConfirm, setModifyOkConfirm] = useState(false);

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
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                let path = data.photo_path;
                setNickName(data.m_n_name);
                // setPhotoPath(path);

                const photoList = data.photo;
                const nameList = photoList.map(value => {
                    return value ? value.replace(path,"") : value;
                });
                setImgSrcList([...photoList]);
                setImgNameList([...nameList]);
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
    },[]);

    //이미지 등록
    const imgUpHandler = (fileBlob, postData, idx) => {
        const formData = new FormData();
        formData.append("media", postData.target.files[0]);
        axios.post(`${m_img_add}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            if (res.status === 201) {
                console.log(res.data)
                let imgName = res.data.mediaUrls;
                let newList = [...imgNameList];
                    newList[idx] = imgName;
                setImgNameList(newList);
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
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: err_msg,
                confirmPopBtn:1,
            }));
            setConfirm(true);
        });
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        return new Promise((resolve) => {
          reader.onload = () => {
            let newList = [...imgSrcList];
                newList[idx] = reader.result
            setImgSrcList(newList);
            resolve();
          };
        });
    };

    //이미지 삭제
    const imgDeltHandler = (idx) => {
        let newList = [...imgSrcList];
            newList[idx] = "";
        setImgSrcList(newList);

        let newNameList = [...imgNameList];
            newNameList[idx] = "";
        setImgNameList(newNameList);
    };

    //프로필 수정하기 버튼클릭시
    const modifyBtnHandler = () => {
        const noneImg = imgNameList.every((value) => value === ""); 
        if(noneImg){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'프로필에 최소 1개의 사진을 등록해주세요.',
                confirmPopBtn:1,
            }));
        }else if(nickName.length == 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임을 입력해주세요.',
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

    //프로필 수정하기
    const modifyHandler = () => {
        //프로필사진 배열정렬
        const compareFunction = (a, b) => {
            if (a === "") return 1;
            if (b === "") return -1;
            return imgNameList.indexOf(a) - imgNameList.indexOf(b);
        };
        const imgList = imgNameList.sort(compareFunction);

        let body = {
            m_n_name:nickName,
            photo:imgList
        };
        axios.put(`${m_pro_modify}`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res)=>{
            if(res.status === 200){
                //매니저정보 가져오기
                axios.get(`${m_info}`,
                    {headers:{Authorization: `Bearer ${token}`}}
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
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt: err_msg,
                        confirmPopBtn:1,
                    }));
                    setConfirm(true);
                });
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
                                            imgUpHandler(e.currentTarget.files[0], e, i);
                                            e.currentTarget.value = '';
                                        }}/>
                                        <label htmlFor={`pic${i}`}>이미지등록</label>
                                    </div>
                                    <button type="button" className="btn_delt" onClick={()=>{imgDeltHandler(i)}}>삭제버튼</button>
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