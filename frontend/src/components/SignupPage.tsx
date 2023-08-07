import React, { useState } from 'react';
import PropTypes from 'prop-types';
import withAppContext from '../withAppContext';
import '../styles/SingupPage.css'; // Import the CSS file

interface SignupPageProps {
  onHandleSubmitUsername: (username: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onHandleSubmitUsername }) => {
  const [username, setUsername] = useState<string>('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUsername(value);
  };

  const handleSubmitAsync = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onHandleSubmitUsername(username);
  };

  return (
    <div className="auth-form-wrapper">
      <h1 className="sign-up-form-heading">Enter username</h1>
      <form onSubmit={handleSubmitAsync}>
        <div className="auth-input-wrapper">
          <input
            type="text"
            name="username"
            id="usernameInput"
            onChange={handleUsernameChange}
            placeholder="Username"
            className="sign-up-form-input-field"
          />
        </div>
        <button type="submit" value="submit" id="usernameSubmitButton" className="auth-form-submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default withAppContext(SignupPage);

SignupPage.propTypes = {
  onHandleSubmitUsername: PropTypes.func.isRequired,
};
