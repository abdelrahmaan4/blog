import axios from 'axios';
import React, { useRef } from 'react'
import { useLocation } from 'react-router';
import './resetpassword.css'

export default function ResetPassword() {

    const passRef = useRef();
    const loc = useLocation();
    const path = loc.pathname.split("/")[2];
    const confirmPassRef = useRef();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.get(`http://localhost:5000/blog/reset-password/${path}`, {
                newPassword: passRef.current.value,
                confirmPassword: confirmPassRef.current.value,
            });
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="resetPassword">
            <span className="rpTitle">Reset Password</span>
            <form className="rpForm" onSubmit={handleSubmit}>
                <label>New Password</label>
                <input type="password" className="rpInput" placeholder="Enter Your new password..." ref={passRef} />
                <label>Confirm Password</label>
                <input type="password" className="rpInput" placeholder="Confrim Your password..." ref={confirmPassRef} />
                <button className="rpButton" type="submit">Change Password</button>
            </form>
        </div>
    )
}
