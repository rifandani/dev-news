import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
// components
import { AUTH_TOKEN } from './constants';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
      }
    }
  }
`;

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const _confirm = async (data) => {
    const { token } = await data.login;
    localStorage.setItem(AUTH_TOKEN, token);
    props.history.push('/');
  };

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => _confirm(data),
    onError: (error) => alert(`${error}, Try Again`),
  });

  return (
    <div className="center">
      <h2 className="flex justify-center">
        {'<'} Log/n {'>'}
      </h2>

      <div className="flex mt3 justify-center">
        <input
          required
          type="email"
          placeholder="Your email address"
          className="mb2 fl w-50 pa2 mr2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          type="password"
          placeholder="Your password"
          className="mb2 fl w-50 pa2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex mt3 justify-center">
        <span className="mr2 fl pa2 mb2 light-blue">{'<'} </span>
        <button
          className="pointer mr2 fl pa2 mb2 hover-bg-light-blue shadow-5 br-pill ba b--light-blue"
          onClick={() => {
            loginMutation({
              variables: {
                email,
                password,
              },
            });
          }}
        >
          Submit
        </button>
        <span className="mr2 fl pa2 mb2"> / </span>
        <Link to="/signup">
          <button className="pointer fl pa2 mb2 hover-bg-light-pink shadow-5 br-pill ba b--light-pink">
            Create a new account
          </button>
        </Link>
        <span className="mr2 fl pa2 mb2 light-pink"> {'>'}</span>
      </div>
    </div>
  );
};

export default Login;
