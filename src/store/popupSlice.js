import { createSlice } from "@reduxjs/toolkit";

const popup = createSlice({
    name: "popup", //state 이름
    initialState: {
        //안내,알림 팝업
        confirmPop: false,
        confirmPopTit: "",
        confirmPopTxt: "",
        confirmPopBtn: "",

        //회원정보 팝업
        memPop: false,
        memPopId: "",
        memPopPosition:[],

        //회원정보상세 팝업
        memInfoPop: false,

        //사진모아보기팝업
        imgPop: false,
        imgPopList: [],
        imgPopIdx: null,

        //사진모아보기 리스트팝업
        imgListPop: false,
        imgListPopAdmin: false,

        //대화방연결 팝업
        chatPop: false,

        //단체메시지 팝업
        messagePop: false,
        messagePopList:[],
        messagePopDeltList:[],

        //단체메시지 회원 추가,삭제 팝업
        memCheckPop: false,
        memCheckPopTit: "",
        memCheckPopList: [],
        //단체메시지 회원 추가,삭제 팝업 체크리스트
        memCheckPopCheckList: [],

        //조건검색기 팝업
        filterPop: false,
        
        //매니저프로필 팝업
        managerProfilePop: false,
        managerProfilePopPosition:[],

        //로딩팝업
        loadingPop: false,
    },
    reducers:{
        // 공통 -----------------------------------
        confirmPop: (state, action) => {
            state.confirmPop = action.payload.confirmPop;
            state.confirmPopTit = action.payload.confirmPopTit;
            state.confirmPopTxt = action.payload.confirmPopTxt;
            state.confirmPopBtn = action.payload.confirmPopBtn;
        },
        memPop: (state, action) => {
            state.memPop = action.payload.memPop;
            state.memPopId = action.payload.memPopId;
        },
        memPopPosition: (state, action) => {
            state.memPopPosition = action.payload;
        },
        memInfoPop: (state, action) => {
            state.memInfoPop = action.payload;
        },
        imgPop: (state, action) => {
            state.imgPop = action.payload.imgPop;
            state.imgPopList = action.payload.imgPopList;
            state.imgPopIdx = action.payload.imgPopIdx;
        },
        imgListPop: (state, action) => {
            state.imgListPop = action.payload.imgListPop;
            state.imgListPopAdmin = action.payload.imgListPopAdmin;
        },
        chatPop: (state, action) => {
            state.chatPop = action.payload;
        },
        messagePop: (state, action) => {
            state.messagePop = action.payload;
        },
        messagePopList: (state, action) => {
            state.messagePopList = action.payload;
        },
        messagePopDeltList: (state, action) => {
            state.messagePopDeltList = action.payload;
        },
        memCheckPop: (state, action) => {
            state.memCheckPop = action.payload.memCheckPop;
            state.memCheckPopTit = action.payload.memCheckPopTit;
            state.memCheckPopList = action.payload.memCheckPopList;
        },
        memCheckPopCheckList: (state, action) => {
            state.memCheckPopCheckList = action.payload;
        },
        filterPop: (state, action) => {
            state.filterPop = action.payload;
        },
        managerProfilePop: (state, action) => {
            state.managerProfilePop = action.payload;
        },
        managerProfilePopPosition: (state, action) => {
            state.managerProfilePopPosition = action.payload;
        },
        loadingPop: (state, action) => {
            state.loadingPop = action.payload;
        },
    }
});

export const {
    confirmPop, 
    memPop,
    memPopPosition,
    memInfoPop,
    imgPop,
    imgListPop,
    chatPop,
    messagePop,
    messagePopList,
    messagePopDeltList,
    memCheckPop,
    memCheckPopCheckList,
    filterPop,
    managerProfilePop,
    managerProfilePopPosition,
    loadingPop
} = popup.actions;
export default popup;