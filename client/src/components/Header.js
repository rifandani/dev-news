import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
// components
import { AUTH_TOKEN } from './constants';

const Header = (props) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <header className="bg-white black-80 tc pv4 avenir">
      <h1 className="mt2 mb0 baskerville i fw1 f1">Developer News</h1>
      <h2 className="mt2 mb0 f6 fw4 ttu tracked">
        A place where all useful resources shared
      </h2>

      <nav className="bt bb tc mw7 center mt4">
        <Link
          className="f6 f5-l link bg-animate black-80 hover-bg-lightest-blue dib pa3 ph4-l"
          to="/"
        >
          <span role="img" aria-label="Home">
            🏠
          </span>{' '}
          Home
        </Link>

        <Link
          className="f6 f5-l link bg-animate black-80 hover-bg-light-yellow dib pa3 ph4-l"
          to="/top"
        >
          <span role="img" aria-label="Top">
            🏆
          </span>{' '}
          Top
        </Link>

        <Link
          className="f6 f5-l link bg-animate black-80 hover-bg-gold dib pa3 ph4-l"
          to="/search"
        >
          <span role="img" aria-label="Search">
            🔎
          </span>{' '}
          Search
        </Link>

        {authToken && (
          <Link
            className="f6 f5-l link bg-animate black-80 hover-bg-light-green dib pa3 ph4-l"
            to="/create"
          >
            <span role="img" aria-label="Share">
              📢
            </span>{' '}
            Share
          </Link>
        )}

        {authToken ? (
          <div
            className="f6 f5-l link bg-animate black-80 hover-bg-light-red dib pa3 ph4-l pointer"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              props.history.push(`/`);
            }}
          >
            <span role="img" aria-label="Logout">
              ⛔
            </span>{' '}
            Logout
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="f6 f5-l link bg-animate black-80 hover-bg-light-yellow dib pa3 ph4-l"
            >
              <span role="img" aria-label="Login">
                🌐
              </span>{' '}
              Login
            </Link>
            <Link
              to="/signup"
              className="f6 f5-l link bg-animate black-80 hover-bg-light-pink dib pa3 ph4-l"
            >
              <span role="img" aria-label="Signup">
                🌌
              </span>{' '}
              Signup
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default withRouter(Header);
