import React from 'react';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const Pagination = ({ pageNumber, setPageNumber, totalItem, parPage, showItem }) => {
    const totalPage = Math.ceil(totalItem / parPage);
    
    // Tính toán startPage và endPage
    let startPage = Math.max(1, pageNumber - Math.floor(showItem / 2));
    let endPage = Math.min(totalPage, startPage + showItem - 1);
    
    // Điều chỉnh nếu không đủ showItem
    if (endPage - startPage + 1 < showItem) {
        startPage = Math.max(1, endPage - showItem + 1);
    }

    const createBtn = () => {
        const btns = [];
        for (let i = startPage; i <= endPage; i++) {
            if (i < 1 || i > totalPage) continue; // Đảm bảo chỉ tạo nút hợp lệ
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
        return btns;
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
