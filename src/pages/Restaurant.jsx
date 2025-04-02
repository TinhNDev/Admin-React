import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination'; 
import { FaEye, FaTrash, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'; 
import { useDispatch, useSelector } from 'react-redux';
import {get_allRestaurant} from '../store/reducers/restaurantReducer';

const Restaurant = () => {
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const { restaurants, totalRestaurant } = useSelector(state => state.restaurant);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
            sortField,
            sortOrder
        };
        dispatch(get_allRestaurant(obj));
    }, [searchValue, currentPage, parPage, sortField, sortOrder]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) {
            return <FaSort className="ml-1 inline" />;
        }
        return sortOrder === 'asc' ? <FaSortUp className="ml-1 inline" /> : <FaSortDown className="ml-1 inline" />;
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>Restaurant</h1>

         <div className='w-full p-4 bg-white rounded-md shadow-sm'> 
            <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />

            <div className='relative overflow-x-auto mt-5'>
                <table className='w-full text-sm text-left text-gray-700 bg-white'>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-100 border-b'>
                        <tr>
                            <th scope='col' className='py-3 px-4 cursor-pointer' onClick={() => handleSort('id')}>
                                No {getSortIcon('id')}
                            </th>
                            <th scope='col' className='py-3 px-4'>Image</th>
                            <th scope='col' className='py-3 px-4 cursor-pointer' onClick={() => handleSort('name')}>
                                Name {getSortIcon('name')}
                            </th>
                            <th scope='col' className='py-3 px-4 cursor-pointer' onClick={() => handleSort('phone_number')}>
                                Phone {getSortIcon('phone_number')}
                            </th>
                            <th scope='col' className='py-3 px-4 cursor-pointer' onClick={() => handleSort('address_x')}>
                                Address {getSortIcon('address_x')}
                            </th>
                            <th scope='col' className='py-3 px-4'>Action</th> 
                        </tr>
                    </thead>

                    <tbody>
                        {
                            restaurants.map((res, index) => (
                                <tr key={index} className='bg-white border-b hover:bg-gray-50'>
                                    <td className='py-2 px-4 font-medium whitespace-nowrap'>{index + 1}</td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <img className='w-[45px] h-[45px] rounded-full object-cover' src={res.image} alt="" />
                                    </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>{res.name}</td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>{res.phone_number}</td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>{res.address_x}</td>
                                    
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <div className='flex justify-start items-center gap-4'>
                                            <Link to={`/admin/restaurant/details/${res.id}`} className='p-[6px] bg-green-500 text-white rounded hover:shadow-lg hover:shadow-green-500/50'> 
                                                <FaEye/> 
                                            </Link>
                                            <Link className='p-[6px] bg-red-500 text-white rounded hover:shadow-lg hover:shadow-red-500/50'> 
                                                <FaTrash/> 
                                            </Link> 
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody> 
                </table> 
            </div>  

            <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                <Pagination 
                    pageNumber={currentPage}
                    setPageNumber={setCurrentPage}
                    totalItem={totalRestaurant || 50}
                    parPage={parPage}
                    showItem={3}
                />
            </div>
        </div>
    </div>
    );
};

export default Restaurant;
