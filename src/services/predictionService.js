const ML_API_BASE = '/ml-api';

const sendRequest = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(`${ML_API_BASE}${path}`, options);
  } catch {
    throw new Error('Python ML service is unavailable. Start the service, then retry.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Prediction service request failed (${response.status}).`);
  }
  return result;
};

export const getDemandPredictionOptions = () => sendRequest('/options');

export const requestDemandPrediction = ({ productId, storeId, horizonDays }) => sendRequest('/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productId, storeId, horizonDays }),
});
