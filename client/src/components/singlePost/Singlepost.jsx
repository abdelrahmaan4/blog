import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { context } from '../../context/Context';
import './singlepost.css'

export default function Singlepost() {
    const PF = "http://localhost:5000/images/";
    const loc = useLocation();
    const path = loc.pathname.split("/")[2];
    const [post, setPost] = useState({});
    const { user } = useContext(context);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [updateMode, setUpdateMode] = useState(false)



    useEffect(() => {
        const getPost = async () => {
            const res = await axios.get(`http://localhost:5000/blog/posts/${path}`);
            setPost(res.data);
            setTitle(res.data.title);
            setDesc(res.data.desc);
        };
        getPost();
    }, [path]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/blog/posts/${path}`, {
                data: { username: user.username },
                headers: { "x-access-token": user.token }
            });
            window.location.replace('/')
        } catch (error) {

        }
    }

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/blog/posts/${path}`, {
                username: user.username, title, desc,
            }, { headers: { "x-access-token": user.token } });
            // window.location.reload(); 
            setUpdateMode(false);
        } catch (error) {

        }
    }

    return (
        <div className="singlepost">
            <div className="singlePostWrapper">
                {post.photo &&
                    <img
                        src={PF + post.photo}
                        alt=""
                        className="singlePostImg"
                    />
                }{
                    updateMode ? <input type="text" value={title} className="singlePostTitleInput" autoFocus onChange={(e) => setTitle(e.target.value)} /> :

                        <h1 className="singlePostTitle">
                            {title}
                            {post.username === user?.username && (
                                <div className="singlePostEdit">
                                    <i className="singlePostIcon fas fa-edit" onClick={() => setUpdateMode(true)} />
                                    <i className="singlePostIcon fas fa-trash" onClick={handleDelete}></i>
                                </div>
                            )}

                        </h1>
                }
                <div className="singlePostInfo">
                    <span className="singlePostAuthor">
                        Author:
                        <Link className="link" to={`/?user=${post.username}`}>
                            <b>{post.username}</b>
                        </Link>
                    </span>
                    <span className="singlePostDate">{new Date(post.createdAt).toDateString()}</span>
                </div>
                {updateMode ? (<textarea className="singlePostDescInput" value={desc} onChange={(e) => setDesc(e.target.value)} />) : (
                    <p className="singlePostDesc">
                        {desc}
                    </p>
                )}
                {updateMode && <button className="singlePostButton" onClick={handleUpdate}>Update</button>}

            </div>
        </div>
    )
}
