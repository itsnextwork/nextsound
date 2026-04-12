import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { Provider } from "react-redux";

import { store } from "@/store";
import GlobalContextProvider from "@/context/globalContext";
import ThemeProvider from "@/context/themeContext";
import { AudioPlayerProvider } from "@/context/audioPlayerContext";
import ErrorBoundary from "@/common/ErrorBoundary";
import App from "./App";
import "./index.css";

// Conditionally enable MSW for development
if (import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true') {
  import('./mocks/browser').then(({ startMocking }) => {
    startMocking().then((enabled) => {
      if (enabled) {
        console.log('🎭 MSW enabled for development - API requests will be mocked');
      }
    });
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Provider store={store}>
          <ThemeProvider>
            <GlobalContextProvider>
              <AudioPlayerProvider>
                <LazyMotion features={domAnimation}>
                  <App />
                </LazyMotion>
              </AudioPlayerProvider>
            </GlobalContextProvider>
          </ThemeProvider>
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
