class StringUtil {
  /**
   * Escapes characters in a string that have special meaning in regular expressions.
   * @param {string} text - The string to escape.
   * @return {string} - The escaped string.
   */
  static regExEscape(text) {
    return text.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
  }

  /**
   * Removes one or more characters from the end of a string.
   * @param {string} text - The string to trim.
   * @param {string} textTOTrim - The characters to remove from the end of the string.
   * @return {string} - The trimmed string.
   */
  static trimEnd(text, textTOTrim) {
    textTOTrim = this.regExEscape(textTOTrim);
    return text.replace(new RegExp('[' + textTOTrim + ']+$', ''));
  }


  /**
   * Generates a unique string by combining the current date and a random number.
   * @return {string} - A unique string.
   */
  static getUniqueString() {
    const dateStr = Date.now().toString().replace(/:/g, '-');
    const randomString = Math.round(Math.random() * 100000).toString();
    const result = `${dateStr} - ${randomString}`;
    return result;
  }

  /**
   * Checks if an array is sorted in descending order.
   * @param {Array} array - The array to check.
   * @return {boolean} - True if the array is sorted in descending order, false otherwise.
   */
  static isArrayDescending(array) {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] < array[i + 1]) {
        return false;
      }
    }
    return true;
  }
}

module.exports = StringUtil;
