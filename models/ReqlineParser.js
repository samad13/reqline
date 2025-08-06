// models/ReqlineParser.js
class ReqlineParser {
  constructor(reqline) {
    this.reqline = reqline.trim();
    this.tokens = [];
    this.parsed = {
      method: null,
      url: null,
      headers: {},
      query: {},
      body: {}
    };
  }

  // Parse the reqline statement
  parse() {
    try {
      this.tokenize();
      this.validateAndParse();
      return this.parsed;
    } catch (error) {
      throw error;
    }
  }

  // Tokenize the input by splitting on pipes
  tokenize() {
    if (!this.reqline.includes('|')) {
      if (!this.reqline.includes('HTTP')) {
        throw new Error('Missing required HTTP keyword');
      }
      if (!this.reqline.includes('URL')) {
        throw new Error('Missing required URL keyword');
      }
    }

    const parts = this.reqline.split('|');
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      // Check spacing around pipes
      if (i > 0 && !parts[i].startsWith(' ')) {
        throw new Error('Invalid spacing around pipe delimiter');
      }
      if (i < parts.length - 1 && !parts[i].endsWith(' ')) {
        throw new Error('Invalid spacing around pipe delimiter');
      }
      
      const trimmed = part.trim();
      if (trimmed) {
        this.tokens.push(trimmed);
      }
    }
  }

  // Validate and parse tokens
  validateAndParse() {
    if (this.tokens.length === 0) {
      throw new Error('Missing required HTTP keyword');
    }

    // First token must be HTTP method
    const httpToken = this.tokens[0];
    this.parseHttpMethod(httpToken);

    // Second token must be URL
    if (this.tokens.length < 2) {
      throw new Error('Missing required URL keyword');
    }
    
    const urlToken = this.tokens[1];
    this.parseUrl(urlToken);

    // Parse remaining optional tokens
    for (let i = 2; i < this.tokens.length; i++) {
      this.parseOptionalToken(this.tokens[i]);
    }
  }

  // Parse HTTP method
  parseHttpMethod(token) {
    const parts = this.splitKeywordValue(token, 'HTTP');
    
    if (!token.startsWith('HTTP ')) {
      throw new Error('Missing required HTTP keyword');
    }

    const method = parts.value;
    
    if (!method) {
      throw new Error('Missing HTTP method');
    }

    if (method !== method.toUpperCase()) {
      throw new Error('HTTP method must be uppercase');
    }

    if (method !== 'GET' && method !== 'POST') {
      throw new Error('Invalid HTTP method. Only GET and POST are supported');
    }

    this.parsed.method = method;
  }

  // Parse URL
  parseUrl(token) {
    const parts = this.splitKeywordValue(token, 'URL');
    
    if (!token.startsWith('URL ')) {
      throw new Error('Missing required URL keyword');
    }

    const url = parts.value;
    
    if (!url) {
      throw new Error('Missing URL value');
    }

    this.parsed.url = url;
  }

  // Parse optional tokens (HEADERS, QUERY, BODY)
  parseOptionalToken(token) {
    if (token.startsWith('HEADERS ')) {
      this.parseHeaders(token);
    } else if (token.startsWith('QUERY ')) {
      this.parseQuery(token);
    } else if (token.startsWith('BODY ')) {
      this.parseBody(token);
    } else {
      // Check if keyword is not uppercase
      const keyword = token.split(' ')[0];
      if (keyword && keyword !== keyword.toUpperCase()) {
        throw new Error('Keywords must be uppercase');
      } else {
        throw new Error('Unknown keyword: ' + keyword);
      }
    }
  }

  // Parse HEADERS section
  parseHeaders(token) {
    const parts = this.splitKeywordValue(token, 'HEADERS');
    
    if (!parts.value) {
      throw new Error('Missing HEADERS value');
    }

    try {
      this.parsed.headers = JSON.parse(parts.value);
    } catch (e) {
      throw new Error('Invalid JSON format in HEADERS section');
    }
  }

  // Parse QUERY section
  parseQuery(token) {
    const parts = this.splitKeywordValue(token, 'QUERY');
    
    if (!parts.value) {
      throw new Error('Missing QUERY value');
    }

    try {
      this.parsed.query = JSON.parse(parts.value);
    } catch (e) {
      throw new Error('Invalid JSON format in QUERY section');
    }
  }

  // Parse BODY section
  parseBody(token) {
    const parts = this.splitKeywordValue(token, 'BODY');
    
    if (!parts.value) {
      throw new Error('Missing BODY value');
    }

    try {
      this.parsed.body = JSON.parse(parts.value);
    } catch (e) {
      throw new Error('Invalid JSON format in BODY section');
    }
  }

  // Split keyword and value with proper spacing validation
  splitKeywordValue(token, expectedKeyword) {
    const spaceIndex = token.indexOf(' ');
    
    if (spaceIndex === -1) {
      throw new Error(`Missing space after keyword`);
    }

    const keyword = token.substring(0, spaceIndex);
    const value = token.substring(spaceIndex + 1);

    // Check for multiple spaces
    if (token.substring(spaceIndex, spaceIndex + 2) === '  ') {
      throw new Error('Multiple spaces found where single space expected');
    }

    if (keyword !== expectedKeyword) {
      if (keyword !== keyword.toUpperCase()) {
        throw new Error('Keywords must be uppercase');
      }
    }

    return { keyword, value };
  }
}

module.exports = ReqlineParser;