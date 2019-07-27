const config = require('../config.json');
const env = config.env;

module.exports = {
    // 公用请求头
    HEADER: {
        "Content-Type": "application/json;charset=UTF-8",
        "Accept": "application/json, text/javascript, */*; q=0.01"
    },
    // 城市列表
    CITY: config.proxy_server_url[env] + '/web/city/findSort/',
    // 分类
    FIND_TYPE_ALL: config.base_server_url[env] + '/web/problemType/findTypeAll/',
    // 获取最新问题
    GET_PROBLEM_ASK_LIST: config.base_server_url[env] + '/web/problemAsk/getProblemAskList/',
    // 导航栏菜单数据
    SITE_CHALLEL: config.proxy_server_url[env] + '/web/channel/siteChannel/',
    // 关注问题
    ADD_FOCUS: config.base_server_url[env] + `/web/problemAsk/addFocus/`,
    // 取消关注问题
    REMOVE_FOCUS: config.base_server_url[env] + `/web/problemAsk/removeFocus/`,
    // 关注的问题列表
    GET_PROMBLEM_FOCUS: config.base_server_url[env] + `/web/problemAsk/getProblemFocus/`,
    // 获取经纪人列表
    GET_BELONGER_BY_PAGE: config.base_server_url[env] + `/web/problemAsk/getBelongerByPage/`,
    // 提问
    SAVE_PROBLEM_ASK: config.base_server_url[env] + `/web/problemAsk/saveProblemAsk/`,
    // 查询标签
    FIND_LABEL_ALL: config.base_server_url[env] + `/web/problemType/findLabelAll/`,
    // 获取用户已关注的问题
    GET_FOCUS_ASK_IDS: config.base_server_url[env] + `/web/problemAsk/getFocusAskId/`,
    // 获取相关问题详情
    GET_PROMBLEM_ASK: config.base_server_url[env] + `/web/problemAsk/getProblemAsk/`,
    // 获取问题下面的回答
    GET_PROMBLEM_ANSWER_LIST: config.base_server_url[env] + `/web/problemAnswer/getProblemAnswerList/`,
    // 浏览量+1
    UPDATE_VIEW_NUM: config.base_server_url[env] + `/web/problemAsk/updateViewNum/`,
    // 回答某个问题
    SAVE_PROBLEM_ANSWER: config.base_server_url[env] + `/web/problemAnswer/saveProblemAnswer/`,
    // 获取问题的单个回答
    GET_PROMBLEM_ANSWER: config.base_server_url[env] + `/web/problemAnswer/getProblemAnswer/`,
    // 获取相似问题
    GET_ALIKE_PROBLE_ASK: config.base_server_url[env] + `/web//problemAsk/getAlikeProbleAsk/`,
}