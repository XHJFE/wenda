const {
    updateViewNum,
    getPromblemFocusIds,
    getPromblemAnswer,
    getAlikeProbleAsk
} = require('../proxy/index/index');
const util = require('../lib/util');
const { getCityAndMenus } = require('./base');
module.exports = (req, param) => {
    const { userId } = util.getUser(req.cookies);
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus(req.cookies.siteid);
    // 问题回答
    const promblemAnswer = getPromblemAnswer(param.answerId)
    // 当前用户已关注的问题id
    const promblemFocusIds = getPromblemFocusIds(userId);
    // 获取相似问题
    const alikeProbleAsk = getAlikeProbleAsk(param.id);
    // 浏览量+1
    const viewNum = updateViewNum(param.id);
    const keys = ['promblemFocusIds', 'viewNum', 'promblemAnswer', 'alikeProbleAsk', ...baseData.keys];
    return new Promise((resolve, reject) => {
        Promise.all([promblemFocusIds, viewNum, promblemAnswer, alikeProbleAsk, ...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
}