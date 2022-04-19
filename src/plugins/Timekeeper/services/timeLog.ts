import axios from 'axios';

const apiUrl = '/api/timekeeper/timeLogs';

export type TimeLogModel = {
  date: Date;
  hasTimeIn: boolean;
  timeIn: Date;
  hasTimeOut: boolean;
  timeOut: Date;
}

function get(month: number, year: number): Promise<TimeLogModel[]> {
  return axios.get(`${apiUrl}/${month}/${year}`);
}

const service = {
  get,
};

export default service;