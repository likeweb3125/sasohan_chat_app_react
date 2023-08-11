import React from "react";
import { ClipLoader } from "react-spinners";


const LoadingPop = () => {
    return(
        <div className="pop_wrap">
            <ClipLoader
                color="#6840FD"
                size={50}
            />
        </div>
    );
};

export default LoadingPop;