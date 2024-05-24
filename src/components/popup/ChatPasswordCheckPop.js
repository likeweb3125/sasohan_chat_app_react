import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatPasswordCheckPop, confirmPop, chatPasswordCheckPopClose } from "../../store/popupSlice";
import { chatPassword, chatPasswordCheck } from "../../store/userSlice";
import { selectUser } from "../../store/commonSlice";
import ConfirmPop from "./ConfirmPop";


const ChatPasswordCheckPop = () => {
    const dispatch = useDispatch();
    const popup = useSelector((state)=>state.popup);
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState(false);


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //팝업닫기
    const closePopHandler = () => {
        dispatch(chatPasswordCheckPop(false));
        dispatch(chatPasswordCheckPopClose(true));
    };


    const passwordCheckHandler = () => {
        if(password.length > 0){
            dispatch(chatPasswordCheck(true));
            dispatch(chatPassword(password));
            dispatch(chatPasswordCheckPop(false));
        }else{
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt:'비밀번호를 입력해주세요.',
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };


    return(<>
        <div className="pop_wrap">
            <div className="dim"></div>
            <div className="pop_cont">
                <div className="pop_tit flex_between">
                    <p className="f_24"><strong>비밀번호 확인</strong></p>
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="bp20 tp10">
                    <div className="custom_input custom_input2">
                        <input type={"password"} placeholder='비밀번호를 입력해주세요.' value={password} 
                            onChange={(e)=>{
                                const val = e.currentTarget.value;
                                setPassword(val);
                            }}
                            onKeyDown={(e)=>{
                                if(e.key === "Enter") {
                                    e.preventDefault();
                                    passwordCheckHandler();
                                }
                            }}
                        />
                    </div>
                </div>
                <button type="button" className="btn" onClick={passwordCheckHandler}>확인</button>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ChatPasswordCheckPop;