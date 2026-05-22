const ALLOWED_METHODS = ['JazzCash', 'EasyPaisa', 'Sadapay', 'Online', 'Insurance'];

/**
 * Checks if a given payment mode is valid.
 * @param {string} mode - Payment mode to validate.
 * @returns {boolean} true if valid, false otherwise.
 */
function isValid(mode) {
  if (!mode) return false;
  return ALLOWED_METHODS.includes(mode);
}

module.exports = {
  ALLOWED_METHODS,
  isValid,
};
