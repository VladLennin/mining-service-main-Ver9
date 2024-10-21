import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState<string>("users");
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        const path = location.pathname.split('/').pop();
        // @ts-ignore
        setSelectedTab(path);
    }, [location]);

    const handleTabClick = (tab: string) => {
        setSelectedTab(tab);
        setIsSidebarOpen(false); // Закрыть боковое меню при нажатии на вкладку
    };

    return (
        <div className={'lg:w-1/6 w-full h-[55px] z-50'}>
            <header className="flex justify-between items-center p-4 bg-gray-500 lg:hidden">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
                    &#9776; {/* Иконка гамбургера */}
                </button>
            </header>

            <div
                className={`bg-gray-500 lg:w-1/6 h-full flex flex-col lg:items-center px-4 lg:p-0 fixed inset-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:translate-x-0`}>
                <div className="p-4 flex justify-between items-center">
                    <p className="text-2xl text-white">Modok Admin Panel</p>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-white scale-150 lg:hidden">
                        &times; {/* Иконка закрытия */}
                    </button>
                </div>
                <hr className="border-gray-400"/>
                <div className="flex flex-col pt-4 items-center justify-center gap-4">
                    {['users', 'appStats', 'promoters', 'tools'].map((tab) => (
                        <Link to={`/admin/${tab}`} key={tab} onClick={() => handleTabClick(tab)}
                              className={'w-full'}>
                            <div
                                className={`flex items-center justify-center w-full h-10 rounded-xl cursor-pointer hover:bg-gray-600 hover:text-gray-200 ${selectedTab === tab ? 'bg-gray-600 text-gray-200' : ''}`}
                            >
                                <p className="text-left px-2 w-full">
                                    {tab === 'users' ? 'Пользователи' :
                                        tab === 'appStats' ? 'Статистика по приложению' :
                                            tab === 'promoters' ? 'Статистика по промоутерам' :
                                                'Инструменты'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
