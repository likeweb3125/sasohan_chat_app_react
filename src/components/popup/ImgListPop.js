import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { enum_api_uri } from "../../config/enum";
import { imgPop, imgListPop, confirmPop } from "../../store/popupSlice";
import * as CF from "../../config/function";
import ConfirmPop from "./ConfirmPop";
import sampleImg from "../../images/sample/img_sample.jpg";

const ImgListPop = (props) => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const msg_img_list = enum_api_uri.msg_img_list;
    const msg_img_list_admin = enum_api_uri.msg_img_list_admin;
    const api_uri = enum_api_uri.api_uri;
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const [confirm, setConfirm] = useState(false);
    const [imgList, setImgList] = useState([]);

    //팝업닫기
    const closePopHandler = () => {
        dispatch(imgListPop({imgListPop:false,imgListPopAdmin:false}));
    };

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);

    //채팅방 모든이미지 가져오기
    const getImgList = () => {
        axios.get(`${msg_img_list.replace(":room_id", common.selectUser.room_id)}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setImgList([...data.image_list]);
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

    //채팅방 모든이미지 가져오기 - 연결한대화방일때 (연결된 회원끼리 대화방)
    const getImgListAdmin = () => {
        axios.get(`${msg_img_list_admin.replace(":room_id", common.selectUser.room_id)}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setImgList([...data.image_list]);
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

    useEffect(()=>{
        if(popup.imgListPopAdmin){
            getImgListAdmin();
        }else{
            getImgList();
        }
    },[]);
    

    return(<>
        <div className="pop_wrap img_list_pop">
            <div className="dim"></div>
            <div className="pop_cont pop_cont2">
                <div className="inner">
                    <div className="pop_tit flex_between">
                        <p className="f_24"><strong>사진 모아보기</strong></p>
                        <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                    </div>
                    <div className="scroll_wrap">
                        <ul className="flex_wrap">
                            {imgList && imgList.map((img,i)=>{
                                let src = api_uri + img;
                                return(
                                    <li key={i}
                                        onClick={()=>{
                                            closePopHandler();
                                            dispatch(imgPop({imgPop:true,imgPopList:[...imgList],imgPopIdx:i}));
                                        }}
                                    >
                                        <img src={src} alt="이미지" />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ImgListPop;