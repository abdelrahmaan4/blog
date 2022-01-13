import axios from 'axios';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { context } from '../../context/Context';
import './topBar.css'

export default function TopBar() {
    const PF = 'http://localhost:5000/images/';
    const { user, dispatch } = useContext(context);
    const handleLogout = async (req, res) => {
        try {

            dispatch({ type: "LOGOUT" })
        } catch (err) {
            console.log(err);
        }

    }

    // const renderUserData = () => {
    //     if (user) {
    //         return (
    //             <Link to="/settings">
    //                 <img className="topImg" src={PF + user.pp} alt="" />
    //             </Link>
    //         )
    //     } else {
    //         return null
    //     }
    // }

    return (
        <div className='top'>
            <div className="topLeft">
                <i className="topIcon fab fa-facebook-square"></i>
                <i className="topIcon fab fa-instagram-square"></i>
                <i className="topIcon fab fa-twitter-square"></i>
            </div>
            <div className="topCenter">
                <ul className="topList">
                    <li className="topListItem"><Link to="/" className="link">HOME</Link></li>
                    <li className="topListItem"><Link to="/" className="link">ABOUT</Link></li>
                    <li className="topListItem"><Link to="/" className="link">CONTACT</Link></li>
                    <li className="topListItem"><Link to="/write" className="link">WRITE</Link></li>
                    <li className="topListItem" onClick={handleLogout}>
                        {user && 'LOGOUT'}
                    </li>
                </ul>
            </div>
            <div className="topRight">
                {
                    user ? (
                        <Link to="/settings">
                            {
                                user.pp ? (<img className="topImg" src={PF + user.pp} alt="" />)
                                    : (<i className="fas fa-user topNoImg"></i>)
                            }

                        </Link>) : (
                        <ul className="topList">
                            <li className="topListItem"><Link to="/login" className="link">LOGIN</Link></li>
                            <li className="topListItem"><Link to="/register" className="link">REGISTER</Link></li>
                        </ul>
                    )
                }
                <i className="topSearchIcon fas fa-search"></i>
            </div>
        </div>
    )
}
