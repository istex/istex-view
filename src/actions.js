export const fetchConfig = () => {
  return { type: 'FETCH_CONFIG' };
};
export const updateConfig = (config) => {
  return { type: 'UPDATE_CONFIG', config };
};

export const fetchDemoDocsFromTheApi = () => {
  return { type: 'FETCH_DEMO_DOCS_FROM_THE_API' };
};
export const updateDemoDocsFromTheApi = (demoDocs) => {
  return { type: 'UPDATE_DEMO_DOCS_FROM_THE_API', demoDocs };
};

export const fetchApiStatus = () => {
  return { type: 'FETCH_API_STATUS' };
};
export const updateApiStatus = (apiStatus) => {
  return { type: 'UPDATE_API_STATUS', apiStatus };
};

