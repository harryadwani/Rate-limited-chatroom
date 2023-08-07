import React from 'react';
import { AppContext } from './ContextProvider';

export default function withAppContext(Component) {
  return function WrapperComponent(props) {
    return (
      <AppContext.Consumer>
        {(state) => <Component {...props} appContext={state} />}
      </AppContext.Consumer>
    );
  };
}
