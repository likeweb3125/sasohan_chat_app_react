import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { selectUser, assiListOn } from '../../store/commonSlice';

const FloatingMember = (props) => {
    const common = useSelector((state)=>state.common);
    const dispatch = useDispatch();
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isSorting
    } = useSortable({id: props.id});
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isSorting ? transition : undefined,
        zIndex: isDragging ? '100' : undefined,
    };

    return(
        <li 
            style={style} 
            ref={setNodeRef} 
            className={common.assiListOn == props.id ? "on" : ""}
            onClick={()=>{
                dispatch(assiListOn(props.id));
                dispatch(
                    selectUser(
                        {
                            room_id:props.data.room_id,
                            idx:props.data.last_idx || props.data.idx,
                            m_id:props.data.m_id, 
                            m_name:props.data.m_name,
                            m_gender:props.data.m_gender,
                            birth:props.data.birth || props.data.m_born,
                            m_address:props.data.m_address,
                        }
                    )
                );
            }}
        >
            <div className="member_box">
                <div className="box flex_between">
                    <div className="flex">
                        <p className={`name ${props.data.m_gender == "2" ? "mem_w" : ""}`}>{props.data.m_name}</p>
                        <p className="age flex">{props.data.m_address}<span>&nbsp;·&nbsp;{props.data.birth}</span></p>
                    </div>
                    <div className='flex lm5'>
                        <button type="button" className="btn_delt" onClick={props.onDeltHandler}>삭제버튼</button>
                        <button type="button" className="btn_dnd" {...attributes} {...listeners}>이동버튼</button>
                    </div>
                </div> 
            </div>
        </li>
    );
};

export default FloatingMember;