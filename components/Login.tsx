import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import './Login.css';

interface LoginProps {
    onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Login Form State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    // Register Form State
    const [registerFullName, setRegisterFullName] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

    // Forgot Password State
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            });

            if (error) throw error;

            if (data.user) {
                onLoginSuccess();
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
                redirectTo: window.location.origin,
            });

            if (error) throw error;

            setSuccess('Password recovery email sent! Please check your inbox.');
            setForgotPasswordEmail('');
        } catch (err: any) {
            setError(err.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (registerPassword !== registerConfirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: registerEmail,
                password: registerPassword,
                options: {
                    data: {
                        full_name: registerFullName,
                        username: registerUsername,
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                setSuccess('Registration successful! Please check your email to confirm.');
                setIsActive(false);
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-body">
            <div className={`login-container ${isActive ? 'active' : ''}`}>
                <div className="form-box login">
                    {!showForgotPassword ? (
                        <form onSubmit={handleLogin}>
                            <h1>Login</h1>
                            <div className="input-box">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    required
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                                <i className='bx bxs-user'></i>
                            </div>
                            <div className="input-box">
                                <input
                                    type="password"
                                    placeholder="Pass Word"
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                                <i className='bx bxs-lock-alt'></i>
                            </div>

                            <div className="remember-me">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    Remember me
                                </label>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Pleasee Waiting' : 'Login'}
                            </button>
                            {error && <div className="error-message">{error}</div>}
                        </form>
                    ) : (
                        <form onSubmit={handleForgotPassword}>
                            <h1>Reset Password</h1>
                            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#ccc' }}>Enter your email to receive a password reset link.</p>
                            <div className="input-box">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                />
                                <i className='bx bxs-envelope'></i>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Request'}
                            </button>
                            <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPassword(false); setError(null); setSuccess(null); }} className="forgot-link">Back to Login</a>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message" style={{ marginTop: '15px', color: 'green', textAlign: 'center' }}>{success}</div>}
                        </form>
                    )}
                </div>

                <div className="form-box register">
                    <form onSubmit={handleRegister}>
                        <h1>Register</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={registerFullName}
                                onChange={(e) => setRegisterFullName(e.target.value)}
                            />
                            <i className='bx bxs-user'></i>
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Username"
                                required
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                            />
                            <i className='bx bxs-user-circle'></i>
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                            />
                            <i className='bx bxs-envelope'></i>
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                            />
                            <i className='bx bxs-lock-alt'></i>
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                required
                                value={registerConfirmPassword}
                                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                            />
                            <i className='bx bxs-lock-alt'></i>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Processing...' : 'Register'}
                        </button>
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message" style={{ marginTop: '15px', color: 'green', textAlign: 'center' }}>{success}</div>}
                    </form>
                </div>

                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>Don't have an account?</p>
                        <button className="btn register-btn" onClick={() => setIsActive(true)}>Register</button>
                    </div>

                    <div className="toggle-panel toggle-right">
                        <h1>Hello!</h1>
                        <p>Already have an account?</p>
                        <button className="btn login-btn" onClick={() => setIsActive(false)}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
