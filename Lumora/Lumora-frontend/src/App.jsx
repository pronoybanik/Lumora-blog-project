import { RouterProvider } from "react-router-dom";
import Routers from "./Router/Routers";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={Routers} />
    </AuthProvider>
  );
}

export default App;
