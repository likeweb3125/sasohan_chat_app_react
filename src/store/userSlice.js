import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
    name: "user", //state 이름
    initialState: {
        isLogin:false,
        managerInfo:{},
        managerSetting:{},
        
    },
    reducers:{
        isLogin: (state, action) => {
            state.isLogin = action.payload;
        },
        managerInfo: (state, action) => {
            state.managerInfo = action.payload;
        },
        managerSetting: (state, action) => {
            state.managerSetting = action.payload;
        },
        
    },
});

export const { isLogin, managerInfo, managerSetting } = user.actions;
export default user;