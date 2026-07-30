import { Route, Routes } from 'react-router-dom'
import './App.css'
import PrivateRoutes from './components/PrivateRoutes'
import Dashboard from './components/Dashboard'
import LogIn from './components/LogIn'
import WorkSpaceChecker from './components/WorkSpaceChecker'

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route element={<WorkSpaceChecker />}>
          <Route path='/' element={<Dashboard />} />
        </Route>
        {/* <Route path='/workspace' element={<Dashboard />} /> */}
      </Route>
      <Route path='/login' element={<LogIn />} />
    </Routes>
  )
}

export default App
