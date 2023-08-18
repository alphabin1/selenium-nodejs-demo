const fs = require('fs');
const path = require('path');
const StringUtil = require('./string/StringUtils');

class FileUtil {
  /**
   * Check if a file exists at the given file path.
   * @param {string} filePath - The file path to check.
   * @return {boolean} - True if file exists, false otherwise.
   */
  static fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  /**
   * Returns the current working directory of the Node.js process.
   * @return {string} The current working directory path.
   */
  static getCurrentDirectory() {
    return process.cwd();
  }

  /**
   * Creates a directory if it does not exist already.
   * If the parent directory does not exist, it creates that as well.
   * @param {string} directory - The path of the directory to create.
   */
  static createDirectory(directory) {
    if (!fs.existsSync(directory)) {
      const parentDirectory = this.getParentDirectory(directory);

      if (!fs.existsSync(parentDirectory)) {
        this.createDirectory(parentDirectory);
      }
      fs.mkdirSync(directory);
    }
  }

  /**
   * Returns the parent directory of the given directory.
   * @param {string} directory - The directory path to get the parent of.
   * @return {string} The parent directory path.
   */
  static getParentDirectory(directory) {
    directory = StringUtil.trimEnd(directory, path.sep);
    const lastDirectory = directory.split(path.sep).pop();

    if (lastDirectory) {
      directory = StringUtil.trimEnd(directory, lastDirectory);
      directory = StringUtil.trimEnd(directory, path.sep);
    }
    return directory;
  }

  /**
   * Combines multiple path segments using the platform-specific separator as a delimiter, and returns the concatenated path.
   * @param {...string} paths - The path segments to be combined.
   * @return {string} The concatenated path.
   */
  static pathCombine(...paths) {
    return path.join(...paths);
  }

  /**
   * Reads a JSON file from the given file path.
   * @param {string} filepath - The path of the JSON file to read.
   * @return {object} - The parsed contents of the JSON file.
   */
  static readJSONFile(filepath) {
    const buffer = fs.readFileSync(filepath);
    return JSON.parse(buffer.toString());
  }

  /**
   * Creates a file with the given file path and content.
   * @param {string} filePath - The path of the file to create.
   * @param {string} fileContent - The content to write to the file.
   * @return {Promise<void>} - A promise that resolves once the file has been created.
   */
  static async createFile(filePath, fileContent) {
    await fs.writeFileSync(filePath, fileContent, function(err) {
      if (err) throw error;
      console.log(`File created ${filePath} and page source saved...!`);
    });
  }
}

module.exports = FileUtil;
