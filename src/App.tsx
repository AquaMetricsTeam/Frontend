import { RouterProvider } from "react-router-dom";
import Providers from "@/components/Providers";
import router from "@/routes/router";

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
