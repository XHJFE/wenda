/**
 * 模板解析，解析{}包裹的数据
 * @param tpl 模板
 * @param data  数据
 * @returns {XML|string|void}
 */
function format(tpl, data) {
    return tpl.replace(/{([^\}]+)}/g, function (v, v1) {
        return data.hasOwnProperty(v1) ? data[v1] : v || '';
    });
}

/**
 * 时间戳格式化
 * @param {String} timestamp 需要格式化的时间戳
 * @returns {String} 返回格式化后的时间
 */
function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000 var date = new Date(timestamp*1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    D = D >= 10 ? D : '0' + D;
    h = h >= 10 ? h : '0' + h;
    m = m >= 10 ? m : '0' + m;
    s = s >= 10 ? s : '0' + s;
    
    return Y + M + D + h + ':' + m + ':' +s;
}

/**
 * 将手机号加密处理
 */
function noPassByMobile(str) {
    if (!str) {
        return str;
    }
    // 手机号校验正则
    var mobileReg = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
    var pat=/(\d{3})\d*(\d{4})/;
    if (!mobileReg.test(str)) {
        return str;
    }
    return str.replace(pat, '$1****$2');
}

/**
 * 获取JSON对象
 * @param obj
 */
function getJSON(obj) {
    let r;
    try {
        if (typeof obj === 'string') {
            r = JSON.parse(obj);
        }
        else {
            r = obj;
        }
    }
    catch (e) {
        r = {};
    }
    return r;
}

/**
 * 还原html转义字符
 * @param str
 */
function decodeHtml(str) {
    var rule = [/(&lt;)/g, '<', /(&gt;)/g, '>', /(&amp;)/g, '&'];
    for (var i = 0; i < rule.length; i += 2) {
        str.replace(rule[i], rule[i + 1]);
    }
    return str;
}

/**
 * 耗时统计类
 */
function statTimeCost() {
    this._startTime = 0;
    this._endTime = 0;
    this.start.apply(this);
}
/**
 * 耗时统计类原型
 * @type {{}}
 */
statTimeCost.prototype = {
    start: function () {
        this._startTime = new Date().getTime();
        return this;
    },
    end: function () {
        this._endTime = new Date().getTime();
        return this;
    },
    count: function () {
        return this._endTime - this._startTime;
    },
    get: function () {
        this.end();
        return this.count();
    }
};

/**
 * 获取结果集映射表
 * @param keys 表名
 * @param fn 处理函数
 * @returns {{}}
 */
function getResultMap(keys, fn) {
    let map = {};
    keys.map(function (v, i) {
        map[v] = fn(i, v);
    });
    return map;
}

/**
 * 获取标准结果集映射表
 * @param keys 表名
 * @param result 结果集
 * @returns {{}}
 */
function getResult(keys, result) {
    return getResultMap(keys, function (i) {
        return getJSON(result[i]);
    });
}

/**
 * 获取错误情况下的结果集映射表
 * @param keys 表名
 * @returns {{}}
 */
function getResultError(keys) {
    return getResultMap(keys, function () {
        return [];
    });
}

/**
 * 从字符串中解析出img标签
 * @param {String} str
 * @return {Array} 返回
 */
function getStringInImg(str) {
    // 从字符串中获取img标签部分
    const imgReg = /<img.*?(?:>|\/>)/gi;
    // 从img标签中获取src路径
    const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    let arr = str.match(imgReg);
    let srcArr = [];
    arr && arr.forEach(item => {
        srcArr.push(item.match(srcReg)[1])
    })
    return srcArr;
}

/**
 * 删除字符串中的标签
 */
function delHtmlTag(str){
　　return str.replace(/<[^>]+>/g,"");
}

/**
 * 获取用户id，用户名和用户类型
 * @param {Object} cookies 当前请求头cookie
 */
function getUser(cookies) {
    const {
        belonger_user_id,
        belonger_user_name,
        xh_userId,
        xh_userName
    } = cookies;
    // 有belonger_user_id的为经纪人，其他为普通客户
    const type = belonger_user_id ? 1 : 2;
    const userId = type === 1 ? belonger_user_id : xh_userId;
    const userName = type === 1 ? belonger_user_name : xh_userName;
    return {
        type,
        userId,
        userName
    }
}

module.exports = {
    format: format,
    getJSON: getJSON,
    decodeHtml: decodeHtml,
    statTimeCost: statTimeCost,
    getResultMap: getResultMap,
    getResult: getResult,
    getResultError: getResultError,
    getStringInImg: getStringInImg,
    delHtmlTag: delHtmlTag,
    timestampToTime,
    getUser,
    noPassByMobile
};