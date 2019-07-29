const {
    getNewQuestion,
    getPersonAnswer,
    getPromblemFocus
} = require('../proxy/index/index');
const util = require('../lib/util');    

module.exports = (req) => {
    const {
        // 经纪人id
        belonger_user_id,
        // 普通用户id
        user_id,
        xh_userId
    } = req.cookies;
    // 当前用户id
    const userId = belonger_user_id || user_id || xh_userId;
    // 获取待回答问题
    const stayAnswerQuestion = getNewQuestion({
        inviteeId: userId,
        pageSize: 10
    })
    // 我提出的问题
    const myQuestion = getNewQuestion({
        questionerId: userId,
        pageSize: 10,
        isAll: true
    })
    // 我回答的问题
    const personAnswer = getPersonAnswer({
        userId,
        isAll: true
    })
    // 我关注的问题
    const focusPromblems = getPromblemFocus({
        userId
    })

    const keys = ['stayAnswerQuestion', 'myQuestion', 'personAnswer', 'focusPromblems'];
    return new Promise((resolve, reject) => {
        Promise.all([stayAnswerQuestion, myQuestion, personAnswer, focusPromblems]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
}