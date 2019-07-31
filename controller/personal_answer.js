const {
    updateViewNum,
    getPromblemFocusIds,
    getPromblemAnswer,
    getAlikeProbleAsk
} = require('../proxy/index/index');
const util = require('../lib/util');
const { getCityAndMenus } = require('./base');
module.exports = async (req, param) => {
    const { userId } = util.getUser(req.cookies);
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus(req.cookies.siteid);
    return new Promise((resolve, reject) => {
        // 问题回答
        getPromblemAnswer(param.answerId).then(data => {
            data= JSON.parse(data);
            let askId = data.data.problemAnswer.problemAskId;
            // 当前用户已关注的问题id
            const promblemFocusIds = getPromblemFocusIds(userId);
            // 获取相似问题
            const alikeProbleAsk = getAlikeProbleAsk(askId);
            // 浏览量+1
            const viewNum = updateViewNum(askId);
            const keys = ['promblemFocusIds', 'viewNum', 'alikeProbleAsk', ...baseData.keys];
            
            Promise.all([promblemFocusIds, viewNum, alikeProbleAsk, ...baseData.values]).then(result => {
                resolve({
                    ...util.getResult(keys, result),
                    promblemAnswer: data
                });
            }).catch(e => {
                reject(e);
            });
        })
    })
}