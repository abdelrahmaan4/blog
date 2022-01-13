import axios from 'axios';
import { useContext, useState } from 'react'
import Sidebar from '../../components/sideBar/Sidebar'
import { context } from '../../context/Context'
import './settings.css'

export default function Settings() {
    const PF = 'http://localhost:5000/images/';
    const { user, dispatch } = useContext(context);
    const [file, setFile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'UPDATE_START' })
        const updatedUser = {
            userId: user._id,
            email,
            password,
            token: user.token,
        };
        if (file) {
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            updatedUser.pp = filename;

            try {
                await axios.post('http://localhost:5000/uploadimg', data);
            } catch (err) { }
        } else {

        }
        try {
            const res = await axios.put("http://localhost:5000/blog/users/" + user._id, updatedUser, { headers: { "x-access-token": user.token } });
            setSuccess(true)
            dispatch({ type: 'UPDATE_SUCCESS', payload: res.data })
        } catch (err) {
            dispatch({ type: 'UPDATE_FAILURE' })
        }


    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/blog/users/${user._id}`, {
                data: { username: user.username },
                headers: { "x-access-token": user.token }
            });
            dispatch({ type: 'LOGOUT' });
            window.location.replace('/')
        } catch (error) {

        }
    }

    return (
        <div className="settings">
            <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className="settingsUpdateTitle">Update Your Account</span>
                    <span className="settingsDeleteTitle" onClick={handleDelete}>Delete Account</span>
                </div>
                <form className="settingsForm" onSubmit={handleSubmit}>
                    <label>Profile Picture</label>
                    <div className="settingsPP">
                        <img
                            src={file ? URL.createObjectURL(file) : PF + user.pp}
                            alt=""
                        />
                        <label htmlFor="fileInput">
                            <i className="settingsPPIcon fas fa-user"></i>
                        </label>
                        <input type="file" id="fileInput" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
                    </div>
                    <label>Email</label>
                    <input type="email" defaultValue={user.email} onChange={(e) => setEmail(e.target.value)} />
                    <label>Password</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} />
                    <button className="settingsSubmit" type="submit">Update</button>
                    {success && <span style={{ color: 'green' }}>Profile is updated...</span>}
                </form>
            </div>
            <Sidebar />
        </div>
    )
}
