// 空值校验
export const validateEmpty = (rule, value = '', callback) => {
  if (typeof value === 'number') {
    callback();
  } else if (typeof value !== 'string' && value) {
    callback();
  } else if (value && value.trim && !!value.trim()) {
    callback();
  } else {
    callback(new Error(rule.message));
  }
};

// 账号校验
export const validateAccount = (rule, value = '', callback) => {
  // 由字母和数字组成，不区分大小写
  // const reg1 = /^(.*[0-9]+.*[a-zA-Z]+.*|.*[a-zA-Z]+.*[0-9]+.*)$/;
  // 账号由字母和数字组成,不能为纯数字！
  const reg = /^(?!\d+$)[\da-zA-Z]{6,50}$/;
  if (value && !reg.test(value)) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

// UM账号校验
export const validateUmAccount = (rule, value = '', callback) => {
  const reg = /^[a-zA-z].*(\d+)$/;
  if (value && !reg.test(value)) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
export const validCode = (rule, value = '', callback) => {
  const reg1 = /^([a-zA-Z0-9]{1,50})$/;
  if (value && !reg1.test(value)) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
// 密码校验
export const validatePwd = (rule, value = '', callback) => {
  // 字母、数字或特殊字符组成，必须至少有一个字母及一个数字组成，长度为8-16位字符
  // 特殊字符指 ~!@&%$^()#_+
  const reg1 = /^(.*[0-9]+.*[a-zA-Z]+.*|.*[a-zA-Z]+.*[0-9]+.*)$/;
  const reg2 = /^[0-9a-zA-Z~!@&%$^()#_+]{8,16}$/;
  if (value && !(reg1.test(value) && reg2.test(value))) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

// 中英文姓名校验
export const validateName = (rule, value, callback) => {
  const reg = /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/;
  if (value && !reg.test(value)) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

// 手机号码校验
export const validatePhone = (rule, value, callback) => {
  const reg = /^1\d{10}$/;
  const tel = /^0\d{2,3}-?\d{7,8}$/;
  if (!value) {
    callback();
  }
  if (reg.test(value)) {
    callback();
    // callback(new Error(rule.message));
  } else if (tel.test(value)) {
    callback();
  } else {
    callback(new Error(rule.message));
  }
};

// 身份证校验
export const validateIdCard = (rule, value, callback) => {
  const reg1 = /^\d{15}$/;
  // /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
  const reg2 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (value && !(reg1.test(value) || reg2.test(value))) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

// 校验证件类型
export const validIdCard = (rule, value, callback) => {
  // const reg = /^((?![`~!@#$%^&*()_\-+=<>?:"{}|,./;'[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]).)*$/;
  // if (!/身份证/g.test(idType)) {
  if (value.length !== 18) {
    // if (!reg.test(value)) {
    //   callback(new Error(rule.message));
    // } else {
    //   callback();
    // }
    callback();
  } else {
    validateIdCard(rule, value, callback);
  }
};

// 需完善
export const validateIdCardTodo = (rule, value, callback) => {
  const reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

  // 如果通过该验证，说明身份证格式正确，但准确性还需计算
  if (reg.test(value)) {
    if (value.length === 18) {
      const idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 将前17位加权因子保存在数组里
      const idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
      let idCardWiSum = 0; // 用来保存前17位各自乖以加权因子后的总和
      for (let i = 0; i < 17; i += 1) {
        idCardWiSum += value.substring(i, i + 1) * idCardWi[i];
      }
      const idCardMod = idCardWiSum % 11; // 计算出校验码所在数组的位置
      const idCardLast = value.substring(17); // 得到最后一位身份证号码
      // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      if (idCardMod === 2) {
        if (idCardLast === 'X' || idCardLast === 'x') {
          callback();
        } else {
          callback(new Error(rule.message));
        }
      } else if (idCardLast === idCardY[idCardMod].toString()) {
        callback();
      } else {
        callback(new Error(rule.message));
      }
    }
  } else {
    callback(new Error(rule.message));
  }
};


// 身份证号码加密
export const encryptionCard = (val) => {
  const str = val.replace(/^(.{4})(?:\w+)(.{4})$/, "\$1**********\$2");
  return str;
};

// 手机号码加密
export const encryptionPhone = (val) => {
  const str = `${val.substring(0,4)}***${val.substring(7,11)}`;
  return str;
};

// 姓名加密
export const encryptionName = (val) => {
  let str = '';
  if(val.length === 2){
    str = `${val.substring(0,1)}*`;
  }
  if(val.length === 3){
    str = `${val.substring(0,1)}**`;
  }
  if(val.length === 4){
    str = `${val.substring(0,2)}**`;
  }
  return str;
};

