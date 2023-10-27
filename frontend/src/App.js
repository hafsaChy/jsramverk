// import React from 'react';
// import './styles/App.css';
// import MainView from './components/MainView';
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./components/LoginView";
// import Register from "./components/RegisterView";

// function App() {  
//   return (
//     <div className="App">
//       <header className="App-header">
//         TågInfo Kontroll App
//       </header>
//       <div className="container">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/app" element={<MainView />} />
//         </Routes>
//       </BrowserRouter>    
//       </div>
//     </div> 
//   );
// }

// export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/user.context";
import Home from "./pages/Home.page";
import Login from "./pages/Login.page";
import PrivateRoute from "./pages/PrivateRoute.page";
import Signup from "./pages/Signup.page";
 
function App() {
 return (
   <BrowserRouter>
     {/* We are wrapping our whole app with UserProvider so that */}
     {/* our user is accessible through out the app from any page*/}
     <UserProvider>
       <Routes>
         <Route exact path="/login" element={<Login />} />
         <Route exact path="/signup" element={<Signup />} />
         {/* We are protecting our Home Page from unauthenticated */}
         {/* users by wrapping it with PrivateRoute here. */}
         <Route element={<PrivateRoute />}>
           <Route exact path="/" element={<Home />} />
         </Route>
       </Routes>
     </UserProvider>
   </BrowserRouter>
 );
}
 
export default App;
