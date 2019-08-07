const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const indexController = require('../controller/index');
const juheController = require('../controller/juhe');
const wentikuController = require('../controller/wentiku');
const tiwenController = require('../controller/tiwen');
const searchResultController = require('../controller/search_result');
const questionsInfoController = require('../controller/questions_info');
const personalAnswerController = require('../controller/personal_answer');
const personalCenterController = require('../controller/personal_center');
var config = require('../config.json');
const { 
    getUser,
    noPassByMobile
} = require('../lib/util');
const _ = require('underscore');


router.use((req, res, next) => {
  	const { type } = getUser(req.cookies);
  	// 如果当前是经纪人
  	if (type == 1) {
      	// 如果当前是长沙的经纪人 
        if (req.cookies.siteid || req.cookies.siteid == 1) {
			res.locals.member = config.belonger[config.env][0]
		// 其他城市的经纪人
        } else {
            res.locals.member = config.belonger[config.env][1]
        }
	} else {
		res.locals.member = config.member[config.env];
	}
	next();
})

/**
 * 首页
 */
router.get('/',  (req, res) => {
    return indexController(req).then(data => {
        let {
            classData,
            newQuestion,
            menus,
            city,
            hotQuestion
        } = data;
        return res.render('index', {
            classData: classData.data,
            newQuestion: newQuestion.data,
            hotQuestion: hotQuestion.data.content,
            city: city.city,
            currentCityName: city.name,
            menus
        })
    }).catch((e) => {
        return res.render('error', {
            message: JSON.stringify(e.message)
        })
    })
});

/**
 * 分类页面
 */
router.get('/juhe',  (req, res) => {
    return juheController(req).then(data => {
        let {
            classData,
            menus,
            city
        } = data
        return res.render('juhe', {
            classData: classData.data,
            city: city.city,
            currentCityName: city.name,
            menus
        })
    }).catch((e) => {
        return res.render('error', {
            message: JSON.stringify(e.message)
        })
    })
});

/**
 * 问答动态
 */
router.get('/wentiku',  (req, res) => {
    const {userId} = getUser(req.cookies);
    return wentikuController(req, {
        ...req.query,
        userId
    }).then(data => {
        let {
            menus,
            city,
            newQuestion,
            classData,
            hotQuestion,
            newAsk,
            promblemFocusIds
        } = data
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
        
            
        return res.render('wentiku', {
            questionList: newQuestion.data,
            classData: classData.data,
            menus,
            city: city.city,
            currentCityName: city.name,
            hotQuestion: hotQuestion.data.content,
            newAsk: newAsk.data.content,
            promblemFocusIds,
            isLogin: !!userId
        })
    }).catch((e) => {
        return res.render('error', {
            message: JSON.stringify(e.message)
        })
    })
});

/**
 * 提问
 */
router.get('/tiwen', (req, res) => {
    return tiwenController(req).then(data => {
        let {
            menus,
            city,
            belongerList,
            allBabel
        } = data
        return res.render('tiwen', {
            city: city.city,
            currentCityName: city.name,
            menus,
            allBabel: allBabel.data,
            belongerList: belongerList.data
        })
    }).catch((e) => {
        return res.render('error', {
            message: JSON.stringify(e.message)
        })
    })
})

/**
 * 搜索结果
 */
router.get('/search_result', (req, res) => {
    return searchResultController(req, req.query).then(data => {
        let {
            menus,
            city,
            question, 
            hotQuestion, 
            newAsk,
            classData
        } = data
        const {userId} = getUser(req.cookies);
        return res.render('search_result', {
            city: city.city,
            currentCityName: city.name,
            menus,
            classData: classData.data,
            question: question.data,
            hotQuestion: hotQuestion.data.content,
            newAsk: newAsk.data.content,
            bigLabel: req.query.bigLabel,
            labelName: req.query.label,
            problemTitle: unescape(req.query.problemTitle),
            isLogin: !!userId
        })
    }).catch((e) => {
        return res.render('error', {
            message: JSON.stringify(e.message)
        })
    })
})

/**
 * 问答详情
 */
