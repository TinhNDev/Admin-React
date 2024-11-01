import React, { useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject, Toolbar } from '@syncfusion/ej2-react-grids';

import { ordersData, contextMenuItems, ordersGrid } from '../data/dummy';
import Header from '../components/Header';

const Product = () => {
    const gridRef = useRef(null);  // Tạo một tham chiếu đến GridComponent

    const handleSearch = (event) => {
        const grid = gridRef.current;  // Lấy tham chiếu của bảng
        if (grid) {
            grid.search(event.target.value);  // Thực hiện tìm kiếm trên bảng với giá trị nhập vào
        }
    };

    const editing = { allowDeleting: true, allowEditing: true };

    return (
        <div className="m-2 md:m-10 mt-16 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Products" />
            <div className="mb-4 flex justify-end">
  <input
    type="text"
    placeholder="Search products..."
    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
    onChange={handleSearch}
  />
</div>



            <GridComponent
                id="gridcomp"
                dataSource={ordersData}
                allowPaging
                allowSorting
                allowExcelExport
                allowPdfExport
                contextMenuItems={contextMenuItems}
                editSettings={editing}
                ref={gridRef}
            >
                <ColumnsDirective>
                    {ordersGrid.map((item, index) => (
                        <ColumnDirective key={index} {...item} />
                    ))}
                </ColumnsDirective>
                <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport, Toolbar]} />
            </GridComponent>
        </div>
    );
};

export default Product;
