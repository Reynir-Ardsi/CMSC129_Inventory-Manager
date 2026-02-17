import { useState } from 'react';
import './login.css';

const Login: React.FC = () => {

    const [showRegister, setShowRegister] = useState<boolean>(false);
    const [showForgot, setShowForgot] = useState<boolean>(false);
    
    return (
        <div className="login-page">
            <h1 id="title">Inventory Manager</h1>

            <div className="login-container">

            <div className="login-left">
                <h1 id="container-label">Welcome</h1>
                <form>
                    <input type="text" id="username" placeholder="Username" />
                    <br />
                    <input type="password" id="password" placeholder="Password" />
                    <br />
                    <button type="button" id='login-button'>Log-in</button>
                </form>

                <div className='modalbuttons'>
                    <button type='button' id='forgot-pass'
                    onClick={() => setShowForgot(true)}
                    >Forgot Password?</button>
                    
                    <button type='button' id='register'
                    onClick={() => setShowRegister(true)}
                    >Register</button>
                </div>
            </div>

            <div className="login-right">
                <img src="src/assets/logincover.png" alt="image failed to load" />
            </div>
        </div>

        {showRegister && (
            <div className="modal-overlay" onClick={() => setShowRegister(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form>
                    <h2>Create Account</h2>
                    <input type="text" placeholder="Username" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button id='register-button'>Register</button>
                </form>
                </div>
            </div>
            )
        }

        {showForgot && (
            <div className="modal-overlay" onClick={() => setShowForgot(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form>
                    <h2>Reset Password</h2>
                    <input type="email" placeholder="Enter your email" />
                    <button id='reset-button'>Send Reset Link</button>
                </form>
                </div>
            </div>
            )
        }
        </div>
    );
}

export default Login