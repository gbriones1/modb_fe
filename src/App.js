import './App.css';
import { useState } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import history from "./history";
import AppNavbar from './components/AppNavbar';
import LandingPage from './pages/LandingPage';
import TablePage from './pages/TablePage';
import SheetPage from './pages/SheetPage';
import Login from './pages/LoginPage';
import AppNotifications from './components/AppNotifications';
import './App.css';
import ReportsPage from './pages/ReportsPage';

const handleLogout = (setToken) => {
  console.log("logout")
  localStorage.removeItem('token')
  setToken(null)
}

function App() {
  let token = localStorage.getItem('token');
  const [notifications, setNotifications] = useState([]);
  const [cachedToken, setCachedToken] = useState(token);
  if (token !== cachedToken){
    setCachedToken(token)
  }
  if(!cachedToken) {
    return <Login setToken={ setCachedToken } />
  }
  return (
      <Router history={history}>
        <Switch>
          <Route path="/logout" render={() => {
            handleLogout(setCachedToken)
            return <Redirect to="/" />
          }}>
          </Route>
          <Route path='/reports'>
            <AppNavbar />
            <ReportsPage history={ history }></ReportsPage>
          </Route>
          <Route path="/:model/:id">
            <SheetPage setToken={ setCachedToken } setNotifications={ setNotifications } />
          </Route>
          <Route path="/:model">
            <AppNavbar />
            <TablePage history={ history } setToken={ setCachedToken } setNotifications={ setNotifications } />
            <AppNotifications notifications={ notifications } ></AppNotifications>
          </Route>
          <Route path="/">
            <AppNavbar />
            <AppNotifications notifications={ notifications } ></AppNotifications>
            <LandingPage history={ history }></LandingPage>
          </Route>
        </Switch>
      </Router>
  )
}

export default App;
