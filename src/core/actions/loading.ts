import {
  SHOW_LOADING,
  HIDE_LOADING,
  LoadingActions,
} from '../constants/loading';

const show = (): LoadingActions => ({
  type: SHOW_LOADING,
});

const hide = (): LoadingActions => ({
  type: HIDE_LOADING,
});

const actions = {
  show,
  hide,
};

export default actions
