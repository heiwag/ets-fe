import _ from 'lodash'

/**
 * 是否包含枚举值
 * @param {Array} pointDefinedObj 埋点定义对象
 */
export function hasEnumProp (pointDefinedObj) {
  if (!_.isArray(pointDefinedObj)) return false
  return pointDefinedObj.some(x => x.propType === 'enum')
}
