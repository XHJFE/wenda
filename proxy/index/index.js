const proxy = require('../base_proxy');
const {
    FIND_TYPE_ALL,
    GET_PROBLEM_ASK_LIST,
    GET_PROMBLEM_FOCUS,
    GET_BELONGER_BY_PAGE,
    SAVE_PROBLEM_ASK,
    FIND_LABEL_ALL,
    GET_FOCUS_ASK_IDS,
    GET_PROMBLEM_ASK,
    GET_PROMBLEM_ANSWER_LIST,
    UPDATE_VIEW_NUM,
    SAVE_PROBLEM_ANSWER,
    GET_PROMBLEM_ANSWER
} = require('../base_url');
const settings = require('../../settings.json')
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

/**
 * 获取关注的问题列表id
 * @param {String} userId 当前用户id
 */
async function getPromblemFocusIds(userId) {
    if (userId) {
        return await proxy({
            uri: GET_FOCUS_ASK_IDS + userId,
            method: 'GET',
            headers,
        });
    } else {
        return {
            data: [],
            msg: '操作成功',
            status: '1'
        }
    }
}

/**
 * 获取经纪人列表
 * @param {Number} page 当前请求页数
 * @param {String} name 当前搜索经纪人名称
 */
async function getBelongerByPage(page, name) {
    return await proxy({
        uri: GET_BELONGER_BY_PAGE,
        method: 'POST',
        headers,
        body: JSON.stringify({
            name,
            page,
            pagesize: 5
        })
    });
}


/**
 * 新增/编辑 提问
 * @param {String} problemTitle 问题标题
 * @param {String} problemContent 问题内容
 * @param {String} questionerId 问题id
 * @param {String} questionerName 提问人名称
 * @param {String} problemLabelId 分类id
 * @param {Array} listProblemInvited 邀请者列表
 * @param {String} cityId 城市id
 */
async function saveProblemAsk(req, param) {
    let {
        listProblemInvited,
        ...other
    } = param
    return await proxy({
        uri: SAVE_PROBLEM_ASK,
        method: 'POST',
        headers,
        body: JSON.stringify({
            ...other,
            listProblemInvited: JSON.parse(listProblemInvited),
            questionerId: req.cookies.xh_userId,
            questionerName: req.cookies.xh_userName,
            cityId: cityId.cityId
        })
    });
}

/**
 * 查询所有问答标签
 */
async function findLabelAll() {
    return await proxy({
        uri: FIND_LABEL_ALL,
        method: 'GET',
        headers
    });
}

/**
 * 获取问答详情
 * @param {String} id 问答id
 */
async function getPromblemInfo(id) {
    return await proxy({
        uri: GET_PROMBLEM_ASK + id,
        method: 'POST',
        headers
    })
}

/**
 * 获取问题下面回答列表
 * @param {Number | String} page 当前查询页数
 * @param {Number | String} pageSize 每页条数
 * @param {Number | String} audit 是否审核通过
 * @param {String} problemAskId 需要查询的问题id
 */
async function getPromblemAnswerList(param = {}) {
    let {
        page,
        pageSize,
        audit,
        ...other
    } = param
    page = page || 0
    pageSize = pageSize || 20
    audit = audit || 1
    return await proxy({
        uri: GET_PROMBLEM_ANSWER_LIST,
        method: 'POST',
        headers,
        body: JSON.stringify({
            page,
            pageSize,
            audit,
            ...other
        })
    })
}

/**
 * 更新浏览量
 * @param {String} askId 需要查询的问题id
 */
async function  updateViewNum(askId) {
    return await proxy({
        uri: UPDATE_VIEW_NUM+askId,
        method: 'POST',
        headers
    })
} 

/**
 * 回答问题
 * @param {String} problemAskId 问题id
 * @param {String} answerContent 回答内容
 * @param {String} answerPersonId 回答者id
 * @param {String} answerPersonName 回答者名字
 */
async function savePromblemAnswer(param) {
    return await proxy({
        uri: SAVE_PROBLEM_ANSWER,
        method: 'POST',
        headers,
        body: JSON.stringify(param)
    })
}

/**
 * 获取问题的单个回答
 * @param {String} 回答id
 */
async function getPromblemAnswer(id) {
    return await proxy({
        uri: GET_PROMBLEM_ANSWER + id,
        method: 'POST',
        headers
    })
}



module.exports = {
    getClassData,
    getNewQuestion,
    getBelongerByPage,
    saveProblemAsk,
    findLabelAll,
    getPromblemFocusIds,
    getPromblemInfo,
    getPromblemAnswerList,
    updateViewNum,
    savePromblemAnswer,
    getPromblemAnswer
};