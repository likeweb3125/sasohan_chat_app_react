import { useSelector } from "react-redux";
import { createPortal } from "react-dom";

import MemberPop from "./MemberPop";
import MemberInfoPop from "./MemberInfoPop";
import ImgPop from "./ImgPop";
import ImgListPop from "./ImgListPop";
import ChatPop from "./ChatPop";
import TooltipPop from "./TooltipPop";
import MessagePop from "./MessagePop";
import MemberCheckPop from "./MemberCheckPop";
import FilterPop from "./FilterPop";
import ManagerProfilePop from "./ManagerProfilePop";
import LoadingPop from "./LoadingPop";

const Popup = () => {
    const popup = useSelector((state)=>state.popup);

    return createPortal(
        <>
            {/* 사진모아보기 팝업 */}
            {popup.imgPop && <ImgPop />}

            {/* 사진모아보기 리스트 팝업 */}
            {popup.imgListPop && <ImgListPop />}

            {/* 대화방연결 팝업 */}
            {popup.chatPop && <ChatPop />}

            {/* 대화방연결 팝업 - 툴팁 팝업 */}
            {popup.tooltipPop && <TooltipPop />}

            {/* 단체메시지 팝업 */}
            {popup.messagePop && <MessagePop />}

            {/* 단체메시지 회원 추가,삭제 팝업 */}
            {popup.memCheckPop && <MemberCheckPop />}

            {/* 회원정보 팝업 */}
            {popup.memPop && <MemberPop />}

            {/* 회원정보상세 팝업 */} 
            {/* -> 회원정보상세 새창으로 변경 */}
            {/* {popup.memInfoPop && <MemberInfoPop />} */}

            {/* 조건검색기 팝업 */}
            {popup.filterPop && <FilterPop />}

            {/* 매니저프로필 팝업 */}
            {popup.managerProfilePop && <ManagerProfilePop />}

            {/* 로딩 팝업 */}
            {popup.loadingPop && <LoadingPop />}

        </>,
        document.getElementById('modal-root')
    );
};

export default Popup;