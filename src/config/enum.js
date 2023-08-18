const api_uri = "https://api.sasohan.net/";

exports.enum_api_uri = {
    api_uri: `${api_uri}`,

    //매니저
    m_login: `${api_uri}v1/manager-login/:m_id`,
    m_info: `${api_uri}v1/manager/manager-info`,
    m_profile: `${api_uri}v1/manager/manager-profile`,
    m_img_add: `${api_uri}v1/manager/manager-image-add`,
    m_pro_modify: `${api_uri}v1/manager/manager-modify`,
    m_setting: `${api_uri}v1/message-setting/setting`,
    m_limit: `${api_uri}v1/message-setting/limit`,

    //회원
    u_all_count: `${api_uri}v1/user-list/all-count`,
    u_list: `${api_uri}v1/user-list/user-list`,
    u_info: `${api_uri}v1/user-list/user-info/:m_id`,
    u_profile: `${api_uri}v1/user-list/user-profile/:m_id`,
    u_img_add: `${api_uri}v1/user-list/user-image-add`,
    u_nick_check: `${api_uri}v1/user-list/check-nic`,
    u_email_check: `${api_uri}v1/user-list/check-email`,
    u_pro_modify: `${api_uri}v1/user-list/user-profile-modify`,
    u_address: `${api_uri}v1/select-list/address`,
    u_address2: `${api_uri}v1/select-list/address/:parent_local_code`,
    u_select_list: `${api_uri}v1/select-list`,

    //단체메시지
    g_msg_list: `${api_uri}v1/user-list/group-chat`,
    g_msg_list_add: `${api_uri}v1/user-list/group-chat-add`,
    g_msg_send: `${api_uri}v1/group-message/chat-send`,
    g_msg_img_add: `${api_uri}v1/group-message/chat-image-save`,
    g_msg_img_send: `${api_uri}v1/group-message/chat-image-send`,
    
    //메시지
    msg_list: `${api_uri}v1/message/chat-list`,
    assi_list: `${api_uri}v1/message/assisted-list`,
    assi_add: `${api_uri}v1/message/assisted-add`,
    assi_delt: `${api_uri}v1/message/assisted-remove`,
    msg_cont_list: `${api_uri}v1/message/chat-content/:to_id/:last_idx`,
    msg_img_add: `${api_uri}v1/message/chat-image-save`,
    msg_img_send: `${api_uri}v1/message/chat-image-send`,
    msg_send: `${api_uri}v1/message/chat-send`,
    msg_img_list: `${api_uri}v1/message/pic-list/:room_id`,
    msg_img_list_admin: `${api_uri}v1/chat-connect/chat-pic-admin/:room_id`,
    chat_introduce_list: `${api_uri}v1/message/chat-introduce-user/:m_id`,
    chat_connect: `${api_uri}v1/message/chat-introduce-connect`,

    //연결한 대화방
    chat_list: `${api_uri}v1/chat-connect/chat-list`,
    msg_cont_list_admin: `${api_uri}v1/chat-connect/chat-content-admin/:room_id/:last_idx`,
    





}