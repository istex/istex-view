import * as Actions from './actions.js';
import { call, put, all, take, takeEvery, takeLatest, cancelled, select } from 'redux-saga/effects';
import axios, { CancelToken } from 'axios';

function* fetchConfig() {
  console.log('SAGA fetchConfig START');
  let config;
  const source = CancelToken.source();
  try {
    config = yield call(axios, '/config.json', { cancelToken: source.token });
  } finally {
    if (yield cancelled()) {
      source.cancel();
      console.log('SAGA fetchConfig CANCELED');  
    }
  }
  console.log('SAGA fetchConfig END', config);  
  yield put(Actions.updateConfig({ ...config.data, loaded: true }));
  return config.data;
}

function* fetchDemoDocsFromTheApi(action) {
  const config = yield select(state => state.config);
  if (!config.istexApiProtocol || !config.istexApiDomain) return;
  
  let theUrl = config.istexApiProtocol + '://' + config.istexApiDomain;
  theUrl += '/document/?q=*&output=id,ark,title,genre&sid=istex-view&size=15&rankBy=random';
  const res = yield call(axios, theUrl);

  yield put(Actions.updateDemoDocsFromTheApi({nbIstexDoc: res.data.total, hits: res.data.hits}));
}

function* fetchApiStatus() {
  const config = yield select(state => state.config);
  if (!config.istexApiProtocol || !config.istexApiDomain) return;
  
  let theUrl = config.istexApiProtocol + '://' + config.istexApiDomain;
  theUrl += '/force404fordebug' + '/document/?q=*&output=id&sid=istex-view&size=1';

  try {
    const res = yield call(axios, theUrl);    
    yield put(Actions.updateApiStatus({isAvailable: true}));
  } catch(err) {
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      yield put(Actions.updateApiStatus({
        isAvailable: false,
        errorCode: err.response.status,
        errorMsg: err.response.data._error
      }));
    } else {
      yield put(Actions.updateApiStatus({
        isAvailable: false,
        errorCode: 0,
        errorMsg: err.message
      }));
    }
  }

}


export default function* rootSaga() {
  yield call(fetchConfig);
  yield call(fetchDemoDocsFromTheApi);
  yield call(fetchApiStatus);

/* 
  yield all([
    takeLatest('FETCH_CONFIG', fetchConfig),
    takeLatest('FETCH_DEMO_DOCS_FROM_THE_API', fetchDemoDocsFromTheApi),
    takeLatest('FETCH_API_STATUS', fetchApiStatus),
  ]);
*/
}