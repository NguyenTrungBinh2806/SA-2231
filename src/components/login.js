import React from 'react';
import './login.css';
// import auth from '../environment/firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toaster } from 'evergreen-ui';
import { isLogin, loginWithEmail } from '../shared/auth';


function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    // login
    const handleSubmit = async (e) => {
        e.preventDefault();
        loginWithEmail(email, password);
    }


            


    return (
        <div className="login">
            <div className="login-container">
                <div className="login-title">
                    <h1>Sign in</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label><br />
                        <input className='email-login' type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                        <br />
                        <br />
                        <label htmlFor="password">Password</label><br />
                        <input className='password-login'type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                        <br />
                        <br />
                        <button type="submit" className='btn-login'>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
