import PropTypes from 'prop-types';

export type HistoryPropType = {
  push: (path: string) => void;
};

export type AppContextPropType = {
  token: string;
  username: string;
  setToken: (token: string) => void;
  setUsername: (username: string) => void;
};