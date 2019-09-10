const validateBody = body => {
  let isValid = true;
  try {
    Object.values(body).forEach(el => {
      if (!el) isValid = false;
    });
  } catch (e) {
    isValid = false;
  }
  return isValid;
};

const sendResponse = (statusCode, message) => {
  const response = {
    statusCode: statusCode,
    body: message,
    headers: { "Content-Type": "text/plain" }
  };
  return response;
};

module.exports = {
  validateBody,
  sendResponse
};
