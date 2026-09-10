import React, { useState, useRef } from 'react'
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/UseAuth';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormdata] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const passwordRef = useRef(null);

    const togglePassword = () => setShowPassword(p => !p);

    let handleData = (event) => {
        const { name, value } = event.target;
        setFormdata((curr) => ({
            ...curr,
            [name]: value
        }))
    }

    let handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.email) return toast.error("Email can't be empty");
        if (!formData.password) return toast.error("Password can't be empty");

        setLoading(true);
        try {
            await login(formData);
            toast.success("Login Successful");
            setFormdata({ email: "", password: "" });
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`${styles.login} box-grid`}>
            <div className={`${styles.wrapper}`}>
                <div className={`${styles.header}`}>
                    <h2>Login</h2>
                    <p>Login to your ziplify account</p>
                </div>

                <div className={`${styles.loginField}`}>
                    <form action="#" onSubmit={handleSubmit}>
                        <div className={`${styles.field}`}>
                            <label htmlFor="email">Email</label>
                            <input onChange={handleData} value={formData.email} type="email" name='email' id='email' placeholder='Your email' autoComplete='email' />
                        </div>

                        <div className={`${styles.field}`}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.passwordWrapper}>
                                <input ref={passwordRef} onChange={handleData} value={formData.password} type={showPassword ? 'text' : 'password'} name='password' id='password' placeholder='Your password' autoComplete='current-password' />
                                <span onPointerDown={(e) => e.preventDefault()} onClick={togglePassword} className={styles.eyeIcon}>
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </span>
                            </div>
                        </div>

                        <div className={`${styles.forget}`}>
                            <Link to='/auth/forget'>Forget password?</Link>
                        </div>

                        <button type='submit' className={`${styles.submitBtn} ${loading ? 'btn-loading' : ''}`}>Login</button>
                    </form>
                </div>

                <div className={`${styles.newAcc}`}>
                    Don't have account? <Link to='/auth/signup'>Signup</Link>
                </div>
            </div>

        </div>
    )
}

export default Login;