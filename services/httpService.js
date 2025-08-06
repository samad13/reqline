
const axios = require('axios');

const executeRequest = async (parsedRequest) => {
  const startTime = Date.now();
  
  try {
    
    let fullUrl = parsedRequest.url;
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(parsedRequest.query)) {
      queryParams.append(key, value);
    }
    
    if (queryParams.toString()) {
      fullUrl += (parsedRequest.url.includes('?') ? '&' : '?') + queryParams.toString();
    }

    
    const axiosConfig = {
      method: parsedRequest.method.toLowerCase(),
      url: fullUrl,
      headers: parsedRequest.headers,
      timeout: 30000 
    };

    
    if (parsedRequest.method === 'POST' && Object.keys(parsedRequest.body).length > 0) {
      axiosConfig.data = parsedRequest.body;
    }

    
    const response = await axios(axiosConfig);
    const endTime = Date.now();
    
    return buildSuccessResponse(parsedRequest, fullUrl, response, startTime, endTime);

  } catch (error) {
    const endTime = Date.now();
    
    if (error.response) {
      
      return buildErrorResponse(parsedRequest, error.response, startTime, endTime);
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

const buildSuccessResponse = (parsedRequest, fullUrl, response, startTime, endTime) => {
  return {
    request: {
      query: parsedRequest.query,
      body: parsedRequest.body,
      headers: parsedRequest.headers,
      full_url: fullUrl
    },
    response: {
      http_status: response.status,
      duration: endTime - startTime,
      request_start_timestamp: startTime,
      request_stop_timestamp: endTime,
      response_data: response.data
    }
  };
};

const buildErrorResponse = (parsedRequest, errorResponse, startTime, endTime) => {
  return {
    request: {
      query: parsedRequest.query,
      body: parsedRequest.body,
      headers: parsedRequest.headers,
      full_url: parsedRequest.url
    },
    response: {
      http_status: errorResponse.status,
      duration: endTime - startTime,
      request_start_timestamp: startTime,
      request_stop_timestamp: endTime,
      response_data: errorResponse.data
    }
  };
};

module.exports = {
  executeRequest
};