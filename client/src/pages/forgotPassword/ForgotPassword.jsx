import axios from 'axios';
import React, { useState } from 'react'
import "./forgotPassword.css"

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/blog/forgot-password', { email });
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="forgotPassword">
            <span className="fpTitle">Reset Password</span>
            <form className="fpForm" onSubmit={handleSubmit}>
                <label>E-mail</label>
                <input type="text" className="fpInput" placeholder="Enter Your Email..." onChange={(e) => setEmail(e.target.value)} />
                <button className="fpButton" type="submit">Submit</button>
            </form>
        </div>
    )
}
