import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { enum_api_uri } from "../config/enum";
import { isLogin, managerInfo, managerSetting, tokenValue } from "../store/userSlice";
import { confirmPop } from "../store/popupSlice";
import * as CF from "../config/function";
import ConfirmPop from "../components/popup/ConfirmPop";


const Login = () => {
    const location = useLocation();
    const { m_id } = useParams();
    const navigate = useNavigate();
    const m_login = enum_api_uri.m_login;
    const m_info = enum_api_uri.m_info;
    const m_setting = enum_api_uri.m_setting;
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [confirm, setConfirm] = useState(false);

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //로그인하고 페이지 이동
    useEffect(()=>{
        let body = {};
        axios.post(`${m_login.replace(":m_id",m_id)}`,body)
        .then((res)=>{
            if(res.status === 200){
                let token = res.data.accessToken;

                //store에 로그인 저장
                dispatch(isLogin(true));

                //store에 토큰 저장
                dispatch(tokenValue(token));

                // 로그인한 매니저정보 가져오기
                axios.get(`${m_info}`,
                    {headers:{Authorization: `Bearer ${token}`}}
                )
                .then((res)=>{
                    if(res.status === 200){
                        //store에 매니저정보 저장
                        dispatch(managerInfo({...res.data}));

                        // 로그인한 매니저설정정보 가져오기
                        axios.get(`${m_setting}`,
                            {headers:{Authorization: `Bearer ${token}`}}
                        )
                        .then((res)=>{
                            if(res.status === 200){
                                let data = res.data;

                                //단체메시지 설정 안되어있을때 설정페이지로 이동
                                if(data == null){
                                    navigate("/setting");
                                    //store에 매니저설정정보 저장
                                    dispatch(managerSetting({m_id:m_id,set_num:0,set_range:""}));
                                }else{
                                    //store에 매니저설정정보 저장
                                    dispatch(managerSetting({...data}));
                                    
                                    //단체메시지 설정 안되어있을때 설정페이지로 이동
                                    if(data.set_num == 0 || data.set_range.length == 0){
                                        navigate("/setting");
                                    }
                                    //설정 되어있으면 메인페이지로 이동
                                    else{
                                        navigate("/");
                                    }
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
    },[location.pathname]);

    return(<>
        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Login;