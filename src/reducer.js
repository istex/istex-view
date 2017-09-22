import { combineReducers } from 'redux';

export const configReducer = (state = {loaded: false}, action) => {
  switch (action.type) {
  
  case 'FETCH_CONFIG':
//    console.log('FETCH_CONFIG', action);
    return { ...state , loaded: false };
  
  case 'UPDATE_CONFIG':
//    console.log('UPDATE_CONFIG', { ...state, ...action.config });
    return { ...state, ...action.config };

  default:
    return state;
  }
};

export const docsReducer = (state = {}, action) => {
  switch (action.type) {
  
  case 'FETCH_DEMO_DOCS_FROM_THE_API':
    return state;

  case 'UPDATE_DEMO_DOCS_FROM_THE_API':
    return { ...state, ...action.demoDocs };

  default:
    return state;
  }
};


const initialStateApiStatus = {
  isAvailable: undefined
};
export const apiStatusReducer = (state = initialStateApiStatus, action) => {
  switch (action.type) {
  
  case 'FETCH_API_STATUS':
    return state;

  case 'UPDATE_API_STATUS':
    return { ...state, ...action.apiStatus };

  default:
    return state;
  }
};

export const reducer = combineReducers({
  config: configReducer,
  demoDocs: docsReducer,
  apiStatus: apiStatusReducer,
});