import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination'; 
import { FaEye, FaTrash } from 'react-icons/fa'; 
import { useDispatch, useSelector } from 'react-redux';
import {get_allRestaurant} from '../store/reducers/restaurantReducer';

const Restaurant = () => {
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    const { restaurants, totalRestaurant } = useSelector(state => state.restaurant);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        };
        dispatch(get_allRestaurant(obj));
    }, [searchValue, currentPage, parPage]);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>Restaurant</h1>

         <div className='w-full p-4 bg-[#e5e4eb] rounded-md'> 
        <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />


         <div className='relative overflow-x-auto mt-5'>
    <table className='w-full text-sm text-left text-[#000000]'>
        <thead className='text-sm text-[#000000] uppercase border-b border-slate-700'>
        <tr>
            <th scope='col' className='py-3 px-4'>No</th>
            <th scope='col' className='py-3 px-4'>Image</th>
            <th scope='col' className='py-3 px-4'>Name</th>
            <th scope='col' className='py-3 px-4'>Phone</th>
            <th scope='col' className='py-3 px-4'>Address</th>
    
            <th scope='col' className='py-3 px-4'>Action</th> 
        </tr>
        </thead>

        <tbody>
            {
                restaurants.map((res,index) =>( <tr key={index}>
                <td className='py-1 px-4 font-medium whitespace-nowrap'>{index + 1}</td>
                <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                    {/* <img className='w-[45px] h-[45px]' src={`../data/avatar.png`} alt="" /> */}
                </td>
                <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{res.name}</td>
                <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{res.phone_number}</td>
                <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{res.address_x} </td>
                 
                <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                    <div className='flex justify-start items-center gap-4'>
                    <Link to={`/admin/restaurant/details/${res.id}`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'> <FaEye/> </Link>
                    <Link className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'> <FaTrash/> </Link> 
                    </div>
                    
                    </td>
            </tr>     ))
            }

            
        </tbody> 
    </table> 
    </div>  

    <div className='w-full flex justify-end mt-4 bottom-4 right-4 '>
        <Pagination 
            pageNumber = {currentPage}
            setPageNumber = {setCurrentPage}
            totalItem = {50}
            parPage = {parPage}
            showItem = {3}
        />
        </div>


           
         </div>
        </div>
    );
};

export default Restaurant;