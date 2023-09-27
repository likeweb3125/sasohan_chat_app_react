import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { memPop, memInfoPop, confirmPop } from "../../store/popupSlice";
import ConfirmPop from "./ConfirmPop";

const MemberPop = () => {
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const u_info = enum_api_uri.u_info;
    const [confirm, setConfirm] = useState(false);
    const [info, setInfo] = useState({});

    //팝업닫기
    const closePopHandler = () => {
        dispatch(memPop({memPop:false,memPopId:""}));
    };

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);

    //회원정보 가져오기
    const getInfo = () => {
        axios.get(`${u_info.replace(":m_id",popup.memPopId)}`,
            {headers:{Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setInfo({...data});
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
        getInfo();
    },[]);


    //회원정보보기 버튼클릭시
    const detailInfo = () => {
        // 앱가입 회원이면 회원프로필팝업
        if(info.m_app == "Y"){
            dispatch(memInfoPop(true));
        }
        // 기존회원이면 기존사소한관리자 회원정보페이지 새창띄우기
        else{
            const mnum = info.mnum;
            const m_id = info.m_id;
            const url = `http://jja-gg.com/admin/member/member0.asp?mnum=${mnum}&id=${m_id}`;
            window.open(url, "_blank");
        }
    };


    return(<>
        <div className="pop_wrap mem_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont" style={{top:popup.memPopPosition[0],left:popup.memPopPosition[1]}}>
                <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                <div className="member_box">
                    <div className="box">
                        <div className="flex">
                            <p className={`name${info.m_gender == "2" ? " mem_w" : ""}`}>{info.m_name}</p>
                            <p className="age">{info.m_address}<span>&nbsp;·&nbsp;{info.birth}</span></p>
                        </div>
                    </div>
                </div>
                <ul className="txt_ul">
                    <li className="flex_between">
                        <p>가입날짜</p>
                        <p>{info.join_date}</p>
                    </li>
                    <li className="flex_between">
                        <p>소개횟수</p>
                        <p>{CF.MakeIntComma(info.introduce_num)}회</p>
                    </li>
                    <li className="flex_between">
                        <p>마지막 소개일</p>
                        <p>{info.last_introduce_date}</p>
                    </li>
                </ul>
                <button type="button" className="btn" onClick={detailInfo}>회원 정보 보기</button>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default MemberPop;