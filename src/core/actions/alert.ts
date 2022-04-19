import { AlertType } from '@nvdunginest/emis-mui';
import {
  SHOW_ALERT,
  HIDE_ALERT,
  AlertActions,
} from '../constants/alert';

const show = (text: string, severity: AlertType): AlertActions => ({
  type: SHOW_ALERT,
  payload: {
    text: text,
    severity: severity,
  }
});

const hide = (): AlertActions => ({
  type: HIDE_ALERT,
});

const actions = {
  show,
  hide,
};

export default actions
