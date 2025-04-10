import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link, Outlet } from 'react-router-dom'; // Thêm Outlet
import Pagination from '../components/Pagination'; 
import { FaEye, FaTrash } from 'react-icons/fa'; 
import { useDispatch, useSelector } from 'react-redux';
import { get_allDriver } from '../store/reducers/driverReducer';
import SortableHeader from '../components/SortableHeader'; // Thêm SortableHeader

const Shipper = () => {
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);
    const [sortField, setSortField] = useState(''); // Thêm state cho sắp xếp
    const [sortOrder, setSortOrder] = useState('asc'); // Thêm state cho thứ tự sắp xếp

    const { drivers, totaldriver } = useSelector(state => state.driver);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
            sortField,
            sortOrder
        };
        dispatch(get_allDriver(obj));
    }, [searchValue, currentPage, parPage, sortField, sortOrder]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    // Hàm sắp xếp dữ liệu theo trường và thứ tự đã chọn
    const getSortedData = () => {
        if (!sortField) return drivers;
        
        return [...drivers].sort((a, b) => {
            let valueA, valueB;
            
            // Xử lý các trường nằm trong Profile
            if (sortField === 'name' || sortField === 'phone_number') {
                valueA = a.Profile[sortField];
                valueB = b.Profile[sortField];
            } else {
                valueA = a[sortField];
                valueB = b[sortField];
            }
            
            // Xử lý các trường đặc biệt
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
    };

    const sortedDrivers = getSortedData();

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>Drivers</h1>

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
                                    label="Status" 
                                    field="status" 
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
                                    className="w-1/5"
                                />
                                <SortableHeader 
                                    label="License plate" 
                                    field="license_plate" 
                                    sortField={sortField} 
                                    sortOrder={sortOrder} 
                                    onSort={handleSort} 
                                    className="w-1/5"
                                />
                                <th scope='col' className='py-3 px-4 w-14 text-left'>Action</th> 
                            </tr>
                        </thead>

                        <tbody>
                            {
                                sortedDrivers.map((dri, index) => (
                                    <tr key={index} className='bg-white border-b hover:bg-gray-50'>
                                        <td className='py-2 px-4 font-medium'>{index + 1}</td>
                                        <td scope='row' className='py-2 px-4 font-medium'>
                                            <img className='w-[45px] h-[45px] rounded-full object-cover' src={dri.Profile.image} alt="" />
                                        </td>
                                        <td scope='row' className='py-2 px-4 font-medium'>{dri.Profile.name}</td>
                                        <td scope='row' className='py-2 px-4 font-medium'>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                dri.status === 'BUSY' ? 'bg-green-100 text-green-800' : 
                                                dri.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' : 
                                                dri.status === 'ONLINE' ?'bg-yellow-100 text-blue-500':
                                                'bg-red-100 text-red-800'

                                            }`}>
                                                {dri.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td scope='row' className='py-2 px-4 font-medium'>{dri.Profile.phone_number}</td>
                                        <td scope='row' className='py-2 px-4 font-medium'>{dri.license_plate}</td>
                                        
                                        <td scope='row' className='py-2 px-4 font-medium'>
                                            <div className='flex justify-start items-center gap-2'>
                                                <Link to={`/admin/shipper/details/${dri.id}`} className='p-[5px] bg-green-500 text-white rounded hover:shadow-lg hover:shadow-green-500/50'> 
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
                        totalItem={totaldriver || 50}
                        parPage={parPage}
                        showItem={3}
                    />
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default Shipper;
