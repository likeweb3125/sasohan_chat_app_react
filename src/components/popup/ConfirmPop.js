import { useSelector, useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { confirmPop } from "../../store/popupSlice";

const ConfirmPop = (props) => {
    const popup = useSelector((state)=>state.popup);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //팝업닫기
    const closePopHandler = () => {

        //팝업닫기 custom <ConfirmPop closePop="custom" onCloseHandler={팝업닫는함수} /> 형식으로 쓰면 원하는 팝업닫는함수사용 가능
        if(props.closePop == 'custom'){
            props.onCloseHandler();
        }

        //창 이동 <ConfirmPop goBack={1}/> 형식으로 쓰면 숫자만큼 확인후 뒤로감
        if(props.goBack){
            navigate(-props.goBack);
        }

        if(!props.goBack && !props.closePop){
            dispatch(confirmPop({confirmPop:false}));
        }
    };


    return createPortal(
        <>
            {popup.confirmPop &&
                <div className="pop_wrap confirm_pop">
                    <div className="dim"></div>
                    <div className="pop_cont">
                        <div className="pop_tit flex_between">
                            <p className="f_24"><strong>{popup.confirmPopTit}</strong></p>
                            {popup.confirmPopBtn && <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>}
                        </div>
                        <p className="tx_c bm30">{popup.confirmPopTxt}</p>
                        {popup.confirmPopBtn === 1 &&
                            <button type="button" className="btn" onClick={closePopHandler}>확인</button>
                        }
                        {popup.confirmPopBtn === 2 &&
                            <div className="bottom_btn_box flex_between">
                                <button type="button" className="btn" onClick={()=>{
                                    props.onClickHandler();
                                    closePopHandler();
                                }}>확인</button>
                                <button type="button" className="btn2" onClick={closePopHandler}>취소</button>
                            </div>
                        }
                    </div>
                </div>
            }
        </>,
        document.getElementById('modal-root')
    );
};

export default ConfirmPop;