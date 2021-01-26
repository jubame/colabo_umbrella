function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]"
}

export {isString}