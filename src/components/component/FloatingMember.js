const FloatingMember = (props) => {
    return(
        <div className="member_box">
            <div className="box flex_between">
                <div className="flex">
                    <p className={`name ${props.data.m_gender == "2" ? "mem_w" : ""}`}>{props.data.m_name}</p>
                    <p className="age">{props.data.m_address}<span> · {props.data.birth}</span></p>
                </div>
                <button type="button" className="btn_delt" onClick={props.onDeltHandler}>삭제버튼</button>
            </div> 
        </div>
    );
};

export default FloatingMember;