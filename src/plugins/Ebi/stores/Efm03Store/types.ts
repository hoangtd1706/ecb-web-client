import { SummaryReport } from '../../services/efm03';

export type Efm03State = {
  title: string;
  reportData: SummaryReport;
};

export const initialState: Efm03State = {
  title: '',
  reportData: {
    data: [],
    projects: [],
  }
};

export type Efm03Store = {
  state: Efm03State;
  changeTitle: (text: string) => void;
  fetchData: () => void;
}

export const defaultStore: Efm03Store = {
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeTitle: (text: string) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchData: () => { return; },
};
