import Header from "@components/components/Header";
import "@components/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
export default function App({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider forcedTheme="light">
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
