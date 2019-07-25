const express = require('express');
let router = express.Router();
const apiRouter = require('./api');
const indexController = require('../controller/index');
const classifyController = require('../controller/classify');
const latestController = require('../controller/latest')
const answerController = require('../controller/answer')
const askQuestionsController = require('../controller/ask_questions')
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
            adPic
        } = data;
        newQuestion.data.content = questionFormat(newQuestion.data.content)
        res.render('index', {
            classData: classData.data,
            newQuestion: newQuestion.data,
            adPic,
            city,
            menus,
            currentCity: settings
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
            belongerList
        } = data
        console.log(belongerList)
        res.render('ask_questions', {
            city,
            menus,
            currentCity: settings,
            belongerList: belongerList.data
        })
    })
})


apiRouter(router)

module.exports = router;