router.get('/xq/:id', (req, res) => {
    if (!req.params.id) {
        return res.render('error', {
            message: '缺少参数'
        })
    }
    if (req.query.city) {
        res.cookie("siteid", req.query.city,{maxAge: 900000});
        req.cookies.siteid = req.query.city
    }
    id = req.params.id.replace('.html', '');
    return questionsInfoController(req, id).then(data => {
        let {
            menus,
            city,
            promblemInfo,
            answerList,
            promblemFocusIds,
            alikeProbleAsk
        } = data;
        const focusIds = promblemFocusIds.data;
        const { userId, userName } = getUser(req.cookies);
        if (focusIds && focusIds.length > 0) {
            _.each(focusIds, item => {
                if (item.problemAskId === promblemInfo.data.problemAskId) {
                    promblemInfo.data.isFocus = true;
                }
            });
        }
        promblemInfo.data.isFocus = promblemInfo.data.isFocus || false;        
        return res.render('questions_info', {
            city: city.city,
            currentCityName: city.name,
            menus,
            promblemInfo: promblemInfo.data,
            isLogin: !!userId,
            answerList: answerList.data,
            userName: noPassByMobile(userName),
            alikeProbleAsk: alikeProbleAsk.data
        })
    }).catch((e) => {
        return res.render('error', {
            message: JSON.stringify(e.message)
        })
    })
})

/**
 * 个人回答
 */
router.get('/personal_answer', (req, res) => {
    if (req.query.city) {
        res.cookie("siteid", req.query.city,{maxAge: 900000});
        req.cookies.siteid = req.query.city
    }
    return personalAnswerController(req, req.query).then(data => {
        let {
            menus,
            city,
            promblemAnswer,
            promblemFocusIds,
            alikeProbleAsk
        } = data;
        const focusIds = promblemFocusIds.data;
        const { userId, userName } = getUser(req.cookies);
        if (focusIds && focusIds.length > 0) {
            _.each(focusIds, item => {
                if (item.problemAskId === promblemAnswer.data.problemAnswer.problemAsk.problemAskId) {
                    promblemAnswer.data.problemAnswer.problemAsk.isFocus = true
                }
            });
        }
        
        promblemAnswer.data.problemAnswer.problemAsk.isFocus = promblemAnswer.data.problemAnswer.problemAsk.isFocus || false;
        return res.render('personal_answer', {
            city: city.city,
            currentCityName: city.name,
            menus,
            promblemAnswer: promblemAnswer.data.problemAnswer,
            promblemInfo: promblemAnswer.data.problemAnswer.problemAsk,
            isLogin: !!userId,
            userName: noPassByMobile(userName),
            alikeProbleAsk: alikeProbleAsk.data,
            isMine: req.query.entry === 'center'
        })
    }).catch((e) => {
        return res.render('error', {
            message: JSON.stringify(e.message)
        })
    })
})

/**
 * 个人中心
 */
router.get('/personal_center', (req, res) => {
    let {
        belonger_user_id,
        belonger_user_name,
        xh_userId,
        xh_userName
    } = req.query;
    // 跳转到个人中心有带经纪人id，则把经纪人信息存到cookies
    if (belonger_user_id) {
        res.cookie("belonger_user_id",belonger_user_id,{maxAge: 900000, httpOnly: true});
        res.cookie("belonger_user_name",belonger_user_name,{maxAge: 900000, httpOnly: true});
        req.cookies.belonger_user_id = belonger_user_id
        req.cookies.belonger_user_name = belonger_user_name
    // 跳转到个人中心有带客户id，则把客户信息存到cookies
    } else if (xh_userId) {
        res.cookie("xh_userId",xh_userId,{maxAge: 900000, httpOnly: true});
        res.cookie("xh_userName",xh_userName,{maxAge: 900000, httpOnly: true});
        req.cookies.xh_userId = xh_userId
        req.cookies.xh_userName = xh_userName
    }
    const { type } = getUser(req.cookies);
    return personalCenterController(req).then(data => {
        let {
            stayAnswerQuestion,
            myQuestion,
            personAnswer, 
            focusPromblems,
            focusPromblemIds
        } = data      
        const focusIds = focusPromblemIds.data;  
        // 将当前用户已关注的问题id做标记
        stayAnswerQuestion.data.content = _.map(stayAnswerQuestion.data.content, child => {
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
        return res.render('personal_center', {
            stayAnswerQuestion: stayAnswerQuestion.data,
            myQuestion: myQuestion.data,
            personAnswer: personAnswer.data, 
            focusPromblems: focusPromblems.data,
            userType: type,
            tab: req.query.tab
        })
    }).catch((e) => {
        return res.render('error', {
            message: JSON.stringify(e.message)
        })
    })
    
})

apiRouter(router)
module.exports = router;
