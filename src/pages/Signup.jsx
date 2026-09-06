import React, { useState, useRef } from 'react'
import styles from './Signup.module.css';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

function Signup() {

    const [formData, setFormdata] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const passwordRef = useRef(null);
    const confirmRef = useRef(null);

    const togglePassword = () => setShowPassword(p => !p);
    const toggleConfirm = () => setShowConfirm(p => !p);

    const handleData = (event) => {
        const { name, value } = event.target;
        setFormdata((curr) => ({
            ...curr,
            [name]: value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.username) return toast.error("Username can't be empty", { position: "top-center" });
        if (!formData.email) return toast.error("Email can't be empty", { position: "top-center" });
        if (!formData.password) return toast.error("Password can't be empty", { position: "top-center" });
        if (!formData.confirmPassword) return toast.error("Please confirm your password", { position: "top-center" });
        if (formData.password !== formData.confirmPassword) return toast.error("Passwords don't match", { position: "top-center" });

        console.log(formData);
        toast.success("Verify your email", { position: "top-center" })
        setFormdata({ username: "", email: "", password: "", confirmPassword: "" });
    }

    return (
        <div className={`${styles.signup} box-grid`}>
            <div className={`${styles.wrapper}`}>
                <div className={`${styles.header}`}>
                    <h2>Signup</h2>
                    <p>Signup to your ziplify account</p>
                </div>

                <div className={`${styles.signupField}`}>
                    <form action="#" onSubmit={handleSubmit}>
                        <div className={`${styles.field}`}>
                            <label htmlFor="username">Username</label>
                            <input onChange={handleData} value={formData.username} type="text" name='username' id='username' placeholder='Your username' autoComplete='username' />
                        </div>

                        <div className={`${styles.field}`}>
                            <label htmlFor="email">Email</label>
                            <input onChange={handleData} value={formData.email} type="email" name='email' id='email' placeholder='Your email address' autoComplete='email' />
                        </div>

                        <div className={`${styles.field}`}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.passwordWrapper}>
                                <input ref={passwordRef} onChange={handleData} value={formData.password} type={showPassword ? 'text' : 'password'} name='password' id='password' placeholder='Your password' autoComplete='new-password' />
                                <span onMouseDown={(e) => e.preventDefault()} onClick={togglePassword} className={styles.eyeIcon}>
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </span>
                            </div>
                        </div>

                        <div className={`${styles.field}`}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className={styles.passwordWrapper}>
                                <input ref={confirmRef} onChange={handleData} value={formData.confirmPassword} type={showConfirm ? 'text' : 'password'} name='confirmPassword' id='confirmPassword' placeholder='Confirm Your password' autoComplete='new-password' />
                                <span onPointerDown={(e) => e.preventDefault()} onClick={toggleConfirm} className={styles.eyeIcon}>
                                    {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                                </span>
                            </div>
                        </div>

                        <button type='submit' className={`${styles.submitBtn}`}>Signup</button>
                    </form>
                </div>

                <div className={`${styles.newAcc}`}>
                    Already have an account? <Link to='/auth/login'>Login</Link>
                </div>
            </div>

        </div>
    )
}

export default Signup;
