import {getAuth, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import { toaster } from 'evergreen-ui';
const loginWithEmail = async (email, password) => {
    const auth = getAuth();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password
        );
        const user = userCredential.user;
        localStorage.setItem("token-sa", user.uid);
        window.location.href = "/dashboard";
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        toaster.danger("error", errorMessage);
    }
};

const logout = () => {
    const auth = getAuth();
    // sign out and set islogin of App.js to false
    auth.signOut().then(() => {
        localStorage.removeItem('token-sa');
        window.location.href = "/login";
    }).catch((error) => {
        // An error happened.
    });
}



const isLogin = () => {
    if(localStorage.getItem('token-sa')){
        return true;
    }else{
        return false;
    }
}

export { isLogin, loginWithEmail, logout };
