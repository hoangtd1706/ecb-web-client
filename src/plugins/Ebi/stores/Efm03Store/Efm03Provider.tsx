import React, { createContext } from 'react';
import reducer from './reducers';
import { Efm03Store, initialState, defaultStore } from './types';
import action from './actions';

type Efm03ProviderProps = {
  children: JSX.Element | JSX.Element[];
}

export const Efm03Context = createContext(defaultStore);

export default function Efm03Provider({ children }: Efm03ProviderProps): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const changeTitle = (text: string) => {
    action.changeTitle(text, dispatch);
  };

  const fetchData = () => {
    action.fetchData(dispatch);
  }

  const store: Efm03Store = {
    state,
    changeTitle,
    fetchData,
  };

  return (
    <Efm03Context.Provider value={store}>
      {children}
    </Efm03Context.Provider>
  );
}
