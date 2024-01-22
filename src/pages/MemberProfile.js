import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { NumericFormat, PatternFormat } from "react-number-format";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import * as CF from "../config/function";
import { enum_api_uri } from "../config/enum";
import { memInfoPop, confirmPop } from "../store/popupSlice";
import SelectBox from "../components/component/SelectBox";
import InputDatepicker from "../components//component/InputDatePicker";
import ConfirmPop from "../components/popup/ConfirmPop";

const MemberProfile = (props) => {
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const api_uri = enum_api_uri.api_uri;
    const u_profile = enum_api_uri.u_profile;
    const u_address = enum_api_uri.u_address;
    const u_address2 = enum_api_uri.u_address2;
    const u_select_list = enum_api_uri.u_select_list;
    const u_img_add = enum_api_uri.u_img_add;
    const u_nick_check = enum_api_uri.u_nick_check;
    const u_pro_modify = enum_api_uri.u_pro_modify;
    const [imgList, setImgList] = useState([1,2,3,4,5,6,7,8]);
    const [imgSrcList, setImgSrcList] = useState(["","","","","","","",""]);
    const [imgNameList, setImgNameList] = useState(["","","","","","","",""]);
    const [photoPath, setPhotoPath] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [modifyConfirm, setModifyConfirm] = useState(false);
    const [modifyOkConfirm, setModifyOkConfirm] = useState(false);
    const [info, setInfo] = useState({});
    const [addressList, setAddressList] = useState([]);
    const [addressList2, setAddressList2] = useState([]);
    const [loca, setLoca] = useState({});
    const [loca2, setLoca2] = useState({});
    const [heightList, setHeightList] = useState([{txt:"149cm 이하",val:"149"},{txt:"150cm ~ 154cm",val:"150"},{txt:"155cm ~ 159cm",val:"155"},{txt:"160cm ~ 164cm",val:"160"},{txt:"165cm ~ 169cm",val:"165"},{txt:"170cm ~ 174cm",val:"170"},{txt:"175cm ~ 179cm",val:"175"},{txt:"180cm ~ 184cm",val:"180"},{txt:"185cm ~ 189cm",val:"185"},{txt:"190cm ~ 194cm",val:"190"},{txt:"195cm ~ 200cm",val:"195"}]);
    const [visualList, setVisualList] = useState(["1","2","3","4","5","6","7","8","9","10"]);
    const [mbtiList, setMbtiList] = useState(["ISTP","ISTJ","ISFP","ISFJ","INTP","INTJ","INFP","INFJ","ESTP","ESTJ","ESFP","ESFJ","ENTP","ENTJ","ENFP","ENFJ"]);
    const [jobList, setJobList] = useState([]);
    const [typeList, setTypeList] = useState([]);
    const [religionList, setReligionList] = useState([]);
    const [likeList, setLikeList] = useState([]);
    const [dateList, setDateList] = useState([]);
    const [routeList, setRouteList] = useState([]);
    const [type, setType] = useState([]);
    const [type2, setType2] = useState([]);
    const [like, setLike] = useState([]);
    const [date, setDate] = useState([]);
    const [usableNickName, setUsableNickName] = useState(true);
    const [errorType, setErrorType] = useState(false);
    const [errorLike, setErrorLike] = useState(false);
    const [errorDate, setErrorDate] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [hasRunOnce, setHasRunOnce] = useState(false);
    const { m_id } = useParams();


    //현재창 닫기
    const closePopHandler = () => {
        window.close();
    };


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setModifyConfirm(false);
            setModifyOkConfirm(false);
        }
    },[popup.confirmPop]);


    //회원프로필정보 가져오기
    const getInfo = () => {
        axios.get(`${u_profile.replace(":m_id",m_id)}`,
            {headers:{Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setInfo({...data});

                let path = data.file_path;
                setPhotoPath(path);

                const photoList = data.m_photo;
                const nameList = photoList.map(value => {
                    return value ? value.replace(path,"") : value;
                });
                setImgSrcList([...photoList]);
                setImgNameList([...nameList]);
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


    //주소 시,도 가져오기
    const getAddress = () => {
        axios.get(`${u_address}`,
            {headers:{Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setAddressList([...data]);

                let addr = info.m_address_full.split(" ");
                let checkLoca = data.filter((el) => el.sido_gugun === addr[0]);
                setLoca(...checkLoca);
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


    //주소 구,군 가져오기
    const getAddress2 = (txt) => {
        let address = addressList.filter(addr => addr.sido_gugun === txt);
        axios.get(`${u_address2.replace(':parent_local_code',address[0].local_code)}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setAddressList2([...data]);

                let addr = info.m_address_full.split(" ");
                let checkLoca2 = data.filter((el) => el.sido_gugun === addr[1]);
                setLoca2(...checkLoca2);
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


    useEffect(()=>{
        //맨처음 주소 시,도 있으면 구,군 가져오기
        if(loca && loca.hasOwnProperty('sido_gugun') && !hasRunOnce){
            getAddress2(loca.sido_gugun);
            setHasRunOnce(true);
        }
    },[loca]);


    //맨처음 회원프로필정보 가져오기
    useEffect(() => {
        getInfo();
    }, []);


    //회원정보값이 바뀌면 주소 시,도 && 직업, 타입, 관심사, 데이트, 가입경로, 종교 리스트 가져오기
    useEffect(()=>{
        if(Object.keys(info).length > 0){
            getAddress();
            getSelectList();
        }
    },[info]);


    //주소 시,도 변경할때
    const sidoChange = (txt) => {
        let address = addressList.filter(addr => addr.sido_gugun === txt);
        axios.get(`${u_address2.replace(':parent_local_code',address[0].local_code)}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setAddressList2([...data]);

                setLoca(...address);
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


    //주소 구,군 변경할때
    const gugunChange = (txt) => {
        let checkLoca2 = addressList2.filter((addr) => addr.sido_gugun === txt);
        setLoca2(...checkLoca2);
    };
    

    //직업, 타입, 관심사, 데이트, 가입경로, 종교 리스트 가져오기
    const getSelectList = () => {
        axios.get(`${u_select_list}`)
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                setJobList([...data.job]);
                setTypeList([...data.character]);
                setReligionList([...data.religion]);
                setLikeList([...data.interest]);
                setDateList([...data.i_date]);
                setRouteList([...data.ref_rul]);

                let typeArr = info.m_character;
                setType([...typeArr]);

                let likeArr = info.m_like;
                setLike([...likeArr]);

                let dateArr = info.m_date;
                setDate([...dateArr]);

                let typeArr2 = info.t_character;
                setType2([...typeArr2]);
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
        })
    };


    //이미지 등록
    const imgUpHandler = (fileBlob, postData, idx) => {
        const formData = new FormData();
        formData.append("media", postData.target.files[0]);
        axios.post(`${u_img_add}`, formData, {
            headers: {
                Authorization: `Bearer ${user.tokenValue}`,
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            if (res.status === 201) {
                console.log(res.data)
                const updatedMediaUrls = res.data.mediaUrls.map(url => {
                    let updatedUrl = url.replace(api_uri, "");
                    updatedUrl = updatedUrl.replace(photoPath, "");
                    return updatedUrl;
                });
                  
                const newList = [...imgNameList, ...updatedMediaUrls];
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


    //본인타입 체크박스
    const typeCheck = (event, checked, value) => {
        if (checked) {
            if(type.length > 2){
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'최대 3개까지 선택가능합니다.',
                    confirmPopBtn:1,
                }));
                setType(type.filter((el) => el !== value));
                // event.target.checked = false;
            }else{
                setType([...type, value]);
            }
        } else if (!checked && type.includes(value)) {
            setType(type.filter((el) => el !== value));
        }
    }
    


    //상대방타입 체크박스
    const typeCheck2 = (event, checked, value) => {
        if (checked) {
            if(type2.length > 2){
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'최대 3개까지 선택가능합니다.',
                    confirmPopBtn:1,
                }));
                setType2(type2.filter((el) => el !== value));
                // event.target.checked = false;
            }else{
                setType2([...type2, value]);
            }
        } else if (!checked && type2.includes(value)) {
            setType2(type2.filter((el) => el !== value));
        }
    }


    //내관심사 체크박스
    const likeCheck = (event, checked, value) => {
        if (checked) {
            if(like.length > 2){
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'최대 3개까지 선택가능합니다.',
                    confirmPopBtn:1,
                }));
                setLike(like.filter((el) => el !== value));
                // event.target.checked = false;
            }else{
                setLike([...like, value]);
            }
        } else if (!checked && like.includes(value)) {
            setLike(like.filter((el) => el !== value));
        }
        
    }


    //선호하는데이트 체크박스
    const dateCheck = (event, checked, value) => {
        if (checked) {
            if(date.length > 2){
                setConfirm(true);
                dispatch(confirmPop({
                    confirmPop:true,
                    confirmPopTit:'알림',
                    confirmPopTxt:'최대 3개까지 선택가능합니다.',
                    confirmPopBtn:1,
                }));
                setDate(date.filter((el) => el !== value));
                // event.target.checked = false;
            }else{
                setDate([...date, value]);
            }
        } else if (!checked && date.includes(value)) {
            setDate(date.filter((el) => el !== value));
        }
    }


    //닉네임 사용가능 확인
    const nickNameCheckHandler = (values) => {
        let nickName = values.n_name;
        if(nickName.length < 1){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임을 입력해주세요.',
                confirmPopBtn:1,
            }));
            setUsableNickName(false);
        }else{
            axios.get(`${u_nick_check}?m_n_name=${nickName}`,
                {headers:{Authorization: `Bearer ${user.tokenValue}`}}
            )
            .then((res)=>{
                if(res.status === 200){
                    setConfirm(true);
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'사용가능한 닉네임 입니다.',
                        confirmPopBtn:1,
                    }));
                    setUsableNickName(true);
                }
            })
            .catch((error) => {
                if(error.response.status === 401) {
                    setConfirm(true);
                    dispatch(confirmPop({
                        confirmPop:true,
                        confirmPopTit:'알림',
                        confirmPopTxt:'사용할 수 없는 닉네임 입니다.',
                        confirmPopBtn:1,
                    }));
                    setUsableNickName(false);
                }
            })
        }
    };


    //회원프로필정보 Yup 유효성검사
    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, '8자 이상 입력해주세요.')
            .max(12, '12자까지 입력해주세요.')
            .required("비밀번호를 입력해주세요.")
            .matches(/[0-9]/, '숫자를 포함하여 입력해주세요.')
            .matches(/[a-z]/, '영문을 포함하여 입력해주세요.'),
        name: Yup.string()
            .required("이름을 입력해주세요."),
        n_name: Yup.string()
            .required("닉네임을 입력해주세요."),
        gender: Yup.string()
            .required("성별을 선택해주세요."),
        birth: Yup.string()
            .required("생년월일을 입력해주세요.")
            .matches(/^\d{4}\.\d{2}\.\d{2}$/, "생년월일을 입력해주세요."),
        phone: Yup.string()
            .required("휴대폰번호를 입력해주세요.")
            .matches(/^\d{3}-\d{4}-\d{4}$/, "휴대폰번호를 입력해주세요."),
        height: Yup.string()
            .required("키를 선택해주세요."),
        job: Yup.string()
            .required("직업을 선택해주세요."),
        visual: Yup.string()
            .required("본인 외모점수를 선택해주세요."),
        mbti: Yup.string()
            .required("MBTI를 선택해주세요."),
        smok: Yup.string()
            .required("흡연여부를 선택해주세요."),
        drink: Yup.string()
            .required("음주여부를 선택해주세요."),
        religion: Yup.string()
            .required("종교여부를 선택해주세요."),
        route: Yup.string()
            .required("가입경로를 선택해주세요."),
        t_height: Yup.string()
            .required("상대방 키를 선택해주세요."),
        t_job: Yup.string()
            .required("상대방 직업을 선택해주세요."),
        t_visual: Yup.string()
            .required("상대방 외모점수를 선택해주세요."),
        t_mbti: Yup.string()
            .required("상대방 MBTI를 선택해주세요."),
        t_smok: Yup.string()
            .required("상대방 흡연여부를 선택해주세요."),
        t_drink: Yup.string()
            .required("상대방 음주여부를 선택해주세요."),
        t_religion: Yup.string()
            .required("상대방 종교여부를 선택해주세요."),
    });


    //프로필 수정하기 버튼클릭시 유효성검사 팝업띄우기
    const modifyCheckHandler = (values) => {
        setFormValues({...values});

        let address = "";
        if(Object.keys(loca).length > 0){
            address = loca.sido_gugun;
        }

        let pw = values.password;
        let num = values.password.search(/[0-9]/g);
        let eng = values.password.search(/[a-z]/ig);

        if(!pw){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(pw.length < 8 || pw.length > 13){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 8~12자 이내로 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(pw.search(/\s/) != -1){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 공뱁없이 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(num < 0 || eng < 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 영문,숫자를 포함하여 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.name){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'이름을 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.n_name){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임을 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.gender){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'성별을 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.birth || !/^\d{4}\.\d{2}\.\d{2}$/.test(values.birth)){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'생년월일을 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.phone || !/^\d{3}-\d{4}-\d{4}$/.test(values.phone)){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'휴대폰번호를 입력해주세요.',
                confirmPopBtn:1,
            }));
        }else if(address.length == 0){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'거주지를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.height){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'키를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.job){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'직업을 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.visual){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'본인 외모점수를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.mbti){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'MBTI를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!type){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'본인타입을 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.smok){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'흡연여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.drink){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'음주여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.religion){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'종교여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!like){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'내 관심사를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!date){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'선호하는 데이트를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.route){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'가입경로를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.t_height){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방 키를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.t_job){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방 직업을 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.t_visual){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방 외모점수를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.t_mbti){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방 MBTI를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.t_smok){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방 흡연여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.t_drink){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방 음주여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!values.t_religion){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'상대방 종교여부를 선택해주세요.',
                confirmPopBtn:1,
            }));
        }else if(!usableNickName){
            setConfirm(true);
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'닉네임 사용가능을 확인해주세요.',
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

        if(type.length > 0){
            setErrorType(false);
        }else{
            setErrorType(true);
        }

        if(like.length > 0){
            setErrorLike(false);
        }else{
            setErrorLike(true);
        }

        if(date.length > 0){
            setErrorDate(false);
        }else{
            setErrorDate(true);
        }
    };


    //프로필 수정하기
    const modifyHandler = () => {
        let values = formValues;

        //프로필사진 배열정렬
        const compareFunction = (a, b) => {
            if (a === "") return 1;
            if (b === "") return -1;
            return imgNameList.indexOf(a) - imgNameList.indexOf(b);
        };
        const imgList = imgNameList.sort(compareFunction);
        const updatedImgList = imgList.map(url => {
            let updatedUrl = url.replace("upload/profile/user/", "");
            return updatedUrl;
        });

        let gender = values.gender.replace("gender_","");

        let address = "";
        if(Object.keys(loca2).length > 0){
            address = loca.sido_gugun + " " + loca2.sido_gugun;
        }else{
            address = loca.sido_gugun;
        }

        let smok = values.smok.replace("smok_","");
        let drink = values.drink.replace("drink_","");
        let t_smok = values.t_smok.replace("t_smok_","");
        let t_drink = values.t_drink.replace("t_drink_","");

        let body = {
            m_photo:updatedImgList,
            m_id:info.m_id,
            m_password:values.password,
            m_name:values.name,
            m_n_name:values.n_name,
            m_gender:gender,
            m_birth:values.birth,
            m_c_phone:values.phone,
            m_address:address,
            m_height:values.height,
            m_job:values.job,
            m_visual:values.visual,
            m_mbti:values.mbti,
            m_character:type,
            m_smok:smok,
            m_drink:drink,
            m_religion:values.religion,
            m_like:like,
            m_date:date,
            m_motive:values.route,
            t_height:values.t_height,
            t_job:values.t_job,
            t_visual:values.t_visual,
            t_mbti:values.t_mbti,
            t_character:type2,
            t_smok:t_smok,
            t_drink:t_drink,
            t_religion:values.t_religion,
        };
        axios.put(`${u_pro_modify}`,body,
            {headers:{Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res)=>{
            if(res.status === 200){
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
        })
    };


    //프로필수정 완료 confirm팝업 확인클릭시
    const proModifyOkHandler = () => {
        closePopHandler();
        setModifyOkConfirm(false);
    };


    return(<>
        <div className="mem_profile_wrap">
            <div className="pop_wrap mem_info_pop"> 
                <div className="pop_cont pop_gray">
                    <div className="pop_tit flex_between">
                        <div>
                            <div className="flex">
                                <p className="f_24"><strong>회원 프로필</strong></p>
                                <p className="txt">사소한 채팅앱 회원</p>
                            </div>
                            <p className="txt2">※ 정보수정 시 저장 버튼을 눌러 변경된 정보를 꼭 저장해 주세요.</p>
                        </div>
                    </div>
                    {info && Object.keys(info).length > 0 &&
                        <Formik
                            initialValues={{
                                password: info.m_password || "",
                                name: info.m_name || "",
                                n_name: info.m_n_name || "",
                                gender: "gender_"+info.m_gender || "",
                                birth: info.m_birth || "",
                                phone: info.m_c_phone || "",
                                height: info.m_height || "",
                                job: info.m_job || "",
                                visual: info.m_visual || "",
                                mbti: info.m_mbti || "",
                                smok: "smok_"+info.m_smok || "",
                                drink: "drink_"+info.m_drink || "",
                                religion: info.m_religion || "",
                                route: info.m_motive || "",
                                //상대방
                                t_height: info.t_height || "",
                                t_job: info.t_job || "",
                                t_visual: info.t_visual || "",
                                t_mbti: info.t_mbti || "",
                                t_smok: "t_smok_"+info.t_smok || "",
                                t_drink: "t_drink_"+info.t_drink || "",
                                t_religion: info.t_religion || "",
                            }}
                            validationSchema={validationSchema}
                            // onSubmit={modifyHandler}
                        >
                            {({values, handleChange, handleBlur, errors, touched, setFieldValue}) => (
                                <form>
                                    <div className="scroll_wrap">
                                        <div className="line_round_box bm16">
                                            <p className="f_18 medium bp12">프로필 사진</p>
                                            <div className="scroll_wrap_x">
                                                <ul className="profile_img_ul flex">
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
                                        </div>
                                        <div className="line_round_box bm16">
                                            <p className="f_18 medium bp12">기본 정보</p>
                                            <div className="custom_table2 gray_table">
                                                <table>
                                                    <colgroup>
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th>가입일자</th>
                                                            <td>{info.m_join_date}</td>
                                                            <th>최근 접속일</th>
                                                            <td>{info.m_last_login}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>아이디</th>
                                                            <td>{info.m_id}</td>
                                                            <th>비밀번호</th>
                                                            <td>
                                                                <div className="custom_input custom_input2">
                                                                    <input type={"text"} value={values.password} name="password" onChange={handleChange} maxLength={12} onBlur={handleBlur} />
                                                                </div>
                                                                {errors.password && touched.password &&
                                                                    <div className="alert_txt">
                                                                        {errors.password} 
                                                                    </div>
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>이름</th>
                                                            <td>
                                                                <div className="custom_input custom_input2">
                                                                    <input type={"text"} value={values.name} name="name" onChange={handleChange} onBlur={handleBlur} />
                                                                </div>
                                                                {errors.name && touched.name &&
                                                                    <div className="alert_txt">
                                                                        {errors.name} 
                                                                    </div>
                                                                }
                                                            </td>
                                                            <th>닉네임</th>
                                                            <td>
                                                                <div className="btn_input_box">
                                                                    <div className="custom_input custom_input2">
                                                                        <input 
                                                                            type={"text"} 
                                                                            value={values.n_name} 
                                                                            name="n_name" 
                                                                            onChange={(e)=>{
                                                                                const val = e.currentTarget.value;
                                                                                handleChange(e);
                                                                                if(info.m_n_name !== val){
                                                                                    setUsableNickName(false);
                                                                                }else{
                                                                                    setUsableNickName(true);
                                                                                }
                                                                            }}
                                                                            onBlur={handleBlur} 
                                                                        />
                                                                    </div>
                                                                    <button type="button" disabled={usableNickName ? true : false} onClick={()=>{nickNameCheckHandler(values)}}>중복체크</button>
                                                                </div>
                                                                {errors.n_name && touched.n_name &&
                                                                    <div className="alert_txt">
                                                                        {errors.n_name} 
                                                                    </div>
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>성별</th>
                                                            <td>
                                                                <div className="flex">
                                                                    <div className="custom_radio rm50">
                                                                        <label htmlFor="gender_1">
                                                                            <input type={"radio"} id="gender_1" value="gender_1" name="gender" 
                                                                                onChange={(e)=>{
                                                                                    handleChange(e);
                                                                                    if(e.currentTarget.checked){
                                                                                        setFieldValue("gender",e.currentTarget.value);
                                                                                    }else{
                                                                                        setFieldValue("gender","");
                                                                                    }
                                                                                }} 
                                                                                onBlur={handleBlur} 
                                                                                checked={values.gender == "gender_1"}
                                                                            />
                                                                            <span className="check"></span>
                                                                            <span className="txt">남성</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="custom_radio">
                                                                        <label htmlFor="gender_2">
                                                                            <input type={"radio"} id="gender_2" value="gender_2" name="gender" 
                                                                                onChange={(e)=>{
                                                                                    handleChange(e);
                                                                                    if(e.currentTarget.checked){
                                                                                        setFieldValue("gender",e.currentTarget.value);
                                                                                    }else{
                                                                                        setFieldValue("gender","");
                                                                                    }
                                                                                }} 
                                                                                onBlur={handleBlur} 
                                                                                checked={values.gender == "gender_2"}
                                                                            />
                                                                            <span className="check"></span>
                                                                            <span className="txt">여성</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                {errors.gender && touched.gender &&
                                                                    <div className="alert_txt">
                                                                        {errors.gender} 
                                                                    </div>
                                                                }
                                                            </td>
                                                            <th>생년월일</th>
                                                            <td>
                                                                <div className="custom_input custom_input2">
                                                                    <PatternFormat
                                                                        name="birth"
                                                                        format="####.##.##"
                                                                        onChange={handleChange}
                                                                        value={values.birth} 
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </div>
                                                                {errors.birth && touched.birth &&
                                                                    <div className="alert_txt">
                                                                        {errors.birth} 
                                                                    </div>
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>휴대폰 번호</th>
                                                            <td>
                                                                <div className="custom_input custom_input2">
                                                                    <PatternFormat
                                                                        name="phone"
                                                                        format="###-####-####"
                                                                        onChange={handleChange}
                                                                        value={values.phone} 
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </div>
                                                                {errors.phone && touched.phone &&
                                                                    <div className="alert_txt">
                                                                        {errors.phone} 
                                                                    </div>
                                                                }
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="line_round_box bm16">
                                            <p className="f_18 medium bp12">프로필 정보</p>
                                            <div className="custom_table2 gray_table">
                                                <table>
                                                    <colgroup>
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th>거주지</th>
                                                            <td colSpan={3}>
                                                                <div className="half_sel_box flex_between">
                                                                    <div className="custom_select">
                                                                        <select value={Object.keys(loca).length === 0 ? "" : loca.sido_gugun}
                                                                            onChange={(e)=>{
                                                                                sidoChange(e.currentTarget.value);
                                                                                setLoca({});
                                                                            }}
                                                                        >
                                                                            <option value="" hidden>시</option>
                                                                            {addressList && addressList.map((sido,i)=>{
                                                                                return(
                                                                                    <option key={i} value={sido.sido_gugun}>{sido.sido_gugun}</option>
                                                                                );
                                                                            })}
                                                                        </select>
                                                                    </div>
                                                                    <div className="custom_select">
                                                                        <select value={Object.keys(loca2).length === 0 ? "" : loca2.sido_gugun}
                                                                            onChange={(e)=>{
                                                                                gugunChange(e.currentTarget.value);
                                                                            }}
                                                                        >
                                                                            <option value="" hidden >군</option>
                                                                            {addressList2 && addressList2.map((sido,i)=>{
                                                                                return(
                                                                                    <option key={i} value={sido.sido_gugun}>{sido.sido_gugun}</option>
                                                                                );
                                                                            })}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>키(cm)</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="height" value={values.height} onChange={handleChange} onBlur={handleBlur}>
                                                                        {heightList && heightList.map((cont,i)=>{
                                                                            return(
                                                                                <option key={i} value={cont.val}>{cont.txt}</option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                {errors.height && touched.height &&
                                                                    <div className="alert_txt">
                                                                        {errors.height} 
                                                                    </div>
                                                                }
                                                            </td>
                                                            <th>직업</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="job" value={values.job} onChange={handleChange} onBlur={handleBlur} >
                                                                        {jobList && jobList.map((cont,i)=>{
                                                                            return(
                                                                                <option key={i} value={cont.name}>{cont.name}</option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                {errors.job && touched.job &&
                                                                    <div className="alert_txt">
                                                                        {errors.job} 
                                                                    </div>
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>본인 외모점수</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="visual" value={values.visual} onChange={handleChange} onBlur={handleBlur}>
                                                                        {visualList && visualList.map((val,i)=>{
                                                                            return(
                                                                                <option key={i} value={val}>{val}</option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                {errors.visual && touched.visual &&
                                                                    <div className="alert_txt">
                                                                        {errors.visual} 
                                                                    </div>
                                                                }
                                                            </td>
                                                            <th>MBTI</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="mbti" value={values.mbti} onChange={handleChange}  onBlur={handleBlur}>
                                                                        {mbtiList && mbtiList.map((val,i)=>{
                                                                            return(
                                                                                <option key={i} value={val}>{val}</option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                {errors.mbti && touched.mbti &&
                                                                    <div className="alert_txt">
                                                                        {errors.mbti} 
                                                                    </div>
                                                                }
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="custom_table2 gray_table t_border tp6 tm6">
                                                <table>
                                                    <colgroup>
                                                        <col style={{"width":"18%"}} />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th className="top">본인타입</th>
                                                            <td>
                                                                <div className="check_list_box flex_wrap">
                                                                    {typeList && typeList.map((cont,i)=>{
                                                                        return(
                                                                            <div className="custom_check" key={i}>
                                                                                <label htmlFor={`type_${i}`}>
                                                                                    <input type="checkbox" id={`type_${i}`} value={cont.name} 
                                                                                        onChange={(e) => typeCheck(e, e.currentTarget.checked, e.target.value)}
                                                                                        checked={type.includes(cont.name) ? true : false}
                                                                                    />
                                                                                    <span className="check"></span>
                                                                                    <span className="txt f_15 f_gray">{cont.name}</span>
                                                                                </label>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {errorType && <div className="alert_txt">본인타입을 선택해주세요.</div>}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="custom_table2 gray_table t_border tp6 tm6">
                                                <table>
                                                    <colgroup>
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th>흡연 여부</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="smok" value={values.smok} onChange={handleChange} onBlur={handleBlur}>
                                                                        <option value="smok_1">한다</option>
                                                                        <option value="smok_3">가끔한다</option>
                                                                        <option value="smok_2">안 한다</option>
                                                                    </Field>
                                                                </div>
                                                                {errors.smok && touched.smok &&
                                                                    <div className="alert_txt">
                                                                        {errors.smok} 
                                                                    </div>
                                                                }
                                                            </td>
                                                            <th>음주 여부</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="drink" value={values.drink} onChange={handleChange} onBlur={handleBlur}>
                                                                        <option value="drink_1">한다</option>
                                                                        <option value="drink_2">가끔한다</option>
                                                                        <option value="drink_3">안 한다</option>
                                                                    </Field>
                                                                </div>
                                                                {errors.drink && touched.drink &&
                                                                    <div className="alert_txt">
                                                                        {errors.drink} 
                                                                    </div>
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>종교 여부</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="religion" value={values.religion} onChange={handleChange} onBlur={handleBlur}>
                                                                        {religionList && religionList.map((cont,i)=>{
                                                                            return(
                                                                                <option key={i} value={cont.name}>{cont.name}</option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                {errors.religion && touched.religion &&
                                                                    <div className="alert_txt">
                                                                        {errors.religion} 
                                                                    </div>
                                                                }
                                                            </td>
                                                            <th colSpan={2}></th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="custom_table2 gray_table t_border tp6 tm6">
                                                <table>
                                                    <colgroup>
                                                        <col style={{"width":"18%"}} />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th className="top">내 관심사</th>
                                                            <td>
                                                                <div className="check_list_box flex_wrap">
                                                                    {likeList && likeList.map((cont,i)=>{
                                                                        return(
                                                                            <div className="custom_check" key={i}>
                                                                                <label htmlFor={`like_${i}`}>
                                                                                    <input type="checkbox" id={`like_${i}`} value={cont.name} 
                                                                                        onChange={(e) => likeCheck(e, e.currentTarget.checked, e.target.value)}
                                                                                        checked={like.includes(cont.name) ? true : false}
                                                                                    />
                                                                                    <span className="check"></span>
                                                                                    <span className="txt f_15 f_gray">{cont.name}</span>
                                                                                </label>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {errorLike && <div className="alert_txt">내 관심사를 선택해주세요.</div>}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="custom_table2 gray_table t_border tp6 tm6">
                                                <table>
                                                    <colgroup>
                                                        <col style={{"width":"18%"}} />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th className="top">선호하는 데이트</th>
                                                            <td>
                                                                <div className="check_list_box flex_wrap">
                                                                    {dateList && dateList.map((cont,i)=>{
                                                                        return(
                                                                            <div className="custom_check" key={i}>
                                                                                <label htmlFor={`date_${i}`}>
                                                                                    <input type="checkbox" id={`date_${i}`} value={cont.name} 
                                                                                        onChange={(e) => dateCheck(e, e.currentTarget.checked, e.target.value)}
                                                                                        checked={date.includes(cont.name) ? true : false}
                                                                                    />
                                                                                    <span className="check"></span>
                                                                                    <span className="txt f_15 f_gray">{cont.name}</span>
                                                                                </label>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {errorDate && <div className="alert_txt">선호하는데이트를 선택해주세요.</div>}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="custom_table2 gray_table t_border tp6 tm6">
                                                <table>
                                                    <colgroup>
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th>가입경로</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="route" value={values.route} onChange={handleChange} onBlur={handleBlur}>
                                                                        {routeList && routeList.map((cont,i)=>{
                                                                            return(
                                                                                <option key={i} value={cont.name}>{cont.name}</option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                {errors.route && touched.route &&
                                                                    <div className="alert_txt">
                                                                        {errors.route} 
                                                                    </div>
                                                                }
                                                            </td>
                                                            <th colSpan={2}></th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="line_round_box">
                                            <p className="f_18 medium bp12">이상형 정보</p>
                                            <div className="custom_table2 gray_table">
                                                <table>
                                                    <colgroup>
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th>키(cm)</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="t_height" value={values.t_height} onChange={handleChange} onBlur={handleBlur}>
                                                                        {heightList && heightList.map((cont,i)=>{
                                                                            return(
                                                                                <option key={i} value={cont.val}>{cont.txt}</option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                {errors.t_height && touched.t_height &&
                                                                    <div className="alert_txt">
                                                                        {errors.t_height} 
                                                                    </div>
                                                                }
                                                            </td>
                                                            <th>직업</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="t_job" value={values.t_job} onChange={handleChange} onBlur={handleBlur}>
                                                                        {jobList && jobList.map((cont,i)=>{
                                                                            return(
                                                                                <option key={i} value={cont.name}>{cont.name}</option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                {errors.t_job && touched.t_job &&
                                                                    <div className="alert_txt">
                                                                        {errors.t_job} 
                                                                    </div>
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>상대방 외모점수</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="t_visual" value={values.t_visual} onChange={handleChange} onBlur={handleBlur}>
                                                                        {visualList && visualList.map((val,i)=>{
                                                                            return(
                                                                                <option key={i} value={val}>{val}</option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                {errors.t_visual && touched.t_visual &&
                                                                    <div className="alert_txt">
                                                                        {errors.t_visual} 
                                                                    </div>
                                                                }
                                                            </td>
                                                            <th>상대방 MBTI</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="t_mbti" value={values.t_mbti} onChange={handleChange} onBlur={handleBlur}>
                                                                        {mbtiList && mbtiList.map((val,i)=>{
                                                                            return(
                                                                                <option key={i} value={val}>{val}</option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                {errors.t_mbti && touched.t_mbti &&
                                                                    <div className="alert_txt">
                                                                        {errors.t_mbti} 
                                                                    </div>
                                                                }
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="custom_table2 gray_table t_border tp6 tm6">
                                                <table>
                                                    <colgroup>
                                                        <col style={{"width":"18%"}} />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th className="top">상대방 타입</th>
                                                            <td>
                                                                <div className="check_list_box flex_wrap">
                                                                    {typeList && typeList.map((cont,i)=>{
                                                                        return(
                                                                            <div className="custom_check" key={i}>
                                                                                <label htmlFor={`t_type_${i}`}>
                                                                                    <input type="checkbox" id={`t_type_${i}`} value={cont.name} 
                                                                                        onChange={(e) => typeCheck2(e, e.currentTarget.checked, e.target.value)}
                                                                                        checked={type2.includes(cont.name) ? true : false}
                                                                                    />
                                                                                    <span className="check"></span>
                                                                                    <span className="txt f_15 f_gray">{cont.name}</span>
                                                                                </label>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="custom_table2 gray_table t_border tp6 tm6">
                                                <table>
                                                    <colgroup>
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                        <col style={{"width":"18%"}} />
                                                        <col style={{"width":"32%"}} />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th>흡연 여부</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="t_smok" value={values.t_smok} onChange={handleChange} onBlur={handleBlur}>
                                                                        <option value="t_smok_1">한다</option>
                                                                        <option value="t_smok_3">가끔한다</option>
                                                                        <option value="t_smok_2">안 한다</option>
                                                                    </Field>
                                                                </div>
                                                            </td>
                                                            <th>음주 여부</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="t_drink" value={values.t_drink} onChange={handleChange} onBlur={handleBlur}>
                                                                        <option value="t_drink_1">한다</option>
                                                                        <option value="t_drink_2">가끔한다</option>
                                                                        <option value="t_drink_3">안 한다</option>
                                                                    </Field>
                                                                </div>
                                                                {errors.t_drink && touched.t_drink &&
                                                                    <div className="alert_txt">
                                                                        {errors.t_drink} 
                                                                    </div>
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>종교 여부</th>
                                                            <td>
                                                                <div className="custom_select">
                                                                    <Field as="select" name="t_religion" value={values.t_religion} onChange={handleChange} onBlur={handleBlur}>
                                                                        {religionList && religionList.map((cont,i)=>{
                                                                            return(
                                                                                <option key={i} value={cont.name}>{cont.name}</option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                {errors.t_religion && touched.t_religion &&
                                                                    <div className="alert_txt">
                                                                        {errors.t_religion} 
                                                                    </div>
                                                                }
                                                            </td>
                                                            <th colSpan={2}></th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="btn_box2 flex_center tp16">
                                        <button type="button" className="btn_round2" onClick={closePopHandler}>취소</button>
                                        <button type="button" className="btn_round" onClick={()=>{modifyCheckHandler(values)}}>저장</button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    }
                </div>
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

export default MemberProfile;