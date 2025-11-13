import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

//pages
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignupPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      {/* <Route path = "/" element = {<Navigate to ="/login" replace/>} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter> 
   
  </StrictMode>
)
