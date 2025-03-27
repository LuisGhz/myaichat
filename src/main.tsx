import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Welcome } from 'components/Welcome.tsx'
import { CurrentChat } from 'components/CurrentChat.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />} >
          <Route index element={<Welcome />}></Route>
          <Route path='chat' element={<CurrentChat />}></Route>
          <Route path='chat/:id' element={<CurrentChat />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
