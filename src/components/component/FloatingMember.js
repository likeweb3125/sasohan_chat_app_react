import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const FloatingMember = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return(
        <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className="member_box">
                <div className="box flex_between">
                    <div className="flex">
                        <p className={`name ${props.data.m_gender == "2" ? "mem_w" : ""}`}>{props.data.m_name}</p>
                        <p className="age">{props.data.m_address}<span> · {props.data.birth}</span></p>
                    </div>
                    <button type="button" className="btn_delt" onClick={props.onDeltHandler}>삭제버튼</button>
                </div> 
            </div>
        </li>
    );
};

export default FloatingMember;