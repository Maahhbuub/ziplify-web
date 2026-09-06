import React from 'react'
import styles from './Signup.module.css';
import { Link } from 'react-router-dom';

function Signup() {

    return (
        <div className={`${styles.signup} box-grid`}>
            <div className={`${styles.wrapper}`}>
                <div className={`${styles.header}`}>
                    <h2>Signup</h2>
                    <p>Signup to your ziplify account</p>
                </div>

                <div className={`${styles.signupField}`}>
                    <form action="#">
                        <div className={`${styles.field}`}>
                            <label htmlFor="username">Username</label>
                            <input type="text" id='username' placeholder='Your username' />
                        </div>

                        <div className={`${styles.field}`}>
                            <label htmlFor="password">Password</label>
                            <input type="password" id='password' placeholder='Your password' />
                        </div>

                        <div className={`${styles.field}`}>
                            <label htmlFor="ConfirmPassword">Confirm Password</label>
                            <input type="password" id='ConfirmPassword' placeholder='Confirm Your password' />
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