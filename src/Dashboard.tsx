import './dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-page">

            {/* Top Bar */}
            <div className="dashboard-bar">
                <h1 id='header'>Dashboard</h1>
            </div>

            {/* Body Area */}
            <div className="dashboard-body">
                <div className="dashboard-navbar">
                    <div className="dashboard-buttons">
                        <button className="nav-button">Inventory</button>
                        <button className="nav-button">Transactions</button>

                    </div>
                    <div>
                        <button className="profile-button">Rainier RJ Espinal</button>
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
