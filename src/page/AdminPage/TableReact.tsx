import {useEffect, useState} from "react";

interface BoosterStatistic {
    title: string;
    type: string;
    totalBought: number | string; // может быть числом или строкой
    totalActivated: number | string; // может быть числом или строкой
}

// @ts-ignore
const TableReact = ({boosterStatistics}) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [productList, setProductList] = useState<BoosterStatistic[]>(boosterStatistics);
    const [rowsLimit] = useState<number>(5);
    const [rowsToShow, setRowsToShow] = useState<BoosterStatistic[]>(productList.slice(0, rowsLimit));
    const [currentPage, setCurrentPage] = useState<number>(0);

    const searchProducts = (keyword: string) => {
        keyword = keyword.toLowerCase();
        setSearchValue(keyword);
        if (keyword) {
            const results = boosterStatistics.filter((product: { type: string , title:string;}) =>
                product.type.toLowerCase().includes(keyword) || product.title.toLowerCase().includes(keyword)
            );
            setProductList(results);
            setRowsToShow(results.slice(0, rowsLimit));
            setCurrentPage(0);
        } else {
            clearData();
        }
    };

    const clearData = () => {
        setSearchValue("");
        setProductList(boosterStatistics);
        setRowsToShow(boosterStatistics.slice(0, rowsLimit));
        setCurrentPage(0);
    };

    const changePage = (value: number) => {
        const startIndex = value * rowsLimit;
        const newArray = productList.slice(startIndex, startIndex + rowsLimit);
        setRowsToShow(newArray);
        setCurrentPage(value);
    };

    const nextPage = () => {
        if (currentPage < Math.ceil(productList.length / rowsLimit) - 1) {
            changePage(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 0) {
            changePage(currentPage - 1);
        }
    };

    useEffect(() => {
        setRowsToShow(productList.slice(0, rowsLimit));
    }, [productList, rowsLimit]);

    return (
            <div className="w-full lg:text-base text-sm">
                <div className="flex justify-end bg-gray-200 px-2 mt-2 py-2 border-b-0 border-black h-[50px] rounded-t-xl">
                    <input
                        type="text"
                        className="w-full text-sm bg-white border border-transparent rounded-lg px-2 placeholder:text-black text-black"
                        placeholder="Поиск по названию.."
                        onChange={(e) => searchProducts(e.target.value)}
                        value={searchValue}
                    />
                </div>
                <div className="overflow-x-scroll md:overflow-auto">
                    <table className="table-auto w-full text-left border">
                        <thead>
                        <tr className="bg-gray-300 border">
                            <th className="py-3 px-3">Название</th>
                            <th className="py-3 px-3">Тип</th>
                            <th className="py-3 px-3">Всего куплено</th>
                            <th className="py-3 px-3">Всего активировано</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rowsToShow.map((data, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                                <td className="py-2 px-3">{data.title}</td>
                                <td className="py-2 px-3">{data.type}</td>
                                <td className="py-2 px-3">{data.totalBought}</td>
                                <td className="py-2 px-3">{data.totalActivated}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                    {/*<div className="flex justify-between mt-2.5 px-1 items-center">*/}
                    {/*    <div>*/}
                    {/*        Показано {currentPage * rowsLimit + 1} до {Math.min((currentPage + 1) * rowsLimit, productList.length)} из {productList.length} бустеров*/}
                    {/*    </div>*/}
                    {/*    <div className="flex">*/}
                    {/*        <button onClick={previousPage} disabled={currentPage === 0}>&lt;</button>*/}
                    {/*        <span>{currentPage + 1}</span>*/}
                    {/*        <button onClick={nextPage} disabled={currentPage >= Math.ceil(productList.length / rowsLimit) - 1}>&gt;</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
            </div>
    );
};

export default TableReact