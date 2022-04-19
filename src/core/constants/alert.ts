import { AlertType } from '@nvdunginest/emis-mui';

export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';

interface ShowAlertAction {
  type: typeof SHOW_ALERT,
  payload: {
    severity: AlertType,
    text: string,
  },
}

interface HideAlertAction {
  type: typeof HIDE_ALERT,
}

export type AlertActions = ShowAlertAction | HideAlertAction;
