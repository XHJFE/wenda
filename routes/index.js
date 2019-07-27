const express = require('express');
let router = express.Router();
const apiRouter = require('./api');
const indexController = require('../controller/index');
const classifyController = require('../controller/classify');
const latestController = require('../controller/latest');
const answerController = require('../controller/answer');
const askQuestionsController = require('../controller/ask_questions');
const searchResultController = require('../controller/search_result');
const questionsInfoController = require('../controller/questions_info');
const personalAnswerController = require('../controller/personal_answer');
const {
    cityId
} = require('../settings.json');
const { 
    getStringInImg, 
    delHtmlTag, 
    timestampToTime 
} = require('../lib/util');
const _ = require('underscore');
/**
 * 格式化问答数据
 * @param {Array} arr 当前需要格式化的数组
 * @returns {Array} 返回格式化之后的数组
 */
const questionFormat = (arr) => {
    for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        let imgs = getStringInImg(item.problemContent)
        item.problemContent = delHtmlTag(item.problemContent)
        item.newProblemAnswer && (item.newProblemAnswer.answerContent = delHtmlTag(item.newProblemAnswer.answerContent))
        item.img = (imgs && imgs.length > 0) ? imgs[0] : ''
    }
    return arr
}
 
/**
 * 首页
 */
router.get('/',  (req, res, next) => {
    indexController(req).then(data => {
        let {
            classData,
            newQuestion,
            menus,
            city,
            hotQuestion
        } = data;
        newQuestion.data.content = questionFormat(newQuestion.data.content)
        hotQuestion.data.content = questionFormat(hotQuestion.data.content)
        res.render('index', {
            classData: classData.data,
            newQuestion: newQuestion.data,
            hotQuestion: hotQuestion.data.content,
            city,
            menus,
            currentCityId: req.cookies.siteid || cityId
        })
    }).catch((e) => {
        res.render('error', {
            message: JSON.stringify(e)
        })
    })
});

/**
 * 分类页面
 */
router.get('/classify',  (req, res, next) => {
    classifyController(req).then(data => {
        let {
            classData,
            menus,
            city
        } = data
        res.render('classify', {
            classData: classData.data,
            city,
            menus,
            currentCityId: req.cookies.siteid || cityId
        })
    }).catch((e) => {
        res.render('error', {
            message: JSON.stringify(e)
        })
    })
});

/**
 * 最新问题
 */
router.get('/latest',  (req, res, next) => {
    latestController(req, req.query).then(data => {
        let {
            menus,
            city,
            newQuestion,
            classData,
            hotQuestion,
            newAsk,
            promblemFocusIds
        } = data
        newQuestion.data.content = questionFormat(newQuestion.data.content)
        const focusIds = promblemFocusIds.data
        // 将当前用户已关注的问题id做标记
        newQuestion.data.content = _.map(newQuestion.data.content, child => {
            if (focusIds && focusIds.length > 0) {
                _.each(focusIds, item => {
                    if (item.problemAskId === child.problemAskId) {
                        child.isFocus = true
                    }
                })
            }
            child.isFocus = child.isFocus || false
            return child
        })
            
        res.render('latest', {
            questionList: newQuestion.data,
            classData: classData.data,
            city,
            menus,
            currentCityId: req.cookies.siteid || cityId,
            hotQuestion: hotQuestion.data.content,
            newAsk: newAsk.data.content,
            promblemFocusIds
        })
    }).catch((e) => {
        res.render('error', {
            message: JSON.stringify(e)
        })
    })
});

/**
 * 我的回答
 */
router.get('/answer', (req, res) => {
    answerController(req).then(data => {
        let {
            menus,
            city
        } = data
        res.render('answer', {
            city,
            menus,
            currentCityId: req.cookies.siteid || cityId,
        })
    }).catch((e) => {
        res.render('error', {
            message: JSON.stringify(e)
        })
    })
})

/**
 * 提问
 */
router.get('/ask_questions', (req, res) => {
    askQuestionsController(req).then(data => {
        let {
            menus,
            city,
            belongerList,
            allBabel
        } = data
        res.render('ask_questions', {
            city,
            menus,
            allBabel: allBabel.data,
            currentCityId: req.cookies.siteid || cityId,
            belongerList: belongerList.data
        })
    }).catch((e) => {
        res.render('error', {
            message: JSON.stringify(e)
        })
    })
})

/**
 * 搜索结果
 */
router.get('/search_result', (req, res) => {
    searchResultController(req, req.query).then(data => {
        let {
            menus,
            city,
            question, 
            hotQuestion, 
            newAsk,
            classData
        } = data
        question.data.content = questionFormat(question.data.content)
        res.render('search_result', {
            city,
            menus,
            currentCityId: req.cookies.siteid || cityId,
            classData: classData.data,
            question: question.data,
            hotQuestion: hotQuestion.data.content,
            newAsk: newAsk.data.content,
            isClass: !!req.query.labelName
        })
    }).catch((e) => {
        res.render('error', {
            message: JSON.stringify(e)
        })
    })
})

/**
 * 问答详情
 */
router.get('/questions_info/:id', (req, res) => {
    if (!req.params.id) {
        res.render('error', {
            message: '缺少参数'
        })
        return
    }
    questionsInfoController(req, req.params.id).then(data => {
        let {
            menus,
            city,
            promblemInfo,
            answerList,
            promblemFocusIds
        } = data
        promblemInfo.data.createDate = timestampToTime(promblemInfo.data.createDate)

        const focusIds = promblemFocusIds.data
        if (focusIds && focusIds.length > 0) {
            _.each(focusIds, item => {
                if (item.problemAskId === promblemInfo.data.problemAskId) {
                    promblemInfo.data.isFocus = true
                }
            })
        }
        promblemInfo.data.isFocus = promblemInfo.data.isFocus || false
        answerList.data.content = _.map(answerList.data.content, item => {
            item.createDate = timestampToTime(item.createDate)
            return item
        })
        
        res.render('questions_info', {
            city,
            menus,
            currentCityId: req.cookies.siteid || cityId,
            promblemInfo: promblemInfo.data,
            isLogin: req.cookies.xh_userId,
            answerList: answerList.data,
            userName: req.cookies.xh_userName
        }).catch((e) => {
            res.render('error', {
                message: JSON.stringify(e)
            })
        })
    })
})

/**
 * 个人回答
 */
router.get('/personal_answer', (req, res) => {
    personalAnswerController(req, req.query).then(data => {
        let {
            menus,
            city,
            promblemAnswer,
            promblemInfo,
            promblemFocusIds,
        } = data
        promblemInfo.data.createDate = timestampToTime(promblemInfo.data.createDate)
        promblemAnswer.data.problemAnswer.createDate = timestampToTime(promblemAnswer.data.problemAnswer.createDate)
        const focusIds = promblemFocusIds.data
        if (focusIds && focusIds.length > 0) {
            _.each(focusIds, item => {
                if (item.problemAskId === promblemInfo.data.problemAskId) {
                    promblemInfo.data.isFocus = true
                }
            })
        }
        promblemInfo.data.isFocus = promblemInfo.data.isFocus || false
        res.render('personal_answer', {
            city,
            menus,
            currentCityId: req.cookies.siteid || cityId,
            promblemAnswer: promblemAnswer.data.problemAnswer,
            promblemInfo: promblemInfo.data,
            isLogin: req.cookies.xh_userId,
            userName: req.cookies.xh_userName
        })
    })
    
})

apiRouter(router)
module.exports = router;
