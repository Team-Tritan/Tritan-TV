import React, { Component } from 'react';
import Img from '../img/upload.png';
import '../css/Navbar.css';

class Navbar extends Component {
    state = {  

        pages: [ 
            {name: <img className='upload-icon' src={Img} />, css:"nav-link normal"},
            {name: "Login", css:"nav-link special", href: "/login"}
        ]
    }
    render() { 
        return ( 
            <div>
                <nav className='box-shadow'>
                    <div className='logo'><a href='/'><span className="logo-part-1">[</span>Tritan.tv<span className="logo-part-2">]</span></a></div>
                    <div className='input'>
                        <input className='nav-search' placeholder="Search Tritan"></input>
                        <a className='search-button'>Search</a>
                    </div>
                    <ul className="nav-links">
                        {this.state.pages.map(page => <li className={page.css} key={page.name}><a href={page.href}>{page.name}</a></li>)}
                    </ul>
                </nav>
            </div>
         );
    }
}
 
export default Navbar;