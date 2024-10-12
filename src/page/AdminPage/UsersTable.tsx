import React, {useEffect, useState} from 'react';
import {User} from "../../entity/user/model/types";

// @ts-ignore
const UsersTable = ({data}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredData = data.filter((user: User) =>
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleScroll = (event: any) => {
        event.preventDefault();
        const container = document.getElementById('scroll-container');
        if (container) {
            container.scrollLeft += event.deltaY;
        }
    };

    return (
        <div className={'bg-gray-100 rounded-lg'}>
            <input
                type="text"
                placeholder="Поиск по никнейму, имени или фамилии"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" p-2 m-2 border rounded w-full"
            />
            <div className="w-full overflow-x-auto" id="scroll-container" >

                <table className="w-full">
                    <thead>
                    <tr className="text-md font-semibold tracking-wide text-center text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                        {['ID', 'Никнейм', 'Имя', 'Фамилия', 'Страна', 'Бот', 'Баланс', 'Заработано', 'Создан', 'Приглашен', 'Энергия', 'Диаманты', 'Последнее обновление энергии', 'Награда', 'Реферальный бонус', 'Последний логин'].map((header, index) => (
                            <th key={index} className="px-4 py-3">{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white" onWheel={handleScroll} >
                    {currentItems.map((user: any, index: number) => (
                        <tr key={index} className="text-gray-700 hover:bg-gray-200 hover:underline hover:cursor-pointer">
                            <td className="px-4 py-3 border">{user.id}</td>
                            <td className="px-4 py-3 border text-sm">{user.username}</td>
                            <td className="px-4 py-3 border text-sm">{user.first_name}</td>
                            <td className="px-4 py-3 border text-sm">{user.last_name}</td>
                            <td className="px-4 py-3 border text-sm">{user.language_code}</td>
                            <td className="px-4 py-3 border text-sm">{user.is_bot}</td>
                            <td className="px-4 py-3 border text-sm font-semibold">{user.balance}</td>
                            <td className="px-4 py-3 border text-sm font-semibold">{user.earned}</td>
                            <td className="px-4 py-3 border text-sm">{user.createAt}</td>
                            <td className="px-4 py-3 border text-sm">{user.invitedBy}</td>
                            <td className="px-4 py-3 border text-sm">{user.energy}</td>
                            <td className="px-4 py-3 border text-sm">{user.diamondsBalance}</td>
                            <td className="px-4 py-3 border text-sm">{new Date(user.lastEnergyUpdate).toLocaleDateString()}</td>
                            <td className="px-4 py-3 border text-sm">
                                <span
                                    className={`px-2 py-1 font-semibold leading-tight ${user.rewardCollected ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded-sm`}>
                                    {user.rewardCollected ? 'Получена' : 'Нет'}
                                </span>
                            </td>
                            <td className="px-4 py-3 border text-sm">
                                <span
                                    className={`px-2 py-1 font-semibold leading-tight ${user.gotRefBonus ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded-sm`}>
                                    {user.gotRefBonus ? 'Получен' : 'Нет'}
                                </span>
                            </td>
                            <td className="px-4 py-3 border text-sm">{new Date(user.lastLogin).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>
            <div className="flex justify-between items-center px-2 pb-2">
                <div><span>Страница {currentPage} из {totalPages}</span></div>
                <div>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 border rounded"
                    >
                        Назад
                    </button>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 border rounded"
                    >
                        Вперед
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UsersTable;
