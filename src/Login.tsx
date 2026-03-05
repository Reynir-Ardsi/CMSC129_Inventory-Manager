import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import './login.css';

const Login: React.FC = () => {

    const [showRegister, setShowRegister] = useState<boolean>(false);
    const [showForgot, setShowForgot] = useState<boolean>(false);
    const [moveToDashboard, setMoveToDashboard] = useState<boolean>(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setErrorMessage(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMoveToDashboard(true);
            setTimeout(() => {
                setMoveToDashboard(false);
                navigate("/dashboard");
            }, 1500);
        } catch (error: any) {
            setErrorMessage("Failed to log in. Please check your credentials.");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            const user = userCredential.user;

            await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    username: registerUsername
                })
            });

            setShowRegister(false);
            setMoveToDashboard(true);
            setTimeout(() => {
                setMoveToDashboard(false);
                navigate("/dashboard");
            }, 1500);
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            await sendPasswordResetEmail(auth, resetEmail);
            alert("Password reset email sent!");
            setShowForgot(false);
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="login-page">
            <h1 id="title">Inventory Manager</h1>

            <div className="login-container">

            <div className="login-left">
                <h1 id="container-label">Sign In</h1>

                {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

                <form id='login-form' onSubmit={handleLogin}>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit" id='login-button'>Log-in</button>
                </form>

                <div className='modalbuttons'>
                    <button type='button' id='forgot-pass'
                    onClick={() => { setShowForgot(true); setErrorMessage(null); }}
                    >Forgot Password?</button>

                    <button type='button' id='register'
                    onClick={() => { setShowRegister(true); setErrorMessage(null); }}
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
                <form onSubmit={handleRegister}>
                    <h2>Create Account</h2>
                    {errorMessage && <p style={{color: 'red', fontSize: '14px'}}>{errorMessage}</p>}
                    <input
                        type="text"
                        placeholder="Username"
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                    />
                    <button id='register-button' type="submit">Register</button>
                </form>
                </div>
            </div>
            )
        }

        {showForgot && (
            <div className="modal-overlay" onClick={() => setShowForgot(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleResetPassword}>
                    <h2>Reset Password</h2>
                    {errorMessage && <p style={{color: 'red', fontSize: '14px'}}>{errorMessage}</p>}
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                    />
                    <button id='reset-button' type="submit">Send Reset Link</button>
                </form>
                </div>
            </div>
            )
        }

        {moveToDashboard && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Login Successful!</h2>
                    <p>Redirecting to dashboard...</p>
                </div>
            </div>
            )
        }

        </div>
    );
}

export default Login;