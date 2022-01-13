import './header.css'

export default function Header() {
    return (
        <div className="header">
            <div className="headerTitles">
                <span className="headerTitleSm">React & Node</span>
                <span className="headerTitleLg">Blog</span>
            </div>
            <img 
                className="headerImg" 
                src="https://cdn.wallpapersafari.com/8/81/3ZPS9q.png" 
                alt="" 
            />
        </div>
    )
}
