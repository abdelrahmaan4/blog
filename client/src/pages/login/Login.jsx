import './login.css'
import { Link } from 'react-router-dom'
import { useContext, useRef } from 'react';
import { context } from '../../context/Context';
import axios from 'axios';


export default function Login() {

    const emailRef = useRef();
    const passwordRef = useRef();
    const { dispatch, isFetching } = useContext(context);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post("http://localhost:5000/blog/login", {
                email: emailRef.current.value,
                password: passwordRef.current.value,
            });
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data })

        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE" });
        }
    };

    return (
        <div className="login">
            <span className="loginTitle">Login</span>
            <form className="loginForm" onSubmit={handleSubmit}>
                <label>E-mail</label>
                <input type="text" className="loginInput" placeholder="Enter Your Email..." ref={emailRef} />
                <label>Password</label>
                <input type="password" className="loginInput" placeholder="Enter Your Password..." ref={passwordRef} />
                <button className="loginButton" type="submit" disabled={isFetching}>Login</button>
            </form>
            <button className="loginRegisterButton">
                <Link to="/register" className="link">REGISTER</Link>
            </button>
            <button className="forgotRegisterButton">
                <Link to="/ForgotPassword" className="link">FORGOT PASSWORD</Link>
            </button>
        </div>
    )
}
