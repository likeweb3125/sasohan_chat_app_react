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

        //대화방연결 팝업 - 툴팁 팝업
        tooltipPop: false,
        tooltipPopPosition:[],
        tooltipPopData:{},

        //단체메시지 팝업
        messagePop: false,
        messagePopAllCount:0,
        messagePopList:[],
        messagePopDeltList:[],
        messagePopAddList:[],
        messagePopSearch:"",
        messagePopSort:"",

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

        //연결한대화방 채팅내역 비밀번호입력 팝업
        chatPasswordCheckPop: false,
        chatPasswordCheckPopSelectUser: {},
        chatPasswordCheckPopClose: false,

        //결정의날알림로그 팝업
        notiLogPop: false,

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
        tooltipPop: (state, action) => {
            state.tooltipPop = action.payload.tooltipPop;
            state.tooltipPopPosition = action.payload.tooltipPopPosition;
            state.tooltipPopData = action.payload.tooltipPopData;
        },
        messagePop: (state, action) => {
            state.messagePop = action.payload;
        },
        messagePopAllCount: (state, action) => {
            state.messagePopAllCount = action.payload;
        },
        messagePopList: (state, action) => {
            state.messagePopList = action.payload;
        },
        messagePopDeltList: (state, action) => {
            state.messagePopDeltList = action.payload;
        },
        messagePopAddList: (state, action) => {
            state.messagePopAddList = action.payload;
        },
        messagePopSearch: (state, action) => {
            state.messagePopSearch = action.payload;
        },
        messagePopSort: (state, action) => {
            state.messagePopSort = action.payload;
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
        chatPasswordCheckPop: (state, action) => {
            state.chatPasswordCheckPop = action.payload;
        },
        chatPasswordCheckPopSelectUser: (state, action) => {
            state.chatPasswordCheckPopSelectUser = action.payload;
        },
        chatPasswordCheckPopClose: (state, action) => {
            state.chatPasswordCheckPopClose = action.payload;
        },
        notiLogPop: (state, action) => {
            state.notiLogPop = action.payload;
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
    tooltipPop,
    messagePop,
    messagePopAllCount,
    messagePopList,
    messagePopDeltList,
    messagePopAddList,
    messagePopSearch,
    messagePopSort,
    memCheckPop,
    memCheckPopCheckList,
    filterPop,
    managerProfilePop,
    managerProfilePopPosition,
    chatPasswordCheckPop,
    chatPasswordCheckPopSelectUser,
    chatPasswordCheckPopClose,
    notiLogPop,
    loadingPop
} = popup.actions;
export default popup;