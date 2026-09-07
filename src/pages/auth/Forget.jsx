import React, { useState } from 'react'
import styles from './Forget.module.css'

import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


function Forget() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    let handleData = (event) => {
        setEmail(event.target.value);
    }

    let handleSubmit = (event) => {
        event.preventDefault();

        if (!email) {
            toast.error("Email can't be empty");
            return;
        }

        console.log(email);
        toast.success("Email send successfully");
        setEmail("");

        navigate('/auth/login');
    }

    return (
        <div className={`${styles.forget} box-grid`}>
            <div className={`${styles.wrapper}`}>
                <div className={`${styles.header}`}>
                    <h2>Forget</h2>
                    <p>We'll send a password reset link to your inbox.</p>
                </div>

                <div className={`${styles.forgetField}`}>
                    <form action="#" onSubmit={handleSubmit}>
                        <div className={`${styles.field}`}>
                            <label htmlFor="email">Email</label>
                            <input onChange={handleData} value={email} type="email" name='email' id='email' placeholder='Your email address' autoComplete='email' />
                        </div>

                        <button type='submit' className={`${styles.submitBtn}`}>Send</button>
                    </form>
                </div>

                <div className={`${styles.goLogin}`}>
                    Remember your password? <Link to='/auth/login'>Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Forget;