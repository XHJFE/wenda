const proxy = require('../base_proxy');
const {
    FIND_TYPE_ALL,
    GET_PROBLEM_ASK_LIST
} = require('../base_url');
const headers = {
    "Content-Type": "application/json;charset=UTF-8",
    "Accept": "application/json, text/javascript, */*; q=0.01"
}

/**
 * 获取分类列表
 * @returns {Promise.<*>}
 */
async function getClassData() {
    let data = await proxy({
        uri: FIND_TYPE_ALL,
        method: 'GET',
        headers
    });
    return data;
}

/**
 * 获取最新问题
 * @param {Number} param.page 当前请求页数
 * @param {Number} param.pagesize 每页请求条数
 * @param {Number} param.audit 是否审核 1：审核 0：其他
 * @param {String} param.sortViewNum 按浏览量排序
 * @param {String} param.sortUpdateDate 按更新时间排序
 * @param {String} param.inviteeId 邀请回答人id
 * @param {String} param.problemTitle 问题标题
 * @param {String} param.problemContent 问题内容
 * @param {String} param.labelName 标签名称
 * @param {String} param.questionerId 提问人id
 * @returns Promise
 */
async function getNewQuestion(param = {}) {
    let {
        page,
        pagesize,
        audit,
        ...other
    } = param;
    page = page ? page - 1 : 0
    pagesize = pagesize || 20
    audit = audit || 1
    let data = await proxy({
        uri: GET_PROBLEM_ASK_LIST,
        method: 'POST',
        headers,
        body: JSON.stringify({
            page,
            pagesize,
            audit,
            ...other
        })
    });
    return data;
}



module.exports = {
    getClassData,
    getNewQuestion
};