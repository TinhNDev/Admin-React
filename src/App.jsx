import React from 'react';

import './App.css';
import { BrowserRouter, Route, Routes, Navigate  } from 'react-router-dom';

import Login from './pages/Login';


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login/>} />


     <Route path="*" element={<Navigate to="/login" replace />} />
     </Routes>
    
    </BrowserRouter>
  );
}

export default App;
;
