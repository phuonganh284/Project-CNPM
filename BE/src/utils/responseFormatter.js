const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  }
  
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  
  return obj;
};

const formatResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data: toCamelCase(data),
    ...(Array.isArray(data) && { total: data.length })
  };
};

const formatError = (error, message, statusCode = 500) => {
  return {
    success: false,
    error: {
      message,
      details: error?.message || error
    },
    statusCode
  };
};

module.exports = {
  toCamelCase,
  formatResponse,
  formatError
};
