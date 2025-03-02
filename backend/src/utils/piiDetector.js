// PII Patterns
const piiPatterns = {
    Aadhaar: /\b(?:\d[ -]?){12}\b/,
    PAN: /\b[A-Z]{5}[\d]{4}[A-Z]\b/,
    "Driving License": /\b(?:DL-?)?[A-Z]{2}[ -]?(?:\d{2}|[A-Z]{2})[ -]?(?:\d{4}|\d{11})\b/,
    Name: /\b(?:[A-Z][a-z]+(?: [A-Z][a-z]+)+)\b/,
    Mobile: /\b(?:0|91?[6-9]\d{9})\b/,
    Email: /\b[\w.+-]+@[\w-]+\.[\w-.]+\b/
  };
  
  // Detect PII in text
  const detectPII = (text) => {
    const piiData = {};
    Object.entries(piiPatterns).forEach(([key, pattern]) => {
      const matches = [...new Set(text.match(pattern) || [])]; // Unique matches
      if (matches.length) piiData[key] = matches;
    });
    return piiData;
  };
  
  // Calculate Risk Score
  const calculateRiskScore = (piiData) => {
    const riskWeights = { Aadhaar: 5, PAN: 4, "Driving License": 2, Name: 1, Email: 1, Mobile: 1 };
    return Math.min(
      Object.entries(piiData).reduce(
        (acc, [key, values]) => acc + (riskWeights[key] || 0) * values.length,
        0
      ),
      10
    );
  };
  
  module.exports = { detectPII, calculateRiskScore };