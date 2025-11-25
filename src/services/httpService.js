import api from './api.js';

export const getData = async (url, config) => {
  const res = await api.get(url, config);
  return res.data;
};

export const postData = async (url, body, config) => {
  const res = await api.post(url, body, config);
  return res.data;
};

export const putData = async (url, body, config) => {
  const res = await api.put(url, body, config);
  return res.data;
};

export const deleteData = async (url, config) => {
  const res = await api.delete(url, config);
  return res.data;
};