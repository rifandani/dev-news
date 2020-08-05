import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
// components
import { AUTH_TOKEN } from './constants';

const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`;

const Signup = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const _confirm = async (data) => {
    const { token } = await data.signup;
    localStorage.setItem(AUTH_TOKEN, token);
    props.history.push('/');
  };

  const [signupMutation] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => _confirm(data),
    onError: (error) => alert(`${error}, Try Again`),
  });

  return (
    <div className="center">
      <h2 className="flex justify-center">
        {'<'} S/gnup {'>'}
      </h2>

      <div className="flex mt3 justify-center">
        <input
          required
          type="text"
          placeholder="Your name"
          className="mb2 fl w-50 pa2 mr2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
            signupMutation({
              variables: {
                name,
                email,
                password,
              },
            });
          }}
        >
          Submit
        </button>
        <span className="mr2 fl pa2 mb2"> / </span>
        <Link to="/login">
          <button className="pointer fl pa2 mb2 hover-bg-light-yellow shadow-5 br-pill ba b--light-yellow">
            Already have an account?
          </button>
        </Link>
        <span className="mr2 fl pa2 mb2 light-yellow"> {'>'}</span>
      </div>
    </div>
  );
};

export default Signup;
