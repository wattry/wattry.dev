import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Auth from './components/auth/Auth';

export default () => {
  return (
    <Router>
      <Switch>
        <Route path='/login'>
          <Auth />
        </Route>
      </Switch>
    </Router>
  );
}