import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// components
import LinkList from './LinkList';
import CreateLink from './CreateLink';
import Header from './Header';
import Login from './Login';
import Signup from './Signup';
import Search from './Search';

function App() {
  return (
    <div className="center">
      <Header />

      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/new/1" />} />
          <Route exact path="/create" component={CreateLink} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/top" component={LinkList} />
          <Route exact path="/new/:page" component={LinkList} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
