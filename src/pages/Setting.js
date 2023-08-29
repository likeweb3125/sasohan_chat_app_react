import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import * as CF from "../config/function";
import { enum_api_uri } from "../config/enum";
import { managerSetting } from "../store/userSlice";
import { confirmPop, loadingPop } from "../store/popupSlice";
import LeftCont from "../components/layout/LeftCont";
import RightCont from "../components/layout/RightCont";
import ConfirmPop from "../components/popup/ConfirmPop";

const Setting = () => {
    const popup = useSelector((state)=>state.popup);
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const m_setting = enum_api_uri.m_setting;
    const m_limit = enum_api_uri.m_limit;
    const [confirm, setConfirm] = useState(false);
    const [saveConfirm, setSaveConfirm] = useState(false);
    const [saveOkConfirm, setSaveOkConfirm] = useState(false);
    const [settingNum, setSettingNum] = useState();
    const [settingRange, setSettingRange] = useState();
    const [memList, setMemList] = useState([]);

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setSaveConfirm(false);
            setSaveOkConfirm(false);
        }
    },[popup.confirmPop]);

    //매니저 설정정보 가져오기
    useEffect(()=>{
        dispatch(loadingPop(true));

        axios.get(`${m_setting}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                setSettingNum(res.data.set_num);
                setSettingRange(res.data.set_range);
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));

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

    //설정 저장버튼 클릭시
    const saveBtnHandler = () => {
        if(!settingNum){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'최대 전체선택 인원수를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!settingRange){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'할당된 회원 번호를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else{
            setSaveConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'설정을 저장하시겠습니까?',
                confirmPopBtn:2,
            }));
        }
    };

    //설정 저장하기
    const saveHandler = () => {
        dispatch(loadingPop(true));

        let body = {
            set_num: settingNum,
            set_range: settingRange
        };

        axios.post(`${m_limit}`,body,
            {headers: {Authorization: `Bearer ${token}`}}
        )
        .then((res) => {
            if (res.status === 200) {
                dispatch(loadingPop(false));

                setSaveOkConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'설정을 저장했습니다!',
                    confirmPopBtn:1,
                }));

                //store에 변경된 설정 저장
                let updatedSetting = {...popup.managerSetting};
                updatedSetting.set_num = settingNum;
                updatedSetting.set_range = settingRange;
                dispatch(managerSetting(updatedSetting));
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));
            
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

    //설정저장 완료 confirm팝업 확인클릭시
    const saveOkHandler = () => {
        setSaveOkConfirm(false);
    };


    return(<>
        <LeftCont
            page="setting"
            selectedNum={settingNum}
            selectedRange={settingRange}
            onSelNumChange={(e)=>{setSettingNum(e.currentTarget.value)}}
            onSelRangeChange={(e)=>{setSettingRange(e.currentTarget.value)}}
            onSaveHandler={saveBtnHandler}
        />
        <RightCont
            floatList={memList}
        />

        {/* 설정저장 confirm팝업 */}
        {saveConfirm && <ConfirmPop onClickHandler={saveHandler} />}

        {/* 프로필수정 완료 confirm팝업 */}
        {saveOkConfirm && <ConfirmPop closePop="custom" onCloseHandler={saveOkHandler} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default Setting;