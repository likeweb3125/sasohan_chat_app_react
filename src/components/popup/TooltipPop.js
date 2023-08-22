import { useDispatch, useSelector } from "react-redux";
import { tooltipPop } from "../../store/popupSlice";

const TooltipPop = () => {
    const popup = useSelector((state)=>state.popup);
    const dispatch = useDispatch();


    //팝업닫기
    const closePopHandler = () => {
        dispatch(tooltipPop({tooltipPop:false,tooltipPopPosition:[],tooltipPopData:{}}));
    };


    return(
        <div className="pop_wrap tooltip_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont" style={{top:popup.tooltipPopPosition[0],left:popup.tooltipPopPosition[1]}}>
                <div className="flex">
                    <h6>{popup.tooltipPopData.flg}</h6>
                    {popup.tooltipPopData.p_flg || popup.tooltipPopData.p_kind || popup.tooltipPopData.p_kind2 ?
                        <ul className="flex_wrap">
                            {popup.tooltipPopData.p_flg && <li>{popup.tooltipPopData.p_flg}</li>}
                            {popup.tooltipPopData.p_kind && <li>&nbsp;· {popup.tooltipPopData.p_kind}</li>}
                            {popup.tooltipPopData.p_kind2 && <li>&nbsp;· {popup.tooltipPopData.p_kind2}</li>}
                        </ul>
                        : null
                    }
                </div>
            </div>
        </div>
        
    );
};

export default TooltipPop;