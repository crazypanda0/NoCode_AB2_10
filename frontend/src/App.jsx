import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import Dashboard from "./components/Dashboard"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn/>}></Route>
        <Route path="/signup" element={<SignUp/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/upload" element={<UploadImage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
