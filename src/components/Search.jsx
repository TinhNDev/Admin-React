import React from 'react';
import { FaSearch } from 'react-icons/fa'; 

const Search = ({setParPage, setSearchValue, searchValue}) => {
    return (
        <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
                <span className="text-gray-700 text-xl italic">Hiện thị</span>
                <select 
                    onChange={(e) => setParPage(parseInt(e.target.value))} 
                    className='px-4 py-2 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option> 
                </select>
            </div>
            <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                    <FaSearch />
                </span>
                <input 
                    onChange={(e) => setSearchValue(e.target.value)} 
                    value={searchValue} 
                    className='pl-10 pr-4 py-2 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' 
                    type="text" 
                    placeholder='Tìm kiếm' 
                /> 
            </div>
        </div>
    );
}; 

export default Search;
