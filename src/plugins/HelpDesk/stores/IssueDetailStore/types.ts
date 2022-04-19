import { ActivityModel, AddActivityModel, RequestModel } from '../../services/activity';
import { IssueModel } from '../../services/issue';

export type IssueDetailState = {
  issue: IssueModel,
  activities: ActivityModel[],
  validActions: number[],
};

export const initialState: IssueDetailState = {
  issue: {
    category: '',
    content: '',
    createdBy: '',
    createdTime: new Date(),
    followed: false,
    id: 0,
    moduleName: '',
    createdByFullName: '',
    moduleId: 0,
    supportedBy: '',
    supportedByFullName: '',
    priority: 0,
    severity: 0,
    status: 0,
    title: '',
    attachments: []
  },
  activities: [],
  validActions: [],
};

export type IssueDetailStore = {
  state: IssueDetailState;
  getIssueDetail: (issueId: number) => void;
  createActivity: (issueId: number, actionCode: number, model: AddActivityModel) => void;
  createRequest: (issueId: number, model: RequestModel) => void;
  attach: (issueId: number, file: File) => void;
}

export const defaultStore: IssueDetailStore = {
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getIssueDetail: (issueId: number) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createActivity: (issueId: number, actionCode: number, model: AddActivityModel) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createRequest: (issueId: number, model: RequestModel) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attach: (issueId: number, file: File) => { return; },
};
