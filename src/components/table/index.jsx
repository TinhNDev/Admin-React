import React, { useState, useEffect } from 'react';
import './table.scss';

function Table(props) {
    const { limit, bodyData = [], headData, renderHead, renderBody } = props;

    const initDataShow = limit ? bodyData.slice(0, Number(limit)) : bodyData;
    const [dataShow, setDataShow] = useState(initDataShow);

    let pages = 1;
    let range = [];

    if (limit && bodyData.length) {
        let page = Math.floor(bodyData.length / Number(limit));
        pages = (bodyData.length % Number(limit) === 0) ? page : page + 1;
        range = [...Array(pages).keys()];
    }

    const [currPage, setCurrPage] = useState(0);

    const selectPage = page => {
        const start = Number(limit) * page;
        const end = start + Number(limit);
        setDataShow(bodyData.slice(start, end));
        setCurrPage(page);
    };

    // Reset dataShow khi bodyData hoặc limit thay đổi
    useEffect(() => {
        if (limit) {
            setDataShow(bodyData.slice(0, Number(limit)));
            setCurrPage(0);
        } else {
            setDataShow(bodyData);
            setCurrPage(0);
        }
    }, [bodyData, limit]);

    return (
        <div className="table">
            <div className="table-wrapper">
                <table className="w-full">
                    {headData && renderHead && (
                        <thead>
                            <tr>
                                {headData.map((item, index) => renderHead(item, index))}
                            </tr>
                        </thead>
                    )}
                    {bodyData && renderBody && (
                        <tbody>
                            {dataShow.map((item, index) => renderBody(item, index))}
                        </tbody>
                    )}
                </table>
            </div>
            {pages > 1 && (
                <div className="table__pagination">
                    {range.map((item, index) => (
                        <div
                            key={index}
                            className={`table__pagination-item ${currPage === index ? 'active' : ''}`}
                            onClick={() => selectPage(index)}
                        >
                            {item + 1}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Table;
