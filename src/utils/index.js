/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 *解析时间到字符串
 *@param {{Object | string | number）}时间
 *@param {string} cFormat
 *@returns {string |空值}
 */
export function parseTime(time, cFormat) {
  if (time.length === 0) {
    return null
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 格式化时间
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 把url ?id=xx 类型的传参转化为配置对象
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * 清除阵列
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * 把配置对象转变为 url传参 id=xx & name=ss
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"')
    .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 * isInArray([a,b,c],a)
 */
export function isInArray(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}

/**
 *合并两个对象，给出最后一个最优数组
 *@param {Object}目标
 *@param {（Object | Array）}源
 *@returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * 切换样式
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * 、获取当前时间 tiker值
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 *检查元素是否具有class
 *@param {HTMLElement}榆木
 *@param {string} cls
 *@returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * 添加class 为element元素
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 从元素中删除class
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
// 去除对象空属性
export function deleteObjNull(obj) {
  let _newPar = {};
  for (let key in obj) {
    /**
     * 如果对象属性的值不为空,就保存该属性
     * 这里我做了限制,如果属性的值为0,保存该属性。如果属性的值全部是空格,属于为空。
     */
    if ((obj[key] === 0 || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
      //记录属性
      _newPar[key] = obj[key];
    }
  }
  //返回对象
  return _newPar;
}

// 动态添加disabled
export function addDisabled(dropdownList) {
  const list = []
  try {
    dropdownList.forEach((e, index) => {
      let e_new = {
        value: e.value,
        label: e.label,
        disabled: ''
      }
      if (!e.children && e.is_occupy == 1 && e.reuse == 0) {
        e_new = { ...e_new, disabled: true }
      }
      if (e.children) {
        const children = addDisabled(e.children)
        e_new = { ...e_new, children: children }
      }
      list.push(e_new)
    })
  } catch (error) {
    console.log(error)
    return []
  }
  return list
}

//全局监听扫码枪的扫码数据
export function scanCode() {
  let str = ''
  document.onkeydown = function() {
    if (event.target.tagName !== 'BODY') {
      str = ''
    } else {
      if (event.keyCode !== 13) {
        if (event.keyCode >= 32 && event.keyCode <= 126) {
          let k = event.key
          str += k
        }
      } else {
        if (str) {
          store.commit('scanCode/SET_SCANSTRING', str)
        }
        str = ''
      }
    }
  }
}


//单位换算：数量，原单位，目标单位
export function GetNumByUnit(num, unitname, outunitname) {
  var fRate = { //换算率
    ng: { μg: 0.001, mg: 0.001 * 0.001, g: 0.001 * 0.001 * 0.001, kg: 0.001 * 0.001 * 0.001 * 0.001, t: 0.001 * 0.001 * 0.001 * 0.001 * 0.001, ul: 0.001 * 0.001, ml: 0.001 * 0.001 * 0.001, L: 0.001 * 0.001 * 0.001 * 0.001 },
    μg: { ng: 1000, mg: 0.001, g: 0.001 * 0.001, kg: 0.001 * 0.001 * 0.001, t: 0.001 * 0.001 * 0.001 * 0.001, ul: 0.001, ml: 0.001 * 0.001, L: 0.001 * 0.001 * 0.001 },
    mg: { ng: 1000 * 1000, μg: 1000, g: 0.001, kg: 0.001 * 0.001, t: 0.001 * 0.001 * 0.001, ul: 1, ml: 0.001, L: 0.001 * 0.001 },
    g: { ng: 1000 * 1000 * 1000, μg: 1000 * 1000, mg: 1000, kg: 0.001, t: 0.001 * 0.001, ul: 1000, ml: 1, L: 0.001 },
    kg: { ng: 1000 * 1000 * 1000 * 1000, μg: 1000 * 1000, mg: 1000, g: 1000, t: 0.001, ul: 1000 * 1000, ml: 1000, L: 1 },
    t: { ng: 1000 * 1000 * 1000 * 1000 * 1000, μg: 1000 * 1000 * 1000, mg: 1000 * 1000, g: 1000 * 1000, kg: 1000, ul: 1000 * 1000 * 1000, ml: 1000 * 1000, L: 1000 },
    ml: { ng: 1000 * 1000 * 1000, μg: 1000 * 1000, mg: 1000, g: 1, kg: 0.001, t: 0.001 * 0.001, ul: 1000, L: 0.001 },
    ul: { ng: 1000 * 1000, μg: 1000, ml: 1, g: 0.001, kg: 0.001 * 0.001, t: 0.001 * 0.001 * 0.001, ml: 0.001, L: 0.001 * 0.001 },
    L: { ng: 1000 * 1000 * 1000 * 1000, μg: 1000 * 1000, mg: 1000, g: 1000, kg: 1, t: 0.001, ul: 1000 * 1000, ml: 1000 },
  };
  var tnum = (num * fRate[unitname][outunitname]).toFixed(4);
  return tnum;
};


// excel读取2018/01/01这种时间格式是会将它装换成数字类似于46254.1545151415 numb是传过来的整数数字，format是之间间隔的符号
export function formatDate(numb, format) {
  const time = new Date((numb - 1) * 24 * 3600000 + 1)
  time.setYear(time.getFullYear() - 70)
  const year = time.getFullYear() + ''
  const month = time.getMonth() + 1 + ''
  const date = time.getDate() - 1 + ''
  if (format && format.length === 1) {
    return year + format + month + format + date
  }
  return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
}

