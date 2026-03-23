import Characters from './pages/Characters'
import CharacterDetailsPage from './pages/CharacterDetails'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Characters />} />
        <Route path="/characters/:id" element={<CharacterDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
