import axios from 'axios';
import qs from 'qs';
import Vue from 'vue';
import Vuex from 'vuex';
import store from './../store/store';
import Config from './config';
import { AlertPlugin } from 'vux';
Vue.use(AlertPlugin);
Vue.use(Vuex);

function setError(error) {
  //  把加载中去掉
  store.commit('updateLoadingStatus', { isLoading: false });
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    if (error.response.status === 408) {
      Vue.$vux.alert.show({
        content: '请求超时了，请稍后再试'
      });
    } else {
      Vue.$vux.alert.show({
        content: '出错了，请稍后再试'
      });
    }
  } else if (error.code && error.code === 'ECONNABORTED') {
    Vue.$vux.alert.show({
      content: '网络错误，请稍后再试'
    });
    return;
  } else if (error.request) {
    Vue.$vux.alert.show({
      content: '网络丢失，请换个姿势再试试'
    });
  } else {
    console.log('Http Error', error.message);
    Vue.$vux.alert.show({
      content: '网络异常.' + error.message
    });
  }
  console.log(error.config);
}
const Http = {
  _hoststr: Config._hoststr,
  _timeout: 60000, // 60s

  reConstruct: function(url, headers) {
    let isAPImode = false; // 匹配 url -- 开头以 /wuzhu/ 形式
    if (url.length > 6 && url.substring(0, 6) === 'wuzhu/') {
      url = '/' + url;
    }
    if (url.length > 7 && url.substring(0, 7) === '/wuzhu/') {
      isAPImode = true;
    }
    if (isAPImode) {
      url = this._hoststr + url;
    }
    // 增加 headers['Token']、headers['channel_no']
    if (typeof headers !== 'object') {
      console.error('Http: headers is not object!!');
    } else {
      if (!headers.hasOwnProperty('Token')) {
        headers['Token'] = store.state.token || null;
      }
      if (!headers.hasOwnProperty('channel_no')) {
        headers['channel_no'] = store.state.channelNo || null;
      }
      if (!headers.hasOwnProperty('ChannelNo')) {
        headers['ChannelNo'] = store.state.channelNo || null;
      }
    }
    return [url, headers];
  },
  qs: val => {
    return qs.stringify(val);
  },
  get: (url, params = {}, headers = {}, usrTimeout = null, errorCallback) => {
    [url, headers] = Http.reConstruct(url, headers);
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params,
          headers: headers,
          timeout: usrTimeout || Http._timeout
        })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
          setError(err);
          if (typeof errorCallback === 'function') {
            errorCallback(err);
          }
        });
    });
  },
  post: (url, data = {}, headers = {}, usrTimeout = null, errorCallback) => {
    [url, headers] = Http.reConstruct(url, headers);
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
          headers: headers,
          timeout: usrTimeout || Http._timeout
        })
        .then(
          res => {
            resolve(res.data);
          },
          err => {
            reject(err);
            setError(err);
            if (typeof errorCallback === 'function') {
              errorCallback(err);
            }
          }
        );
    });
  },
  patch: (url, data = {}, headers = {}, usrTimeout = null, errorCallback) => {
    [url, headers] = Http.reConstruct(url, headers);
    return new Promise((resolve, reject) => {
      axios
        .patch(url, data, {
          headers: headers,
          timeout: usrTimeout || Http._timeout
        })
        .then(
          res => {
            resolve(res.data);
          },
          err => {
            reject(err);
            setError(err);
            if (typeof errorCallback === 'function') {
              errorCallback(err);
            }
          }
        );
    });
  },
  put: (url, data = {}, headers = {}, usrTimeout = null, errorCallback) => {
    [url, headers] = Http.reConstruct(url, headers);
    return new Promise((resolve, reject) => {
      axios
        .put(url, data, {
          headers: headers,
          timeout: usrTimeout || Http._timeout
        })
        .then(
          res => {
            resolve(res.data);
          },
          err => {
            reject(err);
            setError(err);
            if (typeof errorCallback === 'function') {
              errorCallback(err);
            }
          }
        );
    });
  }
};
export default Http;
