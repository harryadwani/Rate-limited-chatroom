import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ContextProvider, { AppContext } from './ContextProvider';
import DefaultPage from './components/DefaultPage';

function renderApplication() {
  return (
    <>
      <BrowserRouter>
        <Route
          exact
          path="/"
          render={(DefaultPageProps) => (<DefaultPage {...DefaultPageProps} />)}
        />
      </BrowserRouter>
    </>
  );
}

class App extends Component {
  render() {
    return (
      <ContextProvider>
        <AppContext.Consumer>
          {
            (appContext) => {
              if (appContext) {
                return renderApplication();
              }
              return <></>;
            }
          }
        </AppContext.Consumer>
      </ContextProvider>
    );
  }
}

export default App;
