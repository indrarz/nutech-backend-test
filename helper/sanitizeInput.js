/**
 * Function to check if input contains forbidden characters
 * @param {string} input - The input string to validate
 * @returns {boolean} - Returns true if forbidden characters are found, otherwise false
 */
const containsScriptTag = (input) => {
  // Regex to match single quote ('), double quote ("), greater than (>), less than (<), and backtick (`)
  const forbiddenCharacters = /['<>`]/;
  return forbiddenCharacters.test(input);
};

const sanitizeInput = (input) => {
  const scriptTagPattern =
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  return scriptTagPattern.test(input);
};

const containsEventAttributes = (input) => {
  const eventAttrPattern = /\bon\w+="[^"]*"|\bon\w+='[^']*'/gi;
  return eventAttrPattern.test(input);
};

module.exports = { sanitizeInput, containsScriptTag, containsEventAttributes };
