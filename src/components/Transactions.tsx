import './inventory.css';
import { FiSearch } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";

const Transactions: React.FC = () => {
    return(
        <div>
            <div id="invtop">
                <div className='nav-wrapper'>
                    <div className="search-wrapper">
                        <input id="search-bar" placeholder="Search"/>
                        <button id="searchbutton"><FiSearch/></button>
                    </div>

                    <select className="sort-button">
                        <option value="option1">All</option>
                        <option value="option2">Buyer</option>
                        <option value="option3">Supplier</option>
                    </select>

                    
                    <select className="sort-button">
                        <option value="default">Default Sort</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="quantity-asc">Quantity (Low to High)</option>
                        <option value="quantity-desc">Quantity (High to Low)</option>
                        <option value="price-asc">Price (Low to High)</option>
                        <option value="price-desc">Price (High to Low)</option>
                    </select>
                    
                </div>

                <button id="additem"><FiPlus /></button>
            </div>

            <div id="invbottom">
                <div className='content-container'>
                    <table id='inv-table'>
                        <thead id="table-header-group">
                            <tr>
                                <th id='table-headers'>Name</th>
                                <th id='table-headers'>Category</th>
                                <th id='table-headers'>Quantity</th>
                                <th id='table-headers'>Activity</th>
                                <th id='table-headers'>Actions</th>
                            </tr>
                        </thead>
                            <tbody><tr><td id='td' colSpan={5}>No items found.</td></tr></tbody>
                        {/* <tbody>
                            {items.length === 0 ? (
                                <tr><td id='td' colSpan={5}>No items found.</td></tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td id='item-display'>{item.name}</td>
                                        <td id='item-display'>{item.category}</td>
                                        <td id='item-display'>{item.quantity}</td>
                                        <td id='item-display'>${item.price}</td>
                                        <td id='action-display'>
                                            {viewMode === 'active' ? (
                                                <>
                                                    <button onClick={() => openEditModal(item)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#007bff' }}><FiEdit2 size={18} /></button>
                                                    <button onClick={() => handleSoftDelete(item.id)} title="Send to Recycle Bin" style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'orange' }}><FiTrash2 size={18} /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleRestore(item.id)} title="Restore" style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'green' }}><FiRefreshCcw size={18} /></button>
                                                    <button onClick={() => handleHardDelete(item.id)} title="Permanent Delete" style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'red' }}><FiAlertOctagon size={18} /></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody> */}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Transactions