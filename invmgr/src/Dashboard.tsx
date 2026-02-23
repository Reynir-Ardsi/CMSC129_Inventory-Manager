import './dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-page">

            {/* Top Bar */}
            <div className="dashboard-bar">
                <h1 id='header'>Dashboard</h1>
                {/* <div className='buttongroup'>
                    <button id="profile-button">Profile</button>
                    <button id="logout-button">Log-out</button>
                </div> */}
            </div>

            {/* Body Area */}
            <div className="dashboard-body">
                <div className="dashboard-navbar">
                    <div className="dashboard-buttons">
                        <button className="nav-button">Inventory</button>
                        <button className="nav-button">Orders</button>
                        <button className="nav-button">Suppliers</button>
                        <button className="nav-button">Reports</button>
                    </div>
                    <div>
                        <button className="profile-button">Settings</button>
                    </div>
                </div>
                <div className="dashboard-content">
                    <div className='main-content'>
                    <h2>Main Content</h2>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Dashboard;
