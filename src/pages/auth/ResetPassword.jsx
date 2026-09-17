import React, { useState } from 'react'
import styles from './ResetPassword.module.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import api from '../../api/api';

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePassword = () => setShowPassword(p => !p);
    const toggleConfirm = () => setShowConfirm(p => !p);

    const handleData = (event) => {
        const { name, value } = event.target;
        setFormData(curr => ({ ...curr, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.password) return toast.error("Password can't be empty");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
        if (!formData.confirmPassword) return toast.error("Please confirm your password");
        if (formData.password !== formData.confirmPassword) return toast.error("Passwords don't match");

        setLoading(true);
        try {
            await api.post(`/auth/reset-password?token=${token}`, { password: formData.password });
            toast.success("Password reset successfully");
            console.log(formData);
            navigate('/auth/login');
            setFormData({ password: '', confirmPassword: '' });

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.resetPassword} box-grid`}>
            <div className={styles.wrapper}>

                <div className={styles.iconBadge}>
                    <KeyRound size={28} strokeWidth={1.8} />
                </div>

                <div className={styles.header}>
                    <h2>Reset Password</h2>
                    <p>Choose a strong new password for your account.</p>
                </div>

                <div className={styles.resetField}>
                    <form action="#" onSubmit={handleSubmit}>

                        <div className={styles.field}>
                            <label htmlFor="password">New Password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    onChange={handleData}
                                    value={formData.password}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                />
                                <span
                                    onPointerDown={e => e.preventDefault()}
                                    onClick={togglePassword}
                                    className={styles.eyeIcon}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </span>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    onChange={handleData}
                                    value={formData.confirmPassword}
                                    type={showConfirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                />
                                <span
                                    onPointerDown={e => e.preventDefault()}
                                    onClick={toggleConfirm}
                                    className={styles.eyeIcon}
                                >
                                    {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`${styles.submitBtn} ${loading ? 'btn-loading' : ''}`}
                        >
                            {loading ? 'Resetting…' : 'Reset Password'}
                        </button>
                    </form>
                </div>

                <div className={styles.goLogin}>
                    Remembered it? <Link to="/auth/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
