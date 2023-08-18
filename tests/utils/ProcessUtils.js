class ProcessUtil {
  /**
   * Creates and returns a rejected Promise with an error message.
   * @param {string} errorMessage - The error message to include in the rejected Promise.
   * @return {Promise} - A rejected Promise with an Error object containing the specified error message.
   */
  static async returnPromiseError(errorMessage) {
    console.log(errorMessage);

    return new Promise((reject, resolve) => {
      reject(new Error(errorMessage));
    });
  }

  /**
   * Converts an error object to a rejected Promise with the error object as the reason.
   * @param {Error} error - The error object to convert.
   * @return {Promise} A rejected Promise with the error object as the reason.
   */
  static async errorToPromiseError(error) {
    console.log(error.toString());

    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
}

module.exports = ProcessUtil;
