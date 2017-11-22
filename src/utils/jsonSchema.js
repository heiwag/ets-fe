import _ from 'lodash'

const mobileCommonValue = {
  properties: {
    u_user: { type: 'string' }, // 用户id
    u_name: { type: 'string' }, // 真实姓名
    u_phone: { type: 'string' }, // 手机
    u_gender: { enum: ['female', 'male'] }, // 性别
    u_isVIP: { type: 'boolean' }, // 是否 VIP
    u_type: { type: 'string' }, // 用户的 type
    u_channel: { type: 'string' }, // 用户渠道
    u_role: { type: 'string' }, // 用户角色
    u_route: { enum: ['a', 'b', 'c'] }, // 用户当前目标
    u_level: { type: 'integer' }, // 用户等级
    u_ability: { type: 'integer' }, // 用户能力值
    u_power: { type: 'integer' }, // 用户积分
    u_leadbarState: { type: 'boolean' }, // ?
    u_from: { type: 'string' }, // 用户注册平台
    u_province: { type: 'string' }, // 用户省份
    u_city: { type: 'string' }, // 用户城市
    u_school: { type: 'string' }, // 用户学校
    u_hasRoom: { type: 'boolean' }, // 用户是否有班级
    u_activateDate: { type: 'string' }, // 用户注册时间,
    u_lastPublisher: { type: 'string' }, // 最后一次页面对应的学段学科
    u_VIP: { type: 'string' }, // vip 支付字段
    u_juniorMath: { type: 'string' }, // 年级版本
    u_juniorPhysics: { type: 'string' }, // 年级版本
    u_highMath: { type: 'string' }, // 年级版本
    d_app_version: { type: 'string' } // app 版本号
  },
  required: [
    'u_user',
    'u_name',
    'u_phone',
    'u_gender',
    'u_isVIP',
    'u_type',
    'u_channel',
    'u_role',
    'u_route',
    'u_level',
    'u_ability',
    'u_power',
    'u_leadbarState',
    'u_from',
    'u_province',
    'u_city',
    'u_school',
    'u_hasRoom',
    'u_activateDate',
    'u_lastPublisher',
    'u_VIP',
    'u_juniorMath',
    'u_juniorPhysics',
    'u_highMath',
    'd_app_version'
  ]
}

export function getJsonSchema (hasCommonProp = true, propsModel) {
  if (!_.isArray(propsModel)) return {}
  let properties = {}
  let required = []
  _.forEach(propsModel, prop => {
    const { propName, propType, isRequire } = prop
    if (propType === 'enum') {
      _.set(properties, [propName, 'enum'], prop.enum.map(x => x.value))
    } else {
      properties[propName] = { type: propType }
    }
    if (isRequire) {
      required.push(propName)
    }
  })
  if (hasCommonProp) {
    let _properties = mobileCommonValue.properties
    let _required = mobileCommonValue.required

    mobileCommonValue.required = _required
      .concat(required)
      .filter((item, idx, array) => array.indexOf(item) === idx)
    mobileCommonValue.properties = _.assign(_properties, properties)
    return {
      title: 'Event-Tracking',
      type: 'object',
      properties: mobileCommonValue.properties,
      required: mobileCommonValue.required
    }
  }

  return {
    title: 'Event-Tracking',
    type: 'object',
    properties: properties,
    required: required
  }
}
