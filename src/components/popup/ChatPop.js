import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { chatPop, confirmPop, tooltipPop } from "../../store/popupSlice";
import SearchBox from "../component/SearchBox";
import ConfirmPop from "./ConfirmPop";

const ChatPop = (props) => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const dispatch = useDispatch();
    const chat_introduce_list = enum_api_uri.chat_introduce_list;
    const chat_connect = enum_api_uri.chat_connect;
    const token = localStorage.getItem("token");
    const [confirm, setConfirm] = useState(false);
    const [connectConfirm, setConnectConfirm] = useState(false);
    const [connectOkConfirm, setConnectOkConfirm] = useState(false);
    const [closeConfirm, setCloseConfirm] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [list, setList] = useState([]);
    const [idList, setIdList] = useState([]);
    const [checkList, setCheckList] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    //window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    //window 사이즈변경시 툴팁팝업 닫기
    useEffect(()=>{
        dispatch(tooltipPop({tooltipPop:false,tooltipPopPosition:[],tooltipPopData:{}}));
    },[windowWidth]);


    //팝업닫기
    const closePopHandler = () => {
        dispatch(chatPop(false));
    };

    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
            setConnectConfirm(false);
            setConnectOkConfirm(false);
            setCloseConfirm(false);
        }
    },[popup.confirmPop]);


    //대화방연결 리스트 가져오기
    const getList = (searchTxt) => {
        axios.get(`${chat_introduce_list.replace(":m_id",common.selectUser.m_id)}${searchTxt ? "?search_name="+searchTxt : ""}`,
            {headers:{Authorization: `Bearer ${token}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                let data = res.data;
                // let data = [
                //     {
                //         "m_id": "wkdskfk623",
                //         "m_name": "긴급정산",
                //         "m_gender": "2",
                //         "birth": "94",
                //         "m_address": "전라북도 익산시",
                //         "introduce_date": "2017.07.07 14:04",
                //         "manager": "skysjs",
                //         "flg": "B",
                //         "p_flg": "E",
                //         "p_kind": null,
                //         "p_kind2": null,
                //         "connect": "연결중",
                //         "is_connect": 1
                //     },
                //     {
                //         "m_id": "wkdskfk622",
                //         "m_name": "긴급정산",
                //         "m_gender": "2",
                //         "birth": "94",
                //         "m_address": "전라북도 익산시",
                //         "introduce_date": "2017.07.07 14:04",
                //         "manager": "skysjs",
                //         "flg": "B",
                //         "p_flg": "A",
                //         "p_kind": null,
                //         "p_kind2": null,
                //         "connect": "연결가능",
                //         "is_connect": 0
                //     }
                // ]
                setList([...data]);
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
        getList();
    },[]);


    //회원명 검색하기
    const searchHandler = () => {
        if(searchValue.length > 0){
            getList(searchValue);
        }else{
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: "검색할 회원명을 입력해주세요.",
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };


    //맨처음 대화방연결리스트 연결가능한 회원아이디값만 배열로
    useEffect(()=>{
        if(list){
            const filteredIds = list
                .filter((item) => item.connect === "연결가능")
                .map((item) => item.m_id);

            setIdList([...filteredIds]);
        }
    },[list]);


    //전체선택 체크박스 체크시
    const allCheckHandler = (checked) => {
        if(checked){
            setCheckList([...idList]);
        }else{
            setCheckList([]);
        }
    };


    //체크박스 체크시
    const checkHandler = async (checked, value) => {
        let newList = checkList;
        if(checked){
            newList = newList.concat(value);
        }else if(!checked && newList.includes(value)){
            newList = newList.filter((el)=>el !== value);
        }
        setCheckList(newList);
    };


    // 대화방 연결버튼 클릭시
    const connectHandler = () => {
        if(checkList.length > 0){
            let body = {
                from_id: common.selectUser.m_id,
                to_id: checkList
            };
    
            axios.post(`${chat_connect}`,body,
                {headers: {Authorization: `Bearer ${token}`}}
            )
            .then((res)=>{
                if(res.status === 200){
                    let data = res.data;
                    
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
        }else{
            dispatch(confirmPop({
                confirmPop:true,
                confirmPopTit:'알림',
                confirmPopTxt: "선택된 회원이 없습니다.",
                confirmPopBtn:1,
            }));
            setConfirm(true);
        }
    };


    //닫기, 취소버튼 클릭시
    const cancelHandler = () => {
        dispatch(confirmPop({
            confirmPop:true,
            confirmPopTit:'알림',
            confirmPopTxt: "작성중인 내용을 저장하지 않고 나가시겠습니까?",
            confirmPopBtn:2,
        }));
        setCloseConfirm(true);
    };

    //서비스 클릭시 툴팁팝업 열기
    const tooltipClickHandler = (e, data) => {
        const element = e.currentTarget;
        let top = element.getBoundingClientRect().top + 33;
        let left = element.getBoundingClientRect().left;
        dispatch(tooltipPop({tooltipPop:true,tooltipPopPosition:[top,left],tooltipPopData:data}));
    };

    return(<>
        <div className="pop_wrap chat_pop"> 
            <div className="dim"></div>
            <div className="pop_cont pop_cont4">
                <div className="pop_tit flex_between">
                    <p className="f_24"><strong>대화방 연결</strong></p>
                    <button type="button" className="btn_close" onClick={cancelHandler}>닫기버튼</button>
                </div>
                <SearchBox 
                    placeholder="연결할 회원명 검색"
                    searchValue={searchValue}
                    onChangeHandler={(e)=>{setSearchValue(e.currentTarget.value)}}
                    onSearchHandler={searchHandler}
                />
                <div className="cont_box">
                    <p className="tit">연결 이성 선택</p>
                    <div className="scroll_wrap">
                        <div className="custom_table">
                            <table>
                                <colgroup>
                                    <col style={{"width":"45px"}} />
                                    <col style={{"width":"125px"}} />
                                    <col style={{"width":"110px"}} />
                                    <col style={{"width":"auto"}} />
                                    <col style={{"width":"70px"}} />
                                    <col style={{"width":"100px"}} />
                                    <col style={{"width":"110px"}} />
                                    <col style={{"width":"80px"}} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="custom_check">
                                                <label className="clearfix">
                                                    <input type="checkbox" 
                                                        onChange={(e)=>{allCheckHandler(e.currentTarget.checked)}} 
                                                        checked={idList.length > 0 && idList.length === checkList.length && idList.every(item => checkList.includes(item))}
                                                    />
                                                    <span className="check"></span>
                                                </label>
                                            </div>
                                        </th>
                                        <th>연결된 시간</th>
                                        <th>이름</th>
                                        <th>지역</th>
                                        <th>나이</th>
                                        <th>서비스</th>
                                        <th>담당매니저</th>
                                        <th>연결여부</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length > 0 ? 
                                        list.map((data,i)=>{
                                            return(
                                                <tr 
                                                    key={i}
                                                    className={`${checkList.includes(data.m_id) ? "checked" : data.connect != "연결가능" ? "none" : ""}`} 
                                                >
                                                    <td>
                                                        <div className="custom_check">
                                                            <label className="clearfix" htmlFor={`check_${data.m_id}`}>
                                                                <input type="checkbox" 
                                                                    id={`check_${data.m_id}`}
                                                                    value={data.m_id}
                                                                    onChange={(e) => {
                                                                        const isChecked = e.currentTarget.checked;
                                                                        const value = e.currentTarget.value;
                                                                        checkHandler(isChecked, value);
                                                                    }}
                                                                    checked={checkList.includes(data.m_id)}
                                                                    disabled={data.connect == "연결가능" ? false : true}
                                                                />
                                                                <span className="check"></span>
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td>{data.introduce_date}</td>
                                                    <td>{data.m_name}</td>
                                                    <td>{data.m_address}</td>
                                                    <td>{data.birth}</td>
                                                    <td>
                                                        <div 
                                                            className="tag tooltip_tag" 
                                                            style={{"borderColor":"#FC5862","color":"#FC5862"}}
                                                            onClick={(e)=>{
                                                                tooltipClickHandler(e, data);
                                                            }}
                                                        ><span>프리미엄</span></div>
                                                    </td>
                                                    <td>{data.manager}</td>
                                                    <td><div className={`tag2 ${data.connect == "연결가능" ? "on" : ""}`}>{data.connect}</div></td>
                                                </tr>
                                            );
                                        })
                                        :   <tr>
                                                <td colSpan={8}><div className="none_data">데이터가 없습니다.</div></td>
                                            </tr>
                                    }
                                    {/* <tr className="checked">
                                        <td>
                                            <div className="custom_check">
                                                <label className="clearfix">
                                                    <input type="checkbox" />
                                                    <span className="check"></span>
                                                </label>
                                            </div>
                                        </td>
                                        <td>2023.04.24 18:40</td>
                                        <td>박성훈</td>
                                        <td>제주특별자치도 서귀포시</td>
                                        <td>96</td>
                                        <td><div className="tag" style={{"borderColor":"#FC5862","color":"#FC5862"}}>프리미엄</div></td>
                                        <td>김소혜</td>
                                        <td><div className="tag2 on">가능</div></td>
                                    </tr>
                                    <tr className="none">
                                        <td>
                                            <div className="custom_check">
                                                <label className="clearfix">
                                                    <input type="checkbox" disabled />
                                                    <span className="check"></span>
                                                </label>
                                            </div>
                                        </td>
                                        <td>2023.04.24 18:40</td>
                                        <td>박성훈</td>
                                        <td>제주특별자치도 서귀포시</td>
                                        <td>96</td>
                                        <td><div className="tag" style={{"borderColor":"#FC5862","color":"#FC5862"}}>프리미엄</div></td>
                                        <td>김소혜</td>
                                        <td><div className="tag2">불가능</div></td>
                                    </tr>
                                    <tr>
                                        <td colSpan={8}><div className="none_data">데이터가 없습니다.</div></td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="btn_box flex_between tp15">
                    <div className="txt flex"><strong>선택한 회원수</strong><span><strong>{CF.MakeIntComma(checkList.length)}</strong> 명</span></div>
                    <div>
                        <button type="button" className="btn_round2 rm8" onClick={cancelHandler}>취소</button>
                        <button type="button" className="btn_round" onClick={connectHandler}>연결</button>
                    </div>
                </div>
            </div>
        </div>

        {/* 대화방연결 닫기,취소 confirm팝업 */}
        {closeConfirm && <ConfirmPop onClickHandler={closePopHandler} />}

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default ChatPop;