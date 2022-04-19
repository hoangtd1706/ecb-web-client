export const SHOW_LOADING = 'SHOW_LOADING';
export const HIDE_LOADING = 'HIDE_LOADING';

interface ShowLoadingAction {
  type: typeof SHOW_LOADING,
}

interface HideLoadingAction {
  type: typeof HIDE_LOADING,
}

export type LoadingActions = ShowLoadingAction | HideLoadingAction;
