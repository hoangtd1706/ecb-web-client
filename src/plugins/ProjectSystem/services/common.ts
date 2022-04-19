export const changeStatusEnum = {
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3,
};

export const versionNumberEnum = {
  PACK: -1,
  POST: 0,
}

export const branchEnum = {
  PLANNER: 1,
  DESIGNER: 2,
  ESTIMATOR: 3,
  SUPERVISOR: 4,
}

export type TrackingChangeModel<T> = {
  pack: T | null;
  post: T | null;
  status: number;
};

export type AddFromExcelModel<T> = {
  item: T;
  isAdded: boolean;
  message: string;
};