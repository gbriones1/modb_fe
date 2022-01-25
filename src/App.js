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

const handleLogout = (setToken, setUser) => {
  console.log("logout")
  localStorage.removeItem('token')
  localStorage.removeItem('currentUser')
  setToken(null)
  setUser(null)
}

function App() {
  let token = localStorage.getItem('token');
  let userData = JSON.parse(localStorage.getItem('currentUser') || "{}");
  const [notifications, setNotifications] = useState([]);
  const [cachedToken, setCachedToken] = useState(token);
  const [cachedUser, setCachedUser] = useState(userData);
  if (token !== cachedToken){
    setCachedToken(token)
    setCachedUser(userData)
  }
  // if (userData !== cachedUser){
  //   setCachedUser(userData)
  // }
  if(!cachedToken) {
    return <Login setToken={ setCachedToken } setUser={ setCachedUser } />
  }
  return (
      <Router history={history}>
        <Switch>
          <Route path="/logout" render={() => {
            handleLogout(setCachedToken, setCachedUser)
            return <Redirect to="/" />
          }}>
          </Route>
          <Route path='/reports'>
            <AppNavbar user={cachedUser} />
            <ReportsPage history={ history }></ReportsPage>
          </Route>
          <Route path="/:model/:id">
            <SheetPage setToken={ setCachedToken } setNotifications={ setNotifications } />
          </Route>
          <Route path="/:model">
            <AppNavbar user={cachedUser} />
            <TablePage history={ history } setToken={ setCachedToken } setNotifications={ setNotifications } />
            <AppNotifications notifications={ notifications } ></AppNotifications>
          </Route>
          <Route path="/">
            <AppNavbar user={cachedUser} />
            <AppNotifications notifications={ notifications } ></AppNotifications>
            <LandingPage history={ history }></LandingPage>
          </Route>
        </Switch>
      </Router>
  )
}

export default App;
