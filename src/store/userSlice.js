import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
    name: "user", //state 이름
    initialState: {
        isLogin:false,
        tokenValue:null,
        managerInfo:{},
        managerSetting:{},
        superManager:false,
        chatPasswordCheck:false,
        chatPassword:'',
    },
    reducers:{
        isLogin: (state, action) => {
            state.isLogin = action.payload;
        },
        tokenValue: (state, action) => {
            state.tokenValue = action.payload;
        },
        managerInfo: (state, action) => {
            state.managerInfo = action.payload;
        },
        managerSetting: (state, action) => {
            state.managerSetting = action.payload;
        },
        superManager: (state, action) => {
            state.superManager = action.payload;
        },
        chatPasswordCheck: (state, action) => {
            state.chatPasswordCheck = action.payload;
        },
        chatPassword: (state, action) => {
            state.chatPassword = action.payload;
        },
    },
});

export const { isLogin, tokenValue, managerInfo, managerSetting, superManager, chatPasswordCheck, chatPassword } = user.actions;
export default user;