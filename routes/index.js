const express = require('express');
let router = express.Router();
const apiRouter = require('./api');
const indexController = require('../controller/index');
const classifyController = require('../controller/classify');
const latestController = require('../controller/latest')
const answerController = require('../controller/answer')
const askQuestionsController = require('../controller/ask_questions')
const searchResultController = require('../controller/search_result')
const settings = require('../settings.json');
const { getStringInImg, delHtmlTag } = require('../lib/util');


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
        item.img = (imgs && imgs.length > 0) ? imgs[0] : ''
    }
    return arr
}

const updateUserInfo = (req, res, next) => {
    let {
        xh_userId,
        xh_userName
    } = req.cookies
    let isLogin = xh_userId ? true : false 
    global.user = {
        xh_userId,
        xh_userName,
        isLogin
    }
    next()
}

router.get('*',updateUserInfo)


router.post('*', updateUserInfo)
 
/**
 * 首页
 */
router.get('/',  (req, res, next) => {
    indexController().then(data => {
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
            currentCity: settings
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
    classifyController().then(data => {
        let {
            classData,
            menus,
            city
        } = data
        res.render('classify', {
            classData: classData.data,
            city,
            menus,
            currentCity: settings
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
    latestController(req.query).then(data => {
        let {
            menus,
            city,
            newQuestion,
            classData,
            hotQuestion,
            newAsk
        } = data
        newQuestion.data.content = questionFormat(newQuestion.data.content)        
        res.render('latest', {
            questionList: newQuestion.data,
            classData: classData.data,
            city,
            menus,
            currentCity: settings,
            hotQuestion: hotQuestion.data.content,
            newAsk: newAsk.data.content
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
    answerController().then(data => {
        let {
            menus,
            city
        } = data
        res.render('answer', {
            city,
            menus,
            currentCity: settings,
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
    askQuestionsController().then(data => {
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
            currentCity: settings,
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
    searchResultController(req.query.keyword).then(data => {
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
            currentCity: settings,
            classData: classData.data,
            question: question.data,
            hotQuestion: hotQuestion.data.content,
            newAsk: newAsk.data.content
        })
    }).catch((e) => {
        res.render('error', {
            message: JSON.stringify(e)
        })
    })
})

apiRouter(router)
module.exports = router;
