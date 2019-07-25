let proxy = require('../base_proxy');
let util = require('../../lib/util');
let config = require('../../config.json');
let env = config.env;

/**
 * 获取城市基础信息
 * @param cityId
 * @returns {Promise.<*>}
 */
async function getCityInfo(cityId) {
    let data = await proxy({
        uri: config.base_server_url[env] + '/web/housePrice/area/city',
        method: 'POST',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json, text/javascript, */*; q=0.01"
        },
        body: JSON.stringify({cityId: cityId})
    });
    return data;
}

/**
 * 获取分类列表
 * @returns {Promise.<*>}
 */
async function getClassData() {
    let data = await proxy({
        uri: config.base_server_url[env] + '/web/problemType/findTypeAll',
        method: 'GET',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json, text/javascript, */*; q=0.01"
        }
    });
    return data;
}

/**
 * 获取最新问题
 * @param {Number} param.page 当前请求页数
 * @param {Number} param.pagesize 每页请求条数
 * @param {Number} param.audit 是否审核 1：审核 0：其他
 * @param {String} param.inviteeId 邀请回答人id
 * @param {String} param.problemTitle 问题标题
 * @param {String} param.problemContent 问题内容
 * @param {String} param.labelName 标签名称
 * @param {String} param.questionerId 提问人id
 * @returns Promise
 */
async function getNewQuestion(param = {}) {
    let {
        page = 0,
        pagesize = 10,
        audit = 1,
        ...other
    } = param
    let data = await proxy({
        uri: config.base_server_url[env] + '/web/problemAsk/getProblemAskList',
        method: 'POST',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json, text/javascript, */*; q=0.01"
        },
        body: JSON.stringify({
            page,
            pagesize,
            audit,
            ...other
            // inviteeId: "",
            // problemTitle: "问题标题",
            // problemContent: "问题补充",
            // labelName: "标签名称",
            // questionerId: "提问人id",
        })
    });
    return data;
}

module.exports = {
    getCityInfo,
    getClassData,
    getNewQuestion
};