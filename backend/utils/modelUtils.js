const axios = require('axios');

const BERT_SERVICE_URL = 'http://127.0.0.1:5001';
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
// In your modelUtils.js
const checkModelReady = async () => {
  try {
    await axios.post('http://127.0.0.1:5001/batch_similarity', {
      job_description: "test",
      student_profiles: ["test"]
    });
    return true;
  } catch (error) {
    return false;
  }
};

let modelReady = false;
const waitForModel = async () => {
  while (!modelReady) {
    modelReady = await checkModelReady();
    if (!modelReady) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Update your batchCalculateSimilarity function
const batchCalculateSimilarity = async (jobContext, studentProfiles) => {
  if (!modelReady) {
    await waitForModel();
  }
  const response = await axios.post('http://127.0.0.1:5001/batch_similarity', {
    job_description: jobContext,
    student_profiles: studentProfiles
  });
  return response.data.similarities;
};
// const batchCalculateSimilarity = async (jobDescription, studentProfiles) => {
//   try {
//     const response = await axios.post(
//       `${BERT_SERVICE_URL}/batch_similarity`,
//       {
//         job_description: jobDescription,
//         student_profiles: studentProfiles
//       },
//       { timeout: SIMILARITY_TIMEOUT }
//     );
//     return response.data.similarities;
//   } catch (err) {
//     console.error('Error calculating batch similarity:', err);
//     throw err; // Let the controller handle the error
//   }
// };

module.exports = {
  calculateSimilarity,
  batchCalculateSimilarity
};