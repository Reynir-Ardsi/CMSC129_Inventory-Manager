import './dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-page">

            {/* Top Bar */}
            <div className="dashboard-bar">
                <h1>Dashboard</h1>
                <div className='buttongroup'>
                    <button id="profile-button">Profile</button>
                    <button id="logout-button">Log-out</button>
                </div>
            </div>

            {/* Body Area */}
            <div className="dashboard-body">
                <div className="dashboard-navbar">
                    <button className="nav-button">Inventory</button>
                    <button className="nav-button">Orders</button>
                    <button className="nav-button">Suppliers</button>
                    <button className="nav-button">Reports</button>
                </div>
                <div className="dashboard-content">
                    <h2>Main Content</h2>
                </div>
            </div>

        </div>
    );
}

export default Dashboard;
