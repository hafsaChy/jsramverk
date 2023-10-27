import { Button } from '@mui/material'
import { useContext } from 'react';
import { UserContext } from '../contexts/user.context';
import '../styles/App.css';
import MainView from '../components/MainView';

export default function Home() {
 const { logOutUser } = useContext(UserContext);
 
 // This function is called when the user clicks the "Logout" button.
 const logOut = async () => {
   try {
     // Calling the logOutUser function from the user context.
     const loggedOut = await logOutUser();
     // Now we will refresh the page, and the user will be logged out and
     // redirected to the login page because of the <PrivateRoute /> component.
     if (loggedOut) {
       window.location.reload(true);
     }
   } catch (error) {
     alert(error)
   }
 }
 
 return (
   <>
    <div className="App">
      <header className="App-header">
        <h1>Vällkommen till TågInfo Kontroll App</h1>
        <Button variant="contained" onClick={logOut}>Logout</Button>
      </header>
      <div className="container">
        <MainView />
      </div>

    </div>
   </>
 )
}
