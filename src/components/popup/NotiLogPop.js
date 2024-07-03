import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { notiLogPop, confirmPop, loadingPop } from "../../store/popupSlice";
import ConfirmPop from "./ConfirmPop";
import SearchBox from "../component/SearchBox";
import Pagination from "../component/Pagination";

const NotiLogPop = () => {
    const popup = useSelector((state)=>state.popup);
    const user = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const fcm_log = enum_api_uri.fcm_log;
    const [confirm, setConfirm] = useState(false);
    const [listData, setListData] = useState({});
    const [list, setList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const listRef = useRef(null);


    //팝업닫기
    const closePopHandler = () => {
        dispatch(notiLogPop(false));
    };

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);

    //로그내역 가져오기
    const getList = (page) => {
        dispatch(loadingPop(true));
        axios.get(`${fcm_log}?page_no=${page ? page : 1}${searchValue.length ? '&search='+searchValue : ''}`,
            {headers:{Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res)=>{
            dispatch(loadingPop(false));
            if(res.status === 200){
                const data = res.data;
                const list = data.result;
                setListData(data);
                setList(list);
            }
        })
        .catch((error) => {
            dispatch(loadingPop(false));
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
        getList();
    },[]);


    useEffect(()=>{
        setTimeout(()=>{
            listRef.current.scrollTop = 0;
        },10);
    },[list]);


    //페이징번호 클릭시 리스트리스트 변경하기
    const movePage = (num) => {
        getList(num);
    };


    //페이징 이전버튼 클릭시
    const prevPaging = () => {
        if(listData.current_page > 1){
            const num = listData.current_page - 1;
            getList(num);
        }
    };

    //페이징 다음버튼 클릭시
    const nextPaging = () => {
        if(listData.current_page < listData.end_page){
            const num = listData.current_page + 1;
            getList(num);
        }
    };



    return(<>
        <div className="pop_wrap noti_log_pop">
            <div className="dim" onClick={closePopHandler}></div>
            <div className="pop_cont pop_gray">
                <div className="pop_tit flex_between">
                    <p className="f_24"><strong>결정의 날 알림 로그</strong></p>
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <div className="scroll_wrap line_round_box" ref={listRef}>
                    <div className="top_search_box">
                        <SearchBox 
                            placeholder="회원명 검색"
                            searchValue={searchValue}
                            onChangeHandler={(e)=>{
                                const val = e.currentTarget.value;
                                setSearchValue(val);
                            }}
                            onSearchHandler={()=>{getList()}}
                        />
                    </div>
                    <div className="custom_table">
                        <table>
                            <colgroup>
                                <col width={`90px`} />
                                <col width={`28%`} />
                                <col width={`auto`} />
                                <col width={`70px`} />
                                <col width={`auto`} />
                                <col width={`180px`} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>로그번호</th>
                                    <th>남자(지역) & 여자(지역)</th>
                                    <th>fcm 발송 메시지</th>
                                    <th>성공 여부</th>
                                    <th>비고(실패 메시지)</th>
                                    <th>전송일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list && list.length > 0 ?
                                    list.map((cont,i)=>{
                                        return(
                                            <tr key={`log_${i}`}>
                                                <td>{cont.idx}</td>
                                                <td>{`${cont.from_user.m_name}(${cont.from_user.m_address})&${cont.to_user.m_name}(${cont.to_user.m_address})`}</td> 
                                                <td>{cont.msg}</td>
                                                <td>{cont.success ? 'O' : 'X'}</td>
                                                <td>{cont.err_msg ? cont.err_msg : '-'}</td>
                                                <td>{cont.w_date}</td>
                                            </tr>
                                        );
                                    })
                                    : <tr><td colSpan={6}><div className="none_data">데이터가 없습니다.</div></td></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    {list && list.length > 0 &&
                        <Pagination 
                            currentPage={listData.current_page} //현재페이지 번호
                            startPage={listData.start_page} //시작페이지 번호 
                            endPage={listData.end_page} //보이는 끝페이지 번호 
                            lastPage={listData.last_page} //총페이지 끝
                            onMovePage={movePage}
                            onPrevPaging={prevPaging}
                            onNextPaging={nextPaging}
                        />
                    }
                </div>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default NotiLogPop;