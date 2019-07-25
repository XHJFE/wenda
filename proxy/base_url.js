const config = require('../config.json');
const env = config.env;
const setting = require('../settings.json')

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
    // 首页广告图
    ADPIC: config.base_server_url[env] + `/web/advert/adpic/get/${setting.cityId}/`,
    // 关注问题
    ADD_FOCUS: config.base_server_url[env] + `/web/problemAsk/addFocus/`,
    // 取消关注问题
    REMOVE_FOCUS: config.base_server_url[env] + `/web/problemAsk/removeFocus`,
}