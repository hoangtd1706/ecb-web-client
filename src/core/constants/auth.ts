import { AppUser } from '../../core/accountService';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE';

export const VERIFY_REQUEST = 'VERIFY_REQUEST';
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS';
export const VERIFY_FAILURE = 'VERIFY_FAILURE';

export const LOGOUT = 'LOGOUT';

interface LoginRequestAction {
  type: typeof LOGIN_REQUEST,
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE,
  error: string,
}

interface ChangePasswordRequestAction {
  type: typeof CHANGE_PASSWORD_REQUEST,
}

interface ChangePasswordFailureAction {
  type: typeof CHANGE_PASSWORD_FAILURE,
  error: string,
}

interface VerifyRequestAction {
  type: typeof VERIFY_REQUEST,
}

interface VerifySuccessAction {
  type: typeof VERIFY_SUCCESS,
  payload: AppUser,
}

interface VerifyFailureAction {
  type: typeof VERIFY_FAILURE,
}

interface LogoutAction {
  type: typeof LOGOUT,
}

export type Actions =
  LoginRequestAction |
  LoginFailureAction |
  ChangePasswordRequestAction |
  ChangePasswordFailureAction |
  VerifyRequestAction |
  VerifySuccessAction |
  VerifyFailureAction |
  LogoutAction;

const LOGIN_FAIL = 'Thông tin đăng nhập không chính xác! Vui lòng thử lại hoặc chắc chắn rằng phím CAPSLOCK đang không bật.';
const PASSWORD_NOT_MATCH = 'Mật khẩu xác nhận không đúng!';
const PASSWORD_NOT_CHANGE = 'Mật khẩu cũ không được trùng với mật khẩu mới!';
const PASSWORD_CHANGE_FAILURE = 'Không thể đổi mật khẩu do thông tin nhập không chính xác!';

export const authErrors = {
  LOGIN_FAIL,
  PASSWORD_NOT_MATCH,
  PASSWORD_NOT_CHANGE,
  PASSWORD_CHANGE_FAILURE,
};
