import { useState } from "react";
import { IoPerson } from "react-icons/io5";
import './dashboard.css';
import Inventory from "./components/Inventory";
import Transactions from "./components/Transactions";

const Dashboard: React.FC = () => {

    const [activeSection, setActiveSection] = useState("inventory");
    const [showProfile, setShowProfile] = useState<boolean>(false);

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
                        <span>Rainier RJ Espinal</span>
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
                    <form>
                        <div id="form-div">
                            <h2>Profile</h2>
                            <text id='form-header'>Email:</text>
                            <input id='profile-modal-input' type="email" placeholder="rjespinal6404@gmail.com" />
                            <text id='form-header'>Password:</text>
                            <input id='profile-modal-input' type="password" placeholder='••••••••'/>
                            <text id='form-header'>Confirm Password:</text>
                            <input id='profile-modal-input' type="password" placeholder='••••••••'/>
                                <div id='profile-modal-button-container'>
                                    <button id='profile-modal-button'>Update</button>
                                </div>
                        </div>
                    </form>
                    </div>
                </div>
            )
        }

        </div>
    );
}

export default Dashboard;
