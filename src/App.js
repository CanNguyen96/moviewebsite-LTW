import { BrowserRouter as Router } from "react-router-dom";
import Guard from "./components/Guard";
import Layout from "./Layout";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Guard>
          <Layout />
        </Guard>
      </Router>
    </AuthProvider>
  );
}

export default App;
