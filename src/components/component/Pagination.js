import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { pageNo, pageNoChange } from "../../store/etcSlice";

const Pagination = (props) => {
    const dispatch = useDispatch();
    const [pageList, setPageList] = useState([]);

    useEffect(()=>{
        setPageList(pageList);
    },[pageList]);

    //페이지리스트 배열로 저장
    useEffect(()=>{
        let arr = [];
        for (let i = props.startPage; i <= props.endPage; i++) {
            arr.push(i);
            setPageList(arr);
        }
    },[props.currentPage]);
    

    return(
        <div className="paging">
            <button type='button' className="btn_prev btn_paging" onClick={props.onPrevPaging}>이전페이지</button>
            {props.endPage > 1 ?
                pageList && pageList.map((num,i)=>{
                    return(
                        <button type="button" key={i} 
                            className={props.currentPage === num ? "on" : ""}
                            onClick={()=>{props.onMovePage(num)}}
                        >{num}</button>
                    );
                })
                :props.endPage === 1 && <button type="button" className="on">1</button>
            }
            <button type='button' className="btn_next btn_paging" onClick={props.onNextPaging}>다음페이지</button>
        </div>
    );
};

export default Pagination;