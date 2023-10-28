import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AlertState from './context/alert/AlertState';
import UserState from './context/user/UserState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AlertState>
      <UserState>
        <App />
      </UserState>
    </AlertState>
  </React.StrictMode>
);
