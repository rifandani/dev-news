import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  // split,
  // HttpLink,
} from '@apollo/client';
// import { getMainDefinition } from '@apollo/client/utilities';
// import { WebSocketLink } from '@apollo/client/link/ws';
// components
import './styles/index.css';
import App from './components/App';
import { AUTH_TOKEN } from './components/constants';

// initiate client
const client = new ApolloClient({
  uri: '/', // proxy set to http://localhost:4000
  cache: new InMemoryCache(),
  headers: {
    authorization: 'Bearer ' + localStorage.getItem(AUTH_TOKEN),
  },
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
