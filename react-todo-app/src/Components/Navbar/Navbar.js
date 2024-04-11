import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser } from 'react-icons/fa';
import '../../CSS/navbar.css'
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    const [signedInUser, setSignedInUser] = useState({});
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate(); 


    function logOut() {
        sessionStorage.removeItem('signedInUser');
        setSignedInUser({});
        navigate('/');
    }

    useEffect(() => {
        const savedUser = sessionStorage.getItem('signedInUser');
        if (savedUser) {
            const parsedSavedUser = savedUser ? JSON.parse(savedUser) : {};
            setSignedInUser(parsedSavedUser)
        }
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    return (
        <nav className="navbar">
            <Link to="/Home">
                <div className="h3 fw-bold title">To-Do</div>
            </Link>
            {/* Render based on signedInUser */}
            <div id="userNameIcon" className="fs-4" onClick={toggleDropdown}>
                <div className="userIconBox d-flex align-items-center">
                    {signedInUser && signedInUser.username}
                    {<FaUser className="ms-2 userIcon" />}
                </div>
                {showDropdown && (
                    <div className="dropdown">
                        <Link to="/settings" className="dropdown-option">Setting</Link>
                        <div className="dropdown-option" onClick={logOut}>Logout</div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
