import React, { useState, useEffect } from 'react';
import withAppContext from '../withAppContext';
import { AppContextPropType } from '../helpers/PropTypeConstants';
import { signInWithUsername } from '../api';
import SignupPage from './SignupPage';
import ChatRoom from './ChatRoom';

interface DefaultPageProps {
  appContext: AppContextPropType;
}

const DefaultPage: React.FC<DefaultPageProps> = ({ appContext }) => {
  const [hasUsername, setHasUsername] = useState(false);

  const handleSubmitUsername = async (username: string) => {
    await signInWithUsername(username);
    appContext.setUsername(username);
  };

  useEffect(() => {
    if (appContext.username) {
      setHasUsername(true);
    }
  }, [appContext.username]);

  return (
    <>
      {!hasUsername && <SignupPage onHandleSubmitUsername={handleSubmitUsername} />}
      {hasUsername && <ChatRoom />}
    </>
  );
};

export default withAppContext(DefaultPage);
