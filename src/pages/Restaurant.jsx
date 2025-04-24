import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link, Outlet } from 'react-router-dom'; 
import Pagination from '../components/Pagination'; 
import { FaEye, FaTrash } from 'react-icons/fa'; 
import { useDispatch, useSelector } from 'react-redux';
import { get_allRestaurant } from '../store/reducers/restaurantReducer';
import SortableHeader from '../components/SortableHeader';


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
            search: searchValue,
            sortField,
            sortOrder
        };
        dispatch(get_allRestaurant(obj));
    }, [searchValue, currentPage, parPage, sortField, sortOrder]);
    

    useEffect(() => {
        setCurrentPage(1);
    }, [parPage, searchValue]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getSortedData = () => {
        let data = [...restaurants];
    
        // Sắp xếp nếu có sortField
        if (sortField) {
            data.sort((a, b) => {
                let valueA = a[sortField];
                let valueB = b[sortField];
    
                // Xử lý trường hợp đặc biệt
                if (sortField === 'id') {
                    valueA = parseInt(valueA);
                    valueB = parseInt(valueB);
                } else if (typeof valueA === 'string') {
                    valueA = valueA.toLowerCase();
                    valueB = valueB.toLowerCase();
                }
    
                if (valueA < valueB) {
                    return sortOrder === 'asc' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortOrder === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
    
      
        const startIndex = (currentPage - 1) * parPage;
        const endIndex = startIndex + parPage;
        return data.slice(startIndex, endIndex);
    };
    

    const sortedRestaurants = getSortedData();

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-2xl mb-3'>Restaurant</h1>

            <div className='w-full p-4 bg-white rounded-md shadow-sm'> 
                <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />

                <div className='relative overflow-x-auto mt-5'>
                    <table className='w-full text-sm text-left text-gray-700 bg-white'>
                        <thead className='text-xs text-gray-700 uppercase bg-gray-100 border-b'>
                            <tr>
                                <SortableHeader 
                                    label="No" 
                                    field="id" 
                                    sortField={sortField} 
                                    sortOrder={sortOrder} 
                                    onSort={handleSort} 
                                    className="w-14"
                                />
                                <th scope='col' className='py-3 px-4 w-16'>Image</th>
                                <SortableHeader 
                                    label="Name" 
                                    field="name" 
                                    sortField={sortField} 
                                    sortOrder={sortOrder} 
                                    onSort={handleSort} 
                                    className="w-1/5"
                                />
                                <SortableHeader 
                                    label="Phone" 
                                    field="phone_number" 
                                    sortField={sortField} 
                                    sortOrder={sortOrder} 
                                    onSort={handleSort} 
                                    className="w-1/6"
                                />
                                <SortableHeader 
                                    label="Status" 
                                    field="status" 
                                    sortField={sortField} 
                                    sortOrder={sortOrder} 
                                    onSort={handleSort} 
                                    className="w-1/6"
                                />
                                <SortableHeader 
                                    label="Address" 
                                    field="address" 
                                    sortField={sortField} 
                                    sortOrder={sortOrder} 
                                    onSort={handleSort} 
                                    className="w-1/4"
                                />
                                <th scope='col' className='py-3 px-4 w-14 text-left'>Action</th> 
                            </tr>
                        </thead>

                        <tbody>
                            {
                                sortedRestaurants.map((res, index) => (
                                    <tr key={index} className='bg-white border-b hover:bg-blue-300'>
                                        <td className='py-2 px-4 font-medium'>
                                            {(currentPage - 1) * parPage + index + 1}
                                        </td>
                                        <td scope='row' className='py-2 px-4 font-medium'>
                                            <img className='w-[45px] h-[45px] rounded-full object-cover' src={res.image} alt="" />
                                        </td>
                                        <td scope='row' className='py-2 px-4 font-medium'>{res.name}</td>
                                        <td scope='row' className='py-2 px-4 font-medium'>{res.phone_number}</td>
                                        <td scope='row' className='py-2 px-4 font-medium'>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                res.status === 'active' ? 'bg-green-100 text-green-800' : 
                                                res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {res.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td scope='row' className='py-2 px-4 font-medium truncate max-w-xs'>{res.address}</td>
                                        
                                        <td scope='row' className='py-2 px-4 font-medium'>
                                            <div className='flex justify-start items-center gap-2'>
                                                <Link to={`/admin/restaurant/details/${res.id}`} className='p-[5px] bg-green-500 text-white rounded hover:shadow-lg hover:shadow-green-500/50'> 
                                                    <FaEye size={14}/> 
                                                </Link>
                                                <Link className='p-[5px] bg-red-500 text-white rounded hover:shadow-lg hover:shadow-red-500/50'> 
                                                    <FaTrash size={14}/> 
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
                        totalItem={totalRestaurant}
                        parPage={parPage}
                        showItem={3}
                    />
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default Restaurant;
