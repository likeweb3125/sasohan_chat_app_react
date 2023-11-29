import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import * as CF from "../../config/function";
import { enum_api_uri } from "../../config/enum";
import { filterPop, confirmPop, loadingPop } from "../../store/popupSlice";
import { filter, filterData, pageNo } from "../../store/commonSlice";
import SelectBox from "../component/SelectBox";
import InputDatepicker from "../component/InputDatePicker";
import ConfirmPop from "./ConfirmPop";

const FilterPop = (props) => {
    const popup = useSelector((state)=>state.popup);
    const common = useSelector((state)=>state.common);
    const user = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const [confirm, setConfirm] = useState(false);
    const u_address = enum_api_uri.u_address;
    const [addressList, setAddressList] = useState([]);

    //팝업닫기
    const closePopHandler = () => {
        dispatch(filterPop(false));
    };


    // Confirm팝업 닫힐때
    useEffect(()=>{
        if(popup.confirmPop === false){
            setConfirm(false);
        }
    },[popup.confirmPop]);


    //주소 시,도 가져오기
    const getAddress = () => {
        dispatch(loadingPop(true));

        axios.get(`${u_address}`,
            {headers:{Authorization: `Bearer ${user.tokenValue}`}}
        )
        .then((res)=>{
            if(res.status === 200){
                dispatch(loadingPop(false));

                let data = res.data;
                let addressArray = data.map((item) => item.sido_gugun).filter(Boolean);
                setAddressList([...addressArray]);
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


    useEffect(()=>{
        getAddress();
    },[]);


    //조건검색하기
    const searchHandler = (values) => {
        dispatch(filter(true));
        dispatch(filterData({...values}));

        //store에 페이지값 지우기
        dispatch(pageNo({pageNo:1,pageLastNo:null}));

        closePopHandler();
    };


    //초기화하기
    const fromReset = ({setFieldValue}) => {
        setFieldValue("j_address","");
        setFieldValue("j_sido","");
        setFieldValue("j_sido2","");
        setFieldValue("j_sido3","");
        setFieldValue("j_sido4","");
        setFieldValue("j_sido5","");
        setFieldValue("j_sido6","");
        setFieldValue("j_sido7","");
        setFieldValue("j_sido8","");
        setFieldValue("j_sido9","");
        setFieldValue("j_sido10","");
        setFieldValue("j_age1","");
        setFieldValue("j_age2","");
        setFieldValue("j_ages1","");
        setFieldValue("j_ages2","");
        setFieldValue("j_ages3","");
        setFieldValue("j_ages4","");
        setFieldValue("j_ages5","");
        setFieldValue("j_ages6","");
        setFieldValue("j_height1","");
        setFieldValue("j_height2","");
        setFieldValue("j_w_cnt1","");
        setFieldValue("j_w_cnt2","");
        setFieldValue("j_visual1","");
        setFieldValue("j_visual2","");
        setFieldValue("j_T_age","");
        setFieldValue("j_T_height1","");
        setFieldValue("j_M_log","");
        setFieldValue("j_last_in1","");
        setFieldValue("j_last_in2","");
        setFieldValue("j_reg_date1","");
        setFieldValue("j_reg_date2","");
        setFieldValue("j_long","");
        setFieldValue("j_drink","");
        setFieldValue("j_smok","");
    };


    return(<>
        <div className="pop_wrap filter_pop"> 
            <div className="dim"></div>
            <div className="pop_cont pop_cont3 pop_gray">
                <div className="pop_tit flex_between">
                    <p className="f_24"><strong>조건검색기</strong></p>
                    <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                </div>
                <Formik
                    initialValues={{
                        j_address: common.filterData.j_address || "",
                        j_sido: common.filterData.j_sido || "",
                        j_sido2: common.filterData.j_sido2 || "",
                        j_sido3: common.filterData.j_sido3 || "",
                        j_sido4: common.filterData.j_sido4 || "",
                        j_sido5: common.filterData.j_sido5 || "",
                        j_sido6: common.filterData.j_sido6 || "",
                        j_sido7: common.filterData.j_sido7 || "",
                        j_sido8: common.filterData.j_sido8 || "",
                        j_sido9: common.filterData.j_sido9 || "",
                        j_sido10: common.filterData.j_sido10 || "",
                        j_age1: common.filterData.j_age1 || "",
                        j_age2: common.filterData.j_age2 || "",
                        j_ages1: common.filterData.j_ages1 || "",
                        j_ages2: common.filterData.j_ages2 || "",
                        j_ages3: common.filterData.j_ages3 || "",
                        j_ages4: common.filterData.j_ages4 || "",
                        j_ages5: common.filterData.j_ages5 || "",
                        j_ages6: common.filterData.j_ages6 || "",
                        j_height1: common.filterData.j_height1 || "",
                        j_height2: common.filterData.j_height2 || "",
                        j_w_cnt1: common.filterData.j_w_cnt1 || "",
                        j_w_cnt2: common.filterData.j_w_cnt2 || "",
                        j_visual1: common.filterData.j_visual1 || "",
                        j_visual2: common.filterData.j_visual2 || "",
                        j_T_age: common.filterData.j_T_age || "",
                        j_T_height1: common.filterData.j_T_height1 || "",
                        j_M_log: common.filterData.j_M_log || "",
                        j_last_in1: common.filterData.j_last_in1 || "",
                        j_last_in2: common.filterData.j_last_in2 || "",
                        j_reg_date1: common.filterData.j_reg_date1 || "",
                        j_reg_date2: common.filterData.j_reg_date2 || "",
                        j_long: common.filterData.j_long || "",
                        j_drink: common.filterData.j_drink || "",
                        j_smok: common.filterData.j_smok || "",
                    }}
                    // validationSchema={validationSchema}
                    // onSubmit={submit}
                >
                    {({values, handleChange, handleBlur, errors, touched, setFieldValue, handleReset, resetForm}) => (
                        <form>
                            <div className="scroll_wrap line_round_box">
                                <div className="custom_table2">
                                    <table>
                                        <colgroup>
                                            <col style={{"width":"17%"}} />
                                            <col style={{"width":"43%"}} />
                                            <col style={{"width":"80px"}} />
                                            <col style={{"width":"auto"}} />
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <th>지역</th>
                                                <td>
                                                    <SelectBox 
                                                        list={addressList}
                                                        selected={values.j_address}
                                                        onChangeHandler={handleChange}
                                                        name="j_address"
                                                    />
                                                </td>
                                                <th>시, 군, 구</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <input type={"text"} placeholder="입력해주세요." name="j_sido" value={values.j_sido} onChange={handleChange} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>나이</th>
                                                <td>
                                                    <div className="half_input_box flex_between">
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength={2} name="j_age1" value={values.j_age1} onChange={handleChange} />
                                                        </div>
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength={2} name="j_age2" value={values.j_age2} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <th>시, 군, 구</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <input type={"text"} placeholder="입력해주세요." name="j_sido2" value={values.j_sido2} onChange={handleChange} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>세부나이</th>
                                                <td>
                                                    <div className="age_input_box flex_between">
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength="2" className="tx_c" name="j_ages1" value={values.j_ages1} onChange={handleChange} />
                                                        </div>
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength="2" className="tx_c" name="j_ages2" value={values.j_ages2} onChange={handleChange} />
                                                        </div>
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength="2" className="tx_c" name="j_ages3" value={values.j_ages3} onChange={handleChange} />
                                                        </div>
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength="2" className="tx_c" name="j_ages4" value={values.j_ages4} onChange={handleChange} />
                                                        </div>
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength="2" className="tx_c" name="j_ages5" value={values.j_ages5} onChange={handleChange} />
                                                        </div>
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength="2" className="tx_c" name="j_ages6" value={values.j_ages6} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <th>시, 군, 구</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <input type={"text"} placeholder="입력해주세요." name="j_sido3" value={values.j_sido3} onChange={handleChange} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>키</th>
                                                <td>
                                                    <div className="half_input_box flex_between">
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength={3} name="j_height1" value={values.j_height1} onChange={handleChange} />
                                                        </div>
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength={3} name="j_height2" value={values.j_height2} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <th>시, 군, 구</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <input type={"text"} placeholder="입력해주세요." name="j_sido4" value={values.j_sido4} onChange={handleChange} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>소개횟수</th>
                                                <td>
                                                    <div className="half_input_box flex_between">
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} name="j_w_cnt1" value={values.j_w_cnt1} onChange={handleChange} />
                                                        </div>
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} name="j_w_cnt2" value={values.j_w_cnt2} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <th>시, 군, 구</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <input type={"text"} placeholder="입력해주세요." name="j_sido5" value={values.j_sido5} onChange={handleChange} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>원하는 외모점수</th>
                                                <td>
                                                    <div className="half_input_box flex_between">
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength={2} name="j_visual1" value={values.j_visual1} onChange={handleChange} />
                                                        </div>
                                                        <div className="custom_input custom_input2">
                                                            <NumericFormat decimalScale={0} maxLength={2} name="j_visual2" value={values.j_visual2} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <th>시, 군, 구</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <input type={"text"} placeholder="입력해주세요." name="j_sido6" value={values.j_sido6} onChange={handleChange} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>원하는 나이</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <NumericFormat decimalScale={0} maxLength={2} name="j_T_age" value={values.j_T_age} onChange={handleChange} />
                                                    </div>
                                                </td>
                                                <th>시, 군, 구</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <input type={"text"} placeholder="입력해주세요." name="j_sido7" value={values.j_sido7} onChange={handleChange} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>원하는 키</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <NumericFormat decimalScale={0} maxLength={3} name="j_T_height1" value={values.j_T_height1} onChange={handleChange} />
                                                    </div>
                                                </td>
                                                <th>시, 군, 구</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <input type={"text"} placeholder="입력해주세요." name="j_sido8" value={values.j_sido8} onChange={handleChange} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>최근 접속일</th>
                                                <td>
                                                    <InputDatepicker 
                                                        class="custom_input2"
                                                        selectedDate={values.j_M_log} 
                                                        ChangeHandler={(date)=>setFieldValue('j_M_log', date)} 
                                                        value={values.j_M_log}
                                                        name="j_M_log"
                                                        monthDrop={true}
                                                        yearDrop={true}
                                                    />
                                                </td>
                                                <th>시, 군, 구</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <input type={"text"} placeholder="입력해주세요." name="j_sido9" value={values.j_sido9} onChange={handleChange} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>마지막 소개일</th>
                                                <td>
                                                    <div className="half_input_box flex_between">
                                                        <InputDatepicker 
                                                            class="custom_input2"
                                                            selectedDate={values.j_last_in1} 
                                                            ChangeHandler={(date)=>setFieldValue('j_last_in1', date)} 
                                                            value={values.j_last_in1}
                                                            name="j_last_in1"
                                                            monthDrop={true}
                                                            yearDrop={true}
                                                        />
                                                        <InputDatepicker 
                                                            class="custom_input2"
                                                            selectedDate={values.j_last_in2} 
                                                            ChangeHandler={(date)=>setFieldValue('j_last_in2', date)} 
                                                            value={values.j_last_in2}
                                                            name="j_last_in2"
                                                            monthDrop={true}
                                                            yearDrop={true}
                                                        />
                                                    </div>
                                                </td>
                                                <th>시, 군, 구</th>
                                                <td>
                                                    <div className="custom_input custom_input2">
                                                        <input type={"text"} placeholder="입력해주세요." name="j_sido10" value={values.j_sido10} onChange={handleChange} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>가입일</th>
                                                <td>
                                                    <div className="half_input_box flex_between">
                                                        <InputDatepicker 
                                                            class="custom_input2"
                                                            selectedDate={values.j_reg_date1} 
                                                            ChangeHandler={(date)=>setFieldValue('j_reg_date1', date)} 
                                                            value={values.j_reg_date1}
                                                            name="j_reg_date1"
                                                            monthDrop={true}
                                                            yearDrop={true}
                                                        />
                                                        <InputDatepicker 
                                                            class="custom_input2"
                                                            selectedDate={values.j_reg_date2} 
                                                            ChangeHandler={(date)=>setFieldValue('j_reg_date2', date)} 
                                                            value={values.j_reg_date2}
                                                            name="j_reg_date2"
                                                            monthDrop={true}
                                                            yearDrop={true}
                                                        />
                                                    </div>
                                                </td>
                                                <th colSpan={2}></th>
                                            </tr>
                                            <tr>
                                                <th colSpan={4}>기타</th>
                                            </tr>
                                            <tr>
                                                <td colSpan={4}>
                                                    <div className="flex">
                                                        <div className="custom_check rm50">
                                                            <label htmlFor="long_check">
                                                                <input type="checkbox" id="long_check" name="j_long" value={values.j_long} 
                                                                    checked={values.j_long == "Y" ? true : false}
                                                                    onChange={(e)=>{
                                                                        handleChange(e);
                                                                        if(e.currentTarget.checked){
                                                                            setFieldValue("j_long","Y");
                                                                        }else{
                                                                            setFieldValue("j_long","");
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="check"></span>
                                                                <span className="txt f_15">장거리</span>
                                                            </label>
                                                        </div>
                                                        <div className="custom_check rm50">
                                                            <label htmlFor="drink_check">
                                                                <input type="checkbox" id="drink_check" name="j_drink" value={values.j_drink} 
                                                                    checked={values.j_drink == "Y" ? true : false}
                                                                    onChange={(e)=>{
                                                                        handleChange(e);
                                                                        if(e.currentTarget.checked){
                                                                            setFieldValue("j_drink","Y");
                                                                        }else{
                                                                            setFieldValue("j_drink","");
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="check"></span>
                                                                <span className="txt f_15">비음주</span>
                                                            </label>
                                                        </div>
                                                        <div className="custom_check">
                                                            <label htmlFor="smok_check">
                                                                <input type="checkbox" id="smok_check" name="j_smok" value={values.smok_check} 
                                                                    checked={values.j_smok == "2" ? true : false}
                                                                    onChange={(e)=>{
                                                                        handleChange(e);
                                                                        if(e.currentTarget.checked){
                                                                            setFieldValue("j_smok","2");
                                                                        }else{
                                                                            setFieldValue("j_smok","");
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="check"></span>
                                                                <span className="txt f_15">비흡연</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex_between tp16">
                                <button type="button" className="btn_refresh" onClick={()=>{
                                    handleReset();
                                    fromReset({setFieldValue});
                                }}>입력 초기화</button>
                                <div className="btn_box2">
                                    <button type="button" className="btn_round2" onClick={closePopHandler}>취소</button>
                                    <button type="button" className="btn_round" onClick={()=>{searchHandler(values)}}>검색</button>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>

        {/* confirm팝업 */}
        {confirm && <ConfirmPop />}
    </>);
};

export default FilterPop;