import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'boxicons/css/boxicons.min.css';
import '../src/data/css/index.css';
import '../src/data/css/grid.css';
import '../src/data/css/theme.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/index';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

const App = lazy(() => import('./App'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
        <Toaster
          toastOptions={{
            position: 'top-right',
            style: {
              background: '#283046',
              color: 'white',
            },
          }}
        />
      </Suspense>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
