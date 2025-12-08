import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/auth/Login';
import UserList from './components/users/UserList';
import UserForm from './components/users/UserForm';
import PrivateRoute from './components/auth/PrivateRoute';
import CompanyList from './components/auth/CompanyList';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
          path="/companies"
          element={
            <PrivateRoute>
              <CompanyList />
            </PrivateRoute>
          }
        />

          <Route path="/users" element={
            <PrivateRoute>
              <UserList />
            </PrivateRoute>
          } />
          <Route path="/users/add" element={
            <PrivateRoute>
              <UserForm />
            </PrivateRoute>
          } />
          <Route path="/users/edit/:id" element={
            <PrivateRoute>
              <UserForm />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/users" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;