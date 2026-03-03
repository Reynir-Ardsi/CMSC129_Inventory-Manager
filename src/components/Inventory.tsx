import { useState, useEffect } from 'react';
import './inventory.css';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiRefreshCcw } from "react-icons/fi";

interface Item {
    id: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
}

const API_URL = 'http://localhost:5000/api/inventory';

const Inventory: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', category: 'Electronics', quantity: 0, price: 0 });
    const [isEditing, setIsEditing] = useState(false);
    
    // Toggle between Active inventory and Soft-Deleted items
    const [viewMode, setViewMode] = useState<'active' | 'deleted'>('active');

    // Fetch items based on view mode
    const fetchItems = async () => {
        try {
            const query = viewMode === 'deleted' ? '?deleted=true' : '';
            const response = await fetch(`${API_URL}${query}`);
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [viewMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await fetch(`${API_URL}/${formData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }
            setIsModalOpen(false);
            fetchItems(); 
        } catch (error) {
            console.error("Error saving item:", error);
        }
    };

    const handleSoftDelete = async (id: string) => {
        if (!window.confirm("Move this item to the recycle bin?")) return;
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleRestore = async (id: string) => {
        try {
            await fetch(`${API_URL}/${id}/restore`, { method: 'PUT' });
            fetchItems();
        } catch (error) {
            console.error("Error restoring item:", error);
        }
    };

    const openEditModal = (item: Item) => {
        setFormData(item);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setFormData({ id: '', name: '', category: 'Electronics', quantity: 0, price: 0 });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return(
        <div>
            <div id="invtop" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div className='nav-wrapper' style={{ display: 'flex', gap: '15px' }}>
                    <div className="search-wrapper">
                        <input id="search-bar" placeholder="Search"/>
                        <button id="searchbutton"><FiSearch/></button>
                    </div>

                    <select className="sort-button">
                        <option value="All">All Categories</option>
                        <option value="Electronics">Electronics</option>
                    </select>

                    <button 
                        onClick={() => setViewMode(viewMode === 'active' ? 'deleted' : 'active')}
                        style={{ padding: '10px', backgroundColor: viewMode === 'active' ? '#ff4d4f' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        {viewMode === 'active' ? 'View Recycle Bin' : 'View Active Inventory'}
                    </button>
                </div>

                {viewMode === 'active' && <button id="additem" onClick={openAddModal}><FiPlus /></button>}
            </div>

            <div id="invbottom">
                <div className='content-container' style={{ padding: '20px', overflowY: 'auto' }}>
                    <h2 style={{marginTop: 0}}>{viewMode === 'active' ? 'Active Inventory' : 'Recycle Bin'}</h2>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                        <thead style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                            <tr>
                                <th style={{ padding: '12px' }}>Name</th>
                                <th style={{ padding: '12px' }}>Category</th>
                                <th style={{ padding: '12px' }}>Quantity</th>
                                <th style={{ padding: '12px' }}>Price</th>
                                <th style={{ padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No items found.</td></tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{item.name}</td>
                                        <td style={{ padding: '12px' }}>{item.category}</td>
                                        <td style={{ padding: '12px' }}>{item.quantity}</td>
                                        <td style={{ padding: '12px' }}>${item.price}</td>
                                        <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                                            {viewMode === 'active' ? (
                                                <>
                                                    <button onClick={() => openEditModal(item)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#007bff' }}><FiEdit2 size={18} /></button>
                                                    <button onClick={() => handleSoftDelete(item.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'orange' }}><FiTrash2 size={18} /></button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleRestore(item.id)} title="Restore" style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'green' }}><FiRefreshCcw size={18} /></button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal code remains exactly the same as before */}
            {isModalOpen && (
                 <div className="modal-overlay" onClick={() => setIsModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                 <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                     <h2 style={{ margin: 0 }}>{isEditing ? "Edit Item" : "Add New Item"}</h2>
                     <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                         <input type="text" placeholder="Item Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                         <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                             <option value="Electronics">Electronics</option>
                             <option value="Sports">Sports</option>
                             <option value="Food">Food</option>
                         </select>
                         <input type="number" placeholder="Quantity" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                         <input type="number" placeholder="Price" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                         <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                             <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                 {isEditing ? "Update Item" : "Save Item"}
                             </button>
                             <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                 Cancel
                             </button>
                         </div>
                     </form>
                 </div>
             </div>
            )}
        </div>
    );
}

export default Inventory;