import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/UseAuth';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            navigate("/");
            await logout();
        } catch (error) {
            console.log(error.response?.data?.message || "Logout failed");
        }
    };

    return (
        <>
            <h1>Hello {user.name}! </h1>
            <h2>welcome to Ziplify</h2>
            <p>We are currently working on it! see you soon</p>

            <br />
            {user ? <button onClick={handleLogout}>Logout</button> : ""}
        </>
    )
}

export default Dashboard;