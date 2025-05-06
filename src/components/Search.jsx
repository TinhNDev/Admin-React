import React from 'react';

const Search = ({setParPage, setSearchValue, searchValue}) => {
    return (
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
    );
}; 

export default Search;
