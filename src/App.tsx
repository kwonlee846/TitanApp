import { Homepage } from "./Homepage";
import { LoginPage } from "./LoginPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SignUp } from "./SignUp";
import AnalyticsPage  from "./AnalyticsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/analytics/:user_name" element={<AnalyticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
