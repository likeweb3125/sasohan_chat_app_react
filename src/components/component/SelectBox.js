import { useEffect, useState } from "react";
import * as CF from "../../config/function";

const SelectBox = (props) => {
    const [list, setList] = useState([]);

    useEffect(()=>{
        setList(props.list);
    },[props.list]);

    return(
        <div className="custom_select">
            <select 
                value={props.selected}
                onChange={props.onChangeHandler}
                name={props.name}
            >
                <option value="" hidden={props.selHidden}>선택</option>
                {list.map((val,i)=>{
                    return(
                        props.objectSel ? //셀렉트박스 값 리스트가 객체일때
                            <option value={val.name} key={i}>{val.name}</option>
                        :   <option value={val} key={i}>{props.listType == "number" ? CF.MakeIntComma(val) : val}</option>
                    );
                })}
            </select>
        </div>
    );
};

export default SelectBox;