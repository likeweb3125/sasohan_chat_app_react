import React from "react";
import { ClipLoader } from "react-spinners";


const LoadingPop = () => {
    return(
        <div className="pop_wrap loading_pop">
            <div className="box">
                <ClipLoader
                    color="#6840FD"
                    size={50}
                />
            </div>
        </div>
    );
};

export default LoadingPop;