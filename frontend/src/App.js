import { HashRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/usercontext";
import Home from "./pages/Homepage";
import Login from "./pages/Loginpage";
import PrivateRoute from "./pages/PrivateRoutepage";
import Signup from "./pages/Signuppage";
 
function App() {
 return (
   <HashRouter basename="/" >
     {/* We are wrapping our whole app with UserProvider so that */}
     {/* our user is accessible through out the app from any page*/}
     <UserProvider>
       <Routes>
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
         {/* We are protecting our Home Page from unauthenticated */}
         {/* users by wrapping it with PrivateRoute here. */}
         <Route element={<PrivateRoute />}>
           <Route path="/" element={<Home />} />
           <Route path="/home" element={<Home />} />
         </Route>
       </Routes>
     </UserProvider>
   </HashRouter>
 );
}

export default App;
