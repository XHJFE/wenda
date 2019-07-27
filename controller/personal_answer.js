const {
    getPromblemInfo,
    getPromblemAnswerList,
    updateViewNum,
    getPromblemFocusIds,
    getPromblemAnswer
} = require('../proxy/index/index');
const util = require('../lib/util');
const { getCityAndMenus } = require('./base');
module.exports = (req, param) => {
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus(req.cookies.siteid);
    // 问题详情
    const promblemInfo = getPromblemInfo(param.id)
    // 问题回答
    const promblemAnswer = getPromblemAnswer(param.answerId)
    // 当前用户已关注的问题id
    const promblemFocusIds = getPromblemFocusIds(req.cookies.xh_userId)
    // 浏览量+1
    const viewNum = updateViewNum(param.id)
    const keys = ['promblemInfo', 'promblemFocusIds', 'viewNum', 'promblemAnswer', ...baseData.keys];
    return new Promise((resolve, reject) => {
        Promise.all([promblemInfo, promblemFocusIds, viewNum, promblemAnswer, ...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
}