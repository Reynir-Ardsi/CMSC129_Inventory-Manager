import { useState, useEffect } from "react";
import { IoPerson } from "react-icons/io5";
import './dashboard.css';
import Inventory from "./components/Inventory";
import Transactions from "./components/Transactions";
import { auth } from "./firebase";
import { onAuthStateChanged, updatePassword } from "firebase/auth";

const Dashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState("inventory");
    const [showProfile, setShowProfile] = useState<boolean>(false);

    const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);
    const [profileData, setProfileData] = useState({ email: '', username: '' });
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUserUid(user.uid);
                try {
                    const response = await fetch(`http://localhost:5000/api/users/${user.uid}`);
                    if (response.ok) {
                        const data = await response.json();
                        setProfileData({
                            email: data.email || user.email || '',
                            username: data.username || 'User'
                        });
                    } else {
                        setProfileData({ email: user.email || '', username: 'User' });
                    }
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                }
            } else {
                setCurrentUserUid(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage({ type: '', text: '' });

        try {
            if (passwords.newPassword) {
                if (passwords.newPassword !== passwords.confirmPassword) {
                    setStatusMessage({ type: 'error', text: "Passwords do not match!" });
                    return;
                }
                if (auth.currentUser) {
                    await updatePassword(auth.currentUser, passwords.newPassword);
                }
            }

            if (currentUserUid) {
                const response = await fetch(`http://localhost:5000/api/users/${currentUserUid}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: profileData.email,
                        username: profileData.username
                    })
                });

                if (!response.ok) throw new Error("Failed to update database records.");
            }

            setStatusMessage({ type: 'success', text: "Profile updated successfully!" });
            setPasswords({ newPassword: '', confirmPassword: '' });

            setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);

        } catch (error: any) {
            console.error(error);
            setStatusMessage({ type: 'error', text: error.message || "Failed to update profile." });
        }
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-navbar">
                <div className="navbarheader">
                    <div className='navheader'>Dashboard</div>
                </div>

                <div className="subsections">
                    <button className='nav-button' onClick={() => setActiveSection("inventory")}>Inventory</button>
                    <button className='nav-button' onClick={() => setActiveSection("transaction")}>Transactions</button>
                    <button className="nav-button">Reports</button>
                </div>

                <div className="profile-container">
                    <button className="profile-button" onClick={() => setShowProfile(true)}>
                        <div className="profile-avatar">
                            <IoPerson size={24} color="#fff" style={{ marginTop: '3px'}} />
                        </div>
                        <span>{profileData.username || "Loading..."}</span>
                    </button>
                </div>
            </div>
            <div className="dashboard-content">
                {activeSection === "inventory" && <Inventory />}
                {activeSection === "transaction" && <Transactions />}
            </div>

            {showProfile && (
                <div className="modal-overlay" onClick={() => setShowProfile(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleUpdateProfile}>
                            <div id="form-div">
                                <h2>Profile</h2>

                                {statusMessage.text && (
                                    <p style={{ color: statusMessage.type === 'error' ? 'red' : 'green', margin: '5px 0' }}>
                                        {statusMessage.text}
                                    </p>
                                )}

                                <text id='form-header'>Username:</text>
                                <input
                                    id='profile-modal-input'
                                    type="text"
                                    placeholder="Your Name"
                                    value={profileData.username}
                                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                                />

                                <text id='form-header'>Email:</text>
                                <input
                                    id='profile-modal-input'
                                    type="email"
                                    placeholder="email@example.com"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                />

                                <text id='form-header'>New Password (optional):</text>
                                <input
                                    id='profile-modal-input'
                                    type="password"
                                    placeholder='••••••••'
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                />

                                <text id='form-header'>Confirm New Password:</text>
                                <input
                                    id='profile-modal-input'
                                    type="password"
                                    placeholder='••••••••'
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                />

                                <div id='profile-modal-button-container'>
                                    <button id='profile-modal-button' type="submit">Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;