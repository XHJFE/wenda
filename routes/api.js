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
    delHtmlTag,
    getUser
} = require('../lib/util');
const _ = require('underscore');

module.exports = (router) => {
    /**
     * 关注
     */
    router.post('/addFocus', function (req, res) {
        const user = getUser(req.cookies);
        if (!user.userId) {
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
        // 自己不能关注自己的问题
        if (user.userId === userId) {
            res.send({
                status: 406,
                msg: '您不能关注自己的问题哦'
            }) 
            return
        }
        if (!askId || !userId) {
            res.send({
                status: 406,
                msg: '缺少必要参数'
            }) 
            return
        }
        addFocus(user.userId, askId).then(data => {
            res.send(JSON.parse(data))
        })
    })

    /**
     * 取消关注
     */
    router.post('/removeFocus', function (req, res) {
        const { userId } = getUser(req.cookies);
        if (!userId) {
            res.send({
                status: 506,
                msg: '请登录'
            })
            return
        }
        removeFocus(userId, req.body.askId).then(data => {
            res.send(JSON.parse(data))
        })
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
        const { userId, type } = getUser(req.cookies);
        if (!userId) {
            res.send({
                status: 506,
                msg: '请登录'
            })
            return
        }
        getUserInfo(userId, type).then(userInfo => {
            if (!userInfo) {
                res.send({
                    status: 507,
                    msg: '用户信息错误'
                })
                return
            }
            userInfo = JSON.parse(userInfo)
            saveProblemAsk(req, {
                ...req.body,
                askPersonlevel: userInfo.level
            }).then(data => {
                res.send(JSON.parse(data))
            })
        })
    })

    /**
     * 回答问题
     */
    router.post('/savePromblemAnswer', (req, res) => {
        const { userId, userName, type } = getUser(req.cookies);
        if (!userId) {
            res.send({
                status: 506,
                msg: '请登录'
            })
            return
        }
        getUserInfo(userId, type).then(userInfo => {
            if (!userInfo) {
                res.send({
                    status: 507,
                    msg: '用户信息错误'
                })
                return
            }
            userInfo = JSON.parse(userInfo)
            savePromblemAnswer({
                ...req.body,
                headImg: userInfo.portrait || userInfo.thumb,
                answerPersonlevel: userInfo.level,
                answerPersonId: userId,
                answerPersonName: userName
            }).then(data => {
                res.send(JSON.parse(data))
            })
        })
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
        const { userId } = getUser(req.cookies);
        getNewQuestion({
            isAll: true,
            page: req.query.page,
            questionerId: userId,
            pageSize: 10
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
        const { userId } = getUser(req.cookies);
        if (!userId) {
            res.send({
                status: 506,
                msg: '请登录'
            })
            return
        }
        getPromblemFocus({
            userId: userId,
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
    /**
     * 获取我的回答
     */
    router.get('/myAnswer', (req, res) => {
        
        const { userId } = getUser(req.cookies);
        getPersonAnswer({
            page: req.query.page,
            userId: userId
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

    /**
     * 待回答
     */
    router.get('/stayAnswer', (req, res) => {
        getNewQuestion({
            inviteeId: req.cookies.belonger_user_id,
            pageSize: 10,
            page: req.query.page
        }).then(data => {
            data = JSON.parse(data);
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
}

