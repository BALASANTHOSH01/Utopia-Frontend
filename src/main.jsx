import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import SmoothScrolling from "./components/Smooth.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <BrowserRouter>
      {/* <SmoothScrolling> */}
        <UserProvider>
          <App />
        </UserProvider>
      {/* </SmoothScrolling> */}
    </BrowserRouter>
  // </StrictMode>
);
