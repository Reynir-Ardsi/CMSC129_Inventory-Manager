import { useState, useEffect, useMemo } from 'react';
import './inventory.css';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiRefreshCcw, FiAlertOctagon } from "react-icons/fi";

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
    const [formData, setFormData] = useState({ id: '', name: '', category: 'Electronics', quantity: '', price: '' });
    const [isEditing, setIsEditing] = useState(false);

    const [viewMode, setViewMode] = useState<'active' | 'deleted'>('active');

    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOption, setSortOption] = useState('default');

    const [deleteModalConfig, setDeleteModalConfig] = useState<{isOpen: boolean, id: string, type: 'soft' | 'hard'}>({
        isOpen: false,
        id: '',
        type: 'soft'
    });

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
            const payload = {
                ...formData,
                quantity: parseInt(formData.quantity),
                price: parseFloat(formData.price)
            };

            if (isEditing) {
                await fetch(`${API_URL}/${formData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            setIsModalOpen(false);
            fetchItems();

        } catch (error) {
            console.error(error);
        }
    };

    const handleSoftDelete = (id: string) => {
        setDeleteModalConfig({ isOpen: true, id, type: 'soft' });
    };

    const handleHardDelete = (id: string) => {
        setDeleteModalConfig({ isOpen: true, id, type: 'hard' });
    };

    const executeDelete = async () => {
        const { id, type } = deleteModalConfig;
        try {
            if (type === 'soft') {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            } else {
                await fetch(`${API_URL}/${id}/hard`, { method: 'DELETE' });
            }
            fetchItems();
            setDeleteModalConfig({ isOpen: false, id: '', type: 'soft' });
        } catch (error) {
            console.error(`Error ${type} deleting item:`, error);
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
        setFormData({
            id: item.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity.toString(),
            price: item.price.toString()
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setFormData({ id: '', name: '', category: 'Electronics', quantity: '', price: '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const processedItems = useMemo(() => {
        let result = [...items];

        if (searchQuery) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(item => item.category === selectedCategory);
        }

        result.sort((a, b) => {
            switch (sortOption) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'quantity-asc': return a.quantity - b.quantity;
                case 'quantity-desc': return b.quantity - a.quantity;
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                default: return 0;
            }
        });

        return result;
    }, [items, searchQuery, selectedCategory, sortOption]);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchQuery(searchInput);
        }
    };

    return(
        <div>
            <div id="invtop">
                <div className='nav-wrapper'>
                    <div className="search-wrapper">
                        <input
                            id="search-bar"
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                        <button id="searchbutton" onClick={() => setSearchQuery(searchInput)}>
                            <FiSearch/>
                        </button>
                    </div>

                    <select
                        className="sort-button"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Sports">Sports</option>
                        <option value="Food">Food</option>
                        <option value="Health&Beauty">Health&Beauty</option>
                        <option value="Clothing">Clothing</option>
                        <option value="School Supplies">School Supplies</option>
                        <option value="Pet Care">Pet Care</option>
                    </select>

                    <select
                        className="sort-button"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="default">Default Sort</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="quantity-asc">Quantity (Low to High)</option>
                        <option value="quantity-desc">Quantity (High to Low)</option>
                        <option value="price-asc">Price (Low to High)</option>
                        <option value="price-desc">Price (High to Low)</option>
                    </select>

                    <button id={viewMode === 'active' ? 'recycle-active' : 'recycle-deleted'}
                        onClick={() => setViewMode(viewMode === 'active' ? 'deleted' : 'active')}>
                        {viewMode === 'active' ? 'View Recycle Bin' : 'View Active Inventory'}
                    </button>
                </div>

                {viewMode === 'active' && <button id="additem" onClick={openAddModal}><FiPlus /></button>}
            </div>

            <div id="invbottom">
                <div className='content-container'>
                    <table id='inv-table'>
                        <thead id="table-header-group">
                            <tr>
                                <th id='table-headers'>Name</th>
                                <th id='table-headers'>Category</th>
                                <th id='table-headers'>Quantity</th>
                                <th id='table-headers'>Price</th>
                                <th id='table-headers'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedItems.length === 0 ? (
                                <tr><td id='td' colSpan={5}>No items found.</td></tr>
                            ) : (
                                processedItems.map((item) => (
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
                        </tbody>
                    </table>

                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 id='dashboard-modal-header'>{isEditing ? "Edit Item" : "Add New Item"}</h2>
                        <form onSubmit={handleSubmit}>

                            <text id='form-header'>Item Name:</text>
                            <input id='modal-input' type="text" placeholder="e.g. Speaker" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />

                            <text id='form-header'>Category:</text>
                            <div id='category-div'>
                            <select id='item-category' value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option value="Electronics">Electronics</option>
                                <option value="Sports">Sports</option>
                                <option value="Food">Food</option>
                                <option value="Health&Beauty">Health&Beauty</option>
                                <option value="Clothing">Clothing</option>
                                <option value="School Supplies">School Supplies</option>
                                <option value="Pet Care">Pet Care</option>
                            </select>
                            </div>

                            <text id='form-header'>Quantity:</text>
                            <input
                                id='modal-input'
                                type="text"
                                placeholder="0pcs"
                                required
                                value={formData.quantity}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d+$/.test(value)) {
                                    setFormData({ ...formData, quantity: value });
                                    }
                                }}
                                />
                            <text id='form-header'>Price:</text>
                            <input
                                id='modal-input'
                                type="text"
                                placeholder="$0.0"
                                required
                                value={formData.price}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d*$/.test(value)) {
                                    setFormData({ ...formData, price: value });
                                    }
                                }}
                                />

                            <div id='modal-button-div'>
                                <button id='modal-button' type="submit">
                                    {isEditing ? "Update Item" : "Save Item"}
                                </button>
                                <button id='modal-button' type="button" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModalConfig.isOpen && (
                <div className="modal-overlay" onClick={() => setDeleteModalConfig({ isOpen: false, id: '', type: 'soft' })}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 id='dashboard-modal-header' style={{ color: deleteModalConfig.type === 'hard' ? 'red' : 'inherit' }}>
                            {deleteModalConfig.type === 'hard' ? 'Permanent Delete' : 'Move to Recycle Bin'}
                        </h2>

                        <p style={{ margin: '20px 0', fontSize: '16px', color: '#333' }}>
                            {deleteModalConfig.type === 'hard'
                                ? "WARNING: This will permanently delete the item from the database. This action cannot be undone. Continue?"
                                : "Are you sure you want to move this item to the recycle bin?"}
                        </p>

                        <div id='modal-button-div'>
                            <button
                                id='modal-button'
                                style={{ backgroundColor: deleteModalConfig.type === 'hard' ? '#dc3545' : '#ffc107', color: deleteModalConfig.type === 'hard' ? 'white' : 'black', border: 'none' }}
                                onClick={executeDelete}
                            >
                                {deleteModalConfig.type === 'hard' ? 'Yes, Delete' : 'Yes, Move'}
                            </button>
                            <button id='modal-button' type="button" onClick={() => setDeleteModalConfig({ isOpen: false, id: '', type: 'soft' })}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inventory;