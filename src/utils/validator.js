/**
 * function: 常用类型的校验
 * author  : wq
 * update  : 2018/5/29 16:40
 */

/**
 * @type {{name: function(*=): string, number: validator.number, int: function(): (*|string), tel: function(*=): (*|string)}}
 * 基本输入验证
 */
// 对于0等不是空
function isEmpty(data) {
  if (data === null || data === undefined || data === '') {
    return true
  }
  return false
}

export const Validator = {
  need: function (value) {
    let msg = 'OK'
    if (isEmpty(value)) {
      msg = '请输入${s1}'
    }
    return msg
  },
  card: function (value) {
    let msg = 'OK'
    if (isEmpty(value)) {
      msg = '请输入${s1}'
    } else if (!/^[0-9]*$/.test(value)) {
      msg = '您输入的${s1}，格式有误'
    }
    return msg
  },
  name: function (value) {
    let msg = 'OK'
    if (isEmpty(value)) {
      msg = '请输入${s1}'
    } else if (!/^[\u4E00-\u9FA5A-Za-z_0-9\·]+$/.test(value)) {
      msg = '您输入的${s1}，含有特殊字符'
    }
    return msg
  },
  number: function (value, max) {
    let msg = 'OK'
    if (isEmpty(value)) {
      msg = '请输入${s1}'
    } else if (!/^(0|[1-9][0-9]*)(:?\.[0-9]{0,6})?$/.test(value)) {
      msg = '您输入的${s1}，格式有误'
    }
    return msg;
  },
  int: function (value) {
    let msg = 'OK'
    if (isEmpty(value)) {
      msg = '请输入${s1}'
    } else if (!/^(0|(:?[1-9][0-9]*))$/.test(value)) {
      msg = '您输入的${s1}，格式有误'
    }
    return msg;
  },
  tel: function (value) {
    let msg = 'OK'
    if (isEmpty(value)) {
      msg = '请输入${s1}'
    } else if (!/^((\d{3,4}-)?\d{7,8})|(1[0-9]{10})$/.test(value)) {
      msg = '您输入的${s1}，格式有误'
    }
    return msg
  },
  businessNo: function (value) {
    let msg = 'OK'
    if (!/(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/.test(value)) {
      msg = '您输入的${s1}，格式有误'
    }
    return msg
  },
  id: function (idNo) {
    let msg = 'OK'
    if (isEmpty(idNo)) {
      msg = '请输入${s1}'
    } else {
      // 第一重校验，校验是否是18位且是17位数字加X或一个数字
      const regId = new RegExp(/^\d{17}[\dX]$/, 'g')
      if (idNo.length !== 18 || regId.exec(idNo) === null) {
        msg = '您输入的${s1}，格式有误'
      } else {
        // 第二重校验,出生日期校验
        var birthday = idNo.replace(/^\d{6}(\d{4})(\d{2})(\d{2})\d{3}[\dX]$/, '$1/$2/$3')
        if (!(new Date(birthday).getTime())) {
          msg = '您输入的${s1}，格式有误'
        }
        else {
          // 第三重校验，权重校验
          var weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
            validate = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'],
            totalWeight = 0
          var idCardWeight = idNo.replace(/^(\d{17})[\dX]/, '$1').split('').map(function (data, index) {
            return data * weight[index]
          })
          for (var i = 0; i < idCardWeight.length; i++) {
            totalWeight += idCardWeight[i]
          }
          var validateCode = validate[totalWeight % 11]
          if (idNo.substring(idNo.length - 1) !== validateCode) {
            msg = '您输入的${s1}，格式有误'
          }
        }
      }
    }
    return msg
  }
}

const defineValidate = {
  // 验证电话号码
  mobile: function (str) {
    return /^1[1-9][0-9]{9}$/.test(str)
  },
  int: function (str) {
    if (isEmpty(str)) {
      return false
    }
    return /^(0|[1-9][0-9])*$/.test(str)
  },
  number(str, n = 2) {
    if (isEmpty(str)) {
      return false
    }
    const reg = new RegExp('^(?:0|([1-9][0-9]*\\.?[0-9]{0,' + n + '})|(0\\.[0-9]{0,' + n + '}))$')
    return reg.test(str)
  }
}

/**
 * @type {{}}
 * 输入的时候验证，不格式化
 */
export const InputValidator = {
  // 验证： kind表示类型[number, int等]
  valid(value, kind, ...args) {
    if (typeof InputValidator[kind] === 'function') {
      return InputValidator[kind](value, ...args)
    }
    return value
  },
  // 最大值/小数点位数
  number(value, max, num = 2) {
    let _value = value
    if (isEmpty(_value)) {
      return ''
    }
    let _num = num
    if (_num <= 0) {
      return InputValidator['int'](value, max)
    }
    if (!defineValidate.number(_value, _num)) {
      const reg = new RegExp('^(0|(?:[1-9][0-9]*))(\\.[0-9]{0,' + _num + '})?(?:[0-9]*)')
      _value = _value.replace(/[^0-9.]/g, '').replace(/^0[0]+/, '0').replace(/([0-9]*\.[0-9]*)[.]+/g, '$1').replace(reg, '$1$2')
    }
    if (!isEmpty(max) && _value > max) {
      _value = max
    }
    return _value
  },
  int(value, max) {
    let _value = value
    if (isEmpty(_value)) {
      return ''
    }
    if (!defineValidate.int(_value)) {
      _value = _value.replace(/[^0-9]+/g, '').replace(/^0[0]+/, '0')
    }
    if (!isEmpty(max) && _value > max) {
      _value = max
    }
    return _value
  }
}
