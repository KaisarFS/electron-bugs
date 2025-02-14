/* eslint-disable @typescript-eslint/explicit-function-return-type */
export abstract class ArrayUtils {
  public static isArrayNullOrEmpty(arr) {
    return !arr || !arr.length || arr.length <= 0
  }

  public static isArrayAndNotEmpty(arr) {
    return arr && arr.length && arr.length > 0
  }
}
