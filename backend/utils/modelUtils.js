const axios = require('axios');

const BERT_SERVICE_URL = process.env.BERT_SERVICE_URL || 'http://localhost:5001';
const SIMILARITY_TIMEOUT = 5000; // 5 seconds timeout

const calculateSimilarity = async (text1, text2) => {
  try {
    const response = await axios.post(
      `${BERT_SERVICE_URL}/calculate_similarity`,
      { text1, text2 },
      { timeout: SIMILARITY_TIMEOUT }
    );
    return response.data.similarity;
  } catch (err) {
    console.error('Error calculating similarity:', err);
    return 0;
  }
};

const batchCalculateSimilarity = async (jobDescription, studentProfiles) => {
  try {
    const response = await axios.post(
      `${BERT_SERVICE_URL}/batch_similarity`,
      {
        job_description: jobDescription,
        student_profiles: studentProfiles
      },
      { timeout: SIMILARITY_TIMEOUT }
    );
    return response.data.similarities;
  } catch (err) {
    console.error('Error calculating batch similarity:', err);
    throw err; // Let the controller handle the error
  }
};

module.exports = {
  calculateSimilarity,
  batchCalculateSimilarity
};