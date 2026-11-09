import Characters from './pages/Characters'
import CharacterDetailsPage from './pages/CharacterDetails'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Characters />} />
          <Route path="/characters/:id" element={<CharacterDetailsPage />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  )
}

export default App
