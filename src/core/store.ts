import { createStore, applyMiddleware, AnyAction, Middleware } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
// import { createLogger } from 'redux-logger';
import rootReducer from './rootReducer';

// const logger = createLogger();

const devMiddleware: Middleware[] = [];

const productMiddleware: Middleware[] = [thunk];

const middleware = process.env.NODE_ENV === 'development'
  ? [...productMiddleware, ...devMiddleware] : [...productMiddleware];

export type RootState = ReturnType<typeof rootReducer>;

export type AppThunk<ReturnType = Promise<void>> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const store = createStore(
  rootReducer,
  applyMiddleware(...middleware),
);

export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
