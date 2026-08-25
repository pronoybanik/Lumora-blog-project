import { RouterProvider } from "react-router-dom";
import Routers from "./Router/Routers";

function App() {
  return (
    <>
      <RouterProvider router={Routers}></RouterProvider>
    </>
  );
}

export default App;
