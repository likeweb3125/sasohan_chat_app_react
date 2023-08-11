const SearchBox = (props) => {

    return(
        <div className="search_box">
            <div className="custom_input">
                <input type={"text"} 
                    placeholder={props.placeholder}
                    value={props.searchValue}
                    onChange={props.onChangeHandler}
                    onKeyDown={(e)=>{
                        if(e.key === "Enter") {
                            e.preventDefault();
                            props.onSearchHandler();
                        }
                    }}
                />
            </div>
            <button className="btn_search" onClick={props.onSearchHandler}>검색버튼</button>
        </div>
    );
};

export default SearchBox;