import { useState } from "react";
import './sample.css';
import Inventory from "./components/Inventory";
import Transactions from "./components/Transactions";

const Sample: React.FC = () => {

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
                </div>

                <div className="profile-container">
                    <button className="profile-button" onClick={() => setShowProfile(true)}>
                        <div className="profile-avatar"></div>
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
                        <h2>Profile</h2>
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <input type="password" placeholder="Confirm Password" />
                        <button id='register-button'>Update</button>
                    </form>
                    </div>
                </div>
            )
        }

        </div>
    );
}

export default Sample;

