import React, { useState, useRef } from 'react'
import styles from './Login.module.css';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
    const [formData, setFormdata] = useState({
        username: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
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

        if (!formData.username) return toast.error("Username can't be empty", { position: "top-center" });
        if (!formData.password) return toast.error("Password can't be empty", { position: "top-center" });

        console.log(formData);
        toast.success("Login Successful")
        setFormdata({ username: "", password: "" });
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
                            <label htmlFor="username">Username</label>
                            <input onChange={handleData} value={formData.username} type="text" name='username' id='username' placeholder='Your username' autoComplete='username' />
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

                        <button type='submit' className={`${styles.submitBtn}`}>Login</button>
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