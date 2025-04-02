import React from 'react';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const Pagination = ({pageNumber, setPageNumber, totalItem, parPage, showItem}) => {

    let totalPage = Math.ceil(totalItem / parPage)
    let startPage = pageNumber

    let dif = totalPage - pageNumber
    if (dif <= showItem) {
        startPage = totalPage - showItem
    }
    let endPage = startPage < 0 ? showItem : showItem + startPage
     
    if (startPage <= 0) {
        startPage = 1
    }

    const createBtn = () => {
        const btns = []
        for (let i = startPage; i < endPage; i++) {
            btns.push(
                <li 
                    key={i}
                    onClick={() => setPageNumber(i)} 
                    className={`${pageNumber === i 
                        ? 'bg-blue-500 shadow-lg shadow-blue-300/50 text-white' 
                        : 'bg-white hover:bg-blue-100 shadow-md hover:shadow-blue-200/50 text-blue-500 border border-blue-200'} 
                        w-[33px] h-[33px] rounded-full flex justify-center items-center cursor-pointer`}
                >
                    {i}                    
                </li>
            ) 
        }
        return btns
    }

    return (
        <ul className='flex gap-3'>
            {
                pageNumber > 1 && 
                <li 
                    onClick={() => setPageNumber(pageNumber - 1)} 
                    className='w-[33px] h-[33px] rounded-full flex justify-center items-center bg-white text-blue-500 cursor-pointer border border-blue-200 hover:bg-blue-50'
                >
                    <MdOutlineKeyboardDoubleArrowLeft />
                </li>
            }
            {
                createBtn()
            }
            {
                pageNumber < totalPage && 
                <li 
                    onClick={() => setPageNumber(pageNumber + 1)} 
                    className='w-[33px] h-[33px] rounded-full flex justify-center items-center bg-white text-blue-500 cursor-pointer border border-blue-200 hover:bg-blue-50'
                >
                    <MdOutlineKeyboardDoubleArrowRight />
                </li>
            }
        </ul>
    )
};

export default Pagination;
