/**
 * 是否包含枚举值
 * @param {Array} pointDefinedObj 埋点定义对象
 */
export function hasEnumProp (pointDefinedObj) {
  return pointDefinedObj.some(x => x.propType === 'enum')
}
