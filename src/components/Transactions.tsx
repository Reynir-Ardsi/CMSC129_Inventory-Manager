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
                </div>

                <button id="additem"><FiPlus /></button>
            </div>

            <div id="invbottom">
                <div className='content-container'>

                </div>

            </div>
        </div>
    );
}

export default Transactions