const {
    addFocus,
    removeFocus,
    getUserInfo
} = require('../proxy/base/index');
const {
    getBelongerByPage,
    saveProblemAsk,
    savePromblemAnswer,
    getPromblemAnswerList,
    getNewQuestion,
    getPromblemFocus,
    getPersonAnswer
} = require('../proxy/index/index');
const {
    timestampToTime,
    delHtmlTag
} = require('../lib/util');
const _ = require('underscore');

module.exports = (router) => {
    /**
     * 关注
     */
    router.post('/addFocus', function (req, res, next) {
        if (!req.cookies.xh_userId) {
            res.send({
                status: 506,
                msg: '请登录'
            })
            return
        }
        let {
            askId,
            userId
        } = req.body
        if (!askId || !userId) {
            res.send({
                status: 406,
                msg: '缺少必要参数'
            }) 
            return
        }
        addFocus(req.cookies.xh_userId, askId, userId).then(data => {
            res.send(JSON.parse(data))
        })
    })

    /**
     * 取消关注
     */
    router.post('/removeFocus', function (req, res, next) {
        if (!req.cookies.xh_userId) {
            res.send({
                status: 506,
                msg: '请登录'
            })
            return
        } else {
            removeFocus(req.cookies.xh_userId, req.body.askId).then(data => {
                res.send(JSON.parse(data))
            })
        }
    })

    /**
     * 获取经纪人列表
     */
    router.post('/getBelongerList', function(req, res) {
        getBelongerByPage(req.body.page, req.body.name).then(data => {
            res.send(JSON.parse(data))
        })
    })

    /**
     * 提问
     */
    router.post('/askQuestions', function(req, res) {
        if (req.cookies.xh_userId) {
            saveProblemAsk(req, req.body).then(data => {
                res.send(JSON.parse(data))
            })
        } else {
            res.send({
                status: 506,
                msg: '请登录'
            })
        }
    })

    /**
     * 回答问题
     */
    router.post('/savePromblemAnswer', (req, res) => {
        if (req.cookies.xh_userId) {
            getUserInfo(req.cookies.xh_userId).then(userInfo => {
                userInfo = JSON.parse(userInfo)
                savePromblemAnswer({
                    ...req.body,
                    headImg: userInfo.thumb,
                    answerPersonlevel: userInfo.level,
                    answerPersonId: req.cookies.xh_userId,
                    answerPersonName: req.cookies.xh_userName
                }).then(data => {
                    res.send(JSON.parse(data))
                })
            })
            
        } else {
            res.send({
                status: 506,
                msg: '请登录'
            })
        }
    })

    /**
     * 获取问题列表
     */
    router.get('/answerList', (req, res) => {
        getPromblemAnswerList(req.query).then(data => {
            data = JSON.parse(data)
            data.data.content = _.map(data.data.content, item => {
                item.createDate = timestampToTime(item.createDate)
                return item
            })
            res.send(data)
        })
    })

    /**
     * 获取我的问题
     */
    router.get('/myQuestion', (req, res) => {
        getNewQuestion({
            isAll: true,
            page: req.query.page,
            questionerId: req.cookies.xh_userId
        }).then(data => {
            data = JSON.parse(data)
            data.data.content = data.data.content.map(item => {
                if (item.newProblemAnswer) {
                    item.newProblemAnswer.answerContent = delHtmlTag(item.newProblemAnswer.answerContent)
                }
                item.problemContent = delHtmlTag(item.problemContent)
                return item
            })
            res.send(data)
        })
    })

        /**
     * 获取我的关注
     */
    router.get('/myFocus', (req, res) => {
        getPromblemFocus({
            userId: req.cookies.xh_userId,
            page: req.query.page
        }).then(data => {
            data = JSON.parse(data)
            data.data.content = data.data.content.map(item => {
                if (item.problemAsk.newProblemAnswer) {
                    item.problemAsk.newProblemAnswer.answerContent = delHtmlTag(item.problemAsk.newProblemAnswer.answerContent)
                }
                item.problemAsk.problemContent = delHtmlTag(item.problemAsk.problemContent)
                return item
            })
            res.send(data)
        })
    })

    router.get('/myAnswer', (req, res) => {
        getPersonAnswer({
            page: req.query.page,
            userId: req.cookies.xh_userId
        }).then(data => {
            data = JSON.parse(data)
            data.data.content = data.data.content.map(item => {
                if (item.problemAsk.newProblemAnswer) {
                    item.problemAsk.newProblemAnswer.answerContent = delHtmlTag(item.problemAsk.newProblemAnswer.answerContent)
                }
                item.problemAsk.problemContent = delHtmlTag(item.problemAsk.problemContent)
                return item
            })
            res.send(data)
        })
    })


}

