import "./home.css"
import Header from "../../components/header/Header"
import Sidebar from "../../components/sideBar/Sidebar"
import Posts from "../../components/posts/Posts"
import axios from "axios"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function Home() {
    const [posts, setPosts] = useState([]);
    const {search} = useLocation();

    useEffect(() => {
        const fetchPosts = async () =>{
            const res = await axios.get('http://localhost:5000/blog/posts'+search);
            setPosts(res.data)
        }
        fetchPosts();
    },[search])
    
    return (
        <>
            <Header />
            <div className="home">
                <Posts posts={posts}/>
                <Sidebar/>
            </div>
        </>
    )
}
