import { createSlice } from "@reduxjs/toolkit";

const common = createSlice({
    name: "common", //state 이름
    initialState: {
        msgImgs:[],
        msgSend:false,
        newMsgData:{},
        newMsgDataAdmin:{},
        msgViewId:"",
        socketRooms:[],
        selectUser:{},
        filter:false,
        filterData:{},
        searchName:"",
        sort:"",
        pageNo:1,
        pageLastNo:null,
        pageMore:false,
        newList:false,
        groupMsg:false,
    },
    reducers:{
        msgImgs: (state, action) => {
            state.msgImgs = action.payload;
        },
        msgSend: (state, action) => {
            state.msgSend = action.payload;
        },
        newMsgData: (state, action) => {
            state.newMsgData = action.payload;
        },
        newMsgDataAdmin: (state, action) => {
            state.newMsgDataAdmin = action.payload;
        },
        msgViewId: (state, action) => {
            state.msgViewId = action.payload;
        },
        socketRooms: (state, action) => {
            state.socketRooms = action.payload;
        },
        selectUser: (state, action) => {
            state.selectUser = action.payload;
        },
        filter: (state, action) => {
            state.filter = action.payload;
        },
        filterData: (state, action) => {
            state.filterData = action.payload;
        },
        searchName: (state, action) => {
            state.searchName = action.payload;
        },
        sort: (state, action) => {
            state.sort = action.payload;
        },
        pageNo: (state, action) => {
            state.pageNo = action.payload.pageNo;
            state.pageLastNo = action.payload.pageLastNo;
        },
        pageMore: (state, action) => {
            state.pageMore = action.payload;
        },
        newList: (state, action) => {
            state.newList = action.payload;
        },
        groupMsg: (state, action) => {
            state.groupMsg = action.payload;
        },
    }
});

export const { 
    msgImgs, 
    msgSend, 
    newMsgData,
    newMsgDataAdmin,
    msgViewId,
    socketRooms,
    selectUser, 
    filter, 
    filterData, 
    searchName,
    sort,
    pageNo, 
    pageMore, 
    newList,
    groupMsg
} = common.actions;
export default common;