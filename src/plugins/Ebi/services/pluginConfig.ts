import axios from 'axios';

const apiUrl = '/api/ebi/pluginConfigs';

export type PluginModeModel = {
  allowAll: boolean;
}

function getPluginMode(): Promise<boolean> {
  return axios.get(`${apiUrl}/getPluginMode`);
}

function setPluginMode(model: PluginModeModel): Promise<unknown> {
  return axios.post(`${apiUrl}/setPluginMode`, model);
}

const service = {
  getPluginMode,
  setPluginMode,
};

export default service;