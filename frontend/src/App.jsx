import './App.css'
import { Layout } from './components/layout/Layout'
import { ProfilePage } from './pages/ProfilePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Layout>
      <ProfilePage />
    </Layout>
  )
}

export default App
