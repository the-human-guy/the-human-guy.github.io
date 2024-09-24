// import "/css/App.css";

const {
  BrowserRouter,
  Routes,
  Route
} = ReactRouterDOM

import { HomePage } from "./pages/HomePage.js";
import { Header } from "./components/header/menu.js";

const BASE_URL = '/noticer/'

export const App = () => {
  return (
    <>      
      <BrowserRouter basename={BASE_URL}>
      <Header></Header>
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
    
  );
};
