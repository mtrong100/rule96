import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter } from "react-router-dom";
import "primeicons/primeicons.css";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PrimeReactProvider value={{ ripple: true }}>
      <App />
      <Toaster position="top-center" reverseOrder={false} />
    </PrimeReactProvider>
  </BrowserRouter>
);
