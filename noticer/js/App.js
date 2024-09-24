// import "/css/App.css";

const {
  BrowserRouter,
  Routes,
  Route
} = ReactRouterDOM

import HomePage from "/js/pages/HomePage.js";
import Header from "/js/components/header/menu.js";

const BASE_URL = '/'

const App = () => {
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

export default App;