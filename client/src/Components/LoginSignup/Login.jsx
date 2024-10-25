import React from 'react'
import { Link } from 'react-router-dom'
import './LoginSignup.css'

import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';


function Login() {
    return(
        <div className='container'>
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email"/>
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password"/>
                </div>
                <div className="Register">
                    Don't Have an account? <span><Link to="/signup">Click Here!</Link></span>
                </div>
                <div className="submit-container">
                    <div className="submit">Login</div>
                </div>
            </div>
        </div>
    );
}

export default Login;