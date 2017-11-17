let seed = 1

exports.uuid = function () {
  seed = seed + 1
  return seed
}

exports._uuid = function () {
  return Math.random().toString(35).substring(2)
}
