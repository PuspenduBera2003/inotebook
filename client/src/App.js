import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoteState from './context/notes/NoteState';
import AlertContext from './context/alert/AlertContext'
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import { useContext } from 'react';
import UserProfile from './components/Authenticated/UserProfile';

const App = () => {
  const context = useContext(AlertContext);
  const { alert } = context;
  return (
    <NoteState>
      <Router>
        <Navbar />
        {alert.length !== 0 && <Alert />}
        <Routes>
          <Route
            exact path="/"
            element={<Home />}
          />
          <Route
            exact path="/about"
            element={<About />}
          />
          <Route
            exact path="/login"
            element={<Login />}
          />
          <Route
            exact path="/signup"
            element={<Signup />}
          />
          <Route
            exact path="/user-details"
            element={<UserProfile />}
          />
        </Routes>
      </Router>
    </NoteState>
  );
}

export default App;
