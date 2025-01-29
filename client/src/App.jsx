import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store';
import theme from './theme';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Users from './pages/Users';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Layout><Users /></Layout></PrivateRoute>} />
            <Route path="/profile/:userId" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
