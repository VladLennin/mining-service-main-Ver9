import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {checkTokenExpiry} from "../../app/services/checkTokenExpire";
import {PulseLoader} from "react-spinners";
import {User} from "../../entity/user/model/types";

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumbers, setPageNumbers] = useState<number[]>([]);
    const navigate = useNavigate();
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const fetchData = async (page: number, limit: number, searchValue: string) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };

            const response = await fetch(`https://modok-back-cold-butterfly-4160.fly.dev/api/user/all?limit=${limit}&page=${page}&value=${searchValue}`, {headers});

            if (!response.ok) {
                throw new Error('Ошибка сервиса!');
            }

            const result = await response.json();
            setData(result.users);
            setTotalPages(result.totalPages);
            updatePageNumbers(result.totalPages, page);
        } catch (err) {
            // @ts-ignore
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updatePageNumbers = (total: number, current: number) => {
        const numbers = [];
        const maxDisplay = 5;

        const startPage = Math.max(1, current - Math.floor(maxDisplay / 2));
        const endPage = Math.min(total, startPage + maxDisplay - 1);

        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i);
        }
        setPageNumbers(numbers);
    };

    useEffect(() => {
        checkTokenExpiry(navigate);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current); // Clear previous timeout
        }

        debounceTimeout.current = setTimeout(() => {
            fetchData(page, limit, searchTerm); // Fetch data after delay
        }, 300); // Adjust delay as needed

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current); // Cleanup on unmount
            }
        };
    }, [page, limit, searchTerm]);

    useEffect(() => {
        updatePageNumbers(totalPages, page);
    }, [totalPages, page]);


    if (loading) return (
        <div className={'h-screen flex items-center justify-center'}>
            <PulseLoader loading={loading}/>
        </div>
    );

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return (<div className={'h-screen flex items-center justify-center'}>
            <PulseLoader loading={loading}/>
        </div>);
    }

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(event.target.value));
        setPage(1); // Reset to first page on limit change
    };

    const formatDate = new Intl.DateTimeFormat("ru", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Europe/Kyiv",
    });

    const formatTime = new Intl.DateTimeFormat("ru", {
        timeStyle: "short",
        timeZone: "Europe/Kyiv",
    });

    const getCorrectDate = (date: Date) => {
        if (date === null) {
            return "-";
        } else {
            const today = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
            );
            const yesterday = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - 1
            );
            const dateForAnalysis = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
            return dateForAnalysis.toISOString() === today.toISOString()
                ? `Сегодня в ${formatTime.format(date)}`
                : dateForAnalysis.toISOString() === yesterday.toISOString()
                    ? `Вчера в ${formatTime.format(date)}`
                    : `${formatDate.format(date)} в ${formatTime.format(date)}`;
        }
    };

    const handleAboutUser = (id: number) => {
        navigate(`/admin/users/${id}`);
    }

    return (
        <div className={'w-full h-full'}>
            <h2 className="text-2xl pb-2">Пользователи</h2>
            <div className={'bg-gray-100 rounded-lg text-sm'}>
                <input
                    type="text"
                    placeholder="Поиск по никнейму, имени или фамилии"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 m-2 border rounded w-96"
                />

                <div className="w-full overflow-x-auto hidden lg:block">
                    <table className="min-w-full">
                        <thead>
                        <tr className="text-sm font-semibold tracking-wide text-center text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                            {['ID', 'Никнейм', 'Имя', 'Фамилия', 'Страна', 'Бот', 'Баланс', 'Заработано', 'Аккаунт создан', 'Приглашен', 'Энергия', 'Диаманты', 'Последнее обновление энергии', 'Награда', 'Реферальный бонус', 'Последний логин'].map((header, index) => (
                                <th key={index} className="px-2 py-1">{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="bg-white">
                        {data.map((user: any, index: number) => (
                            <tr key={index}
                                className="text-gray-700 hover:bg-gray-200 text-center">
                                <td className="px-2 py-1 border text-xs hover:underline hover:cursor-pointer"
                                    onClick={() => handleAboutUser(user.id)}>{user.id || '-'}</td>
                                <td className="px-2 py-1 border text-xs">{user.username || '-'}</td>
                                <td className="px-2 py-1 border text-xs">{user.first_name || '-'}</td>
                                <td className="px-2 py-1 border text-xs">{user.last_name || '-'}</td>
                                <td className="px-2 py-1 border text-xs">{user.language_code || '-'}</td>
                                <td className="px-2 py-1 border text-xs">{user.is_bot ? 'Да' : 'Нет'}</td>
                                <td className="px-2 py-1 border text-xs font-semibold">{user.balance || '-'}</td>
                                <td className="px-2 py-1 border text-xs font-semibold">{user.earned || '-'}</td>
                                <td className="px-2 py-1 border text-xs ">{user.createdAt ? getCorrectDate(new Date(user.createdAt)) : '-'}</td>
                                <td className="px-2 py-1 border text-xs hover:underline hover:cursor-pointer"
                                    onClick={() => handleAboutUser(user.invitedBy)}>{user.invitedBy || '-'}</td>
                                <td className="px-2 py-1 border text-xs">{user.energy || '-'}</td>
                                <td className="px-2 py-1 border text-xs">{user.diamondsBalance || '-'}</td>
                                <td className="px-2 py-1 border text-xs">{user.lastEnergyUpdate ? getCorrectDate(new Date(user.lastEnergyUpdate)) : '-'}</td>
                                <td className="px-2 py-1 border text-xs">
                        <span
                            className={`px-2 py-1 font-semibold leading-tight ${user.rewardCollected ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded-sm`}>
                            {user.rewardCollected ? 'Получена' : 'Нет'}
                        </span>
                                </td>
                                <td className="px-4 py-3 border text-xs">
                        <span
                            className={`px-2 py-1 font-semibold leading-tight ${user.gotRefBonus ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded-sm`}>
                            {user.gotRefBonus ? 'Получен' : 'Нет'}
                        </span>
                                </td>
                                <td className="px-4 py-3 border text-xs">{user.lastLogin ? getCorrectDate(new Date(user.lastLogin)) : '-'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="lg:hidden md:hidden grid grid-cols-1 gap-4 p-2">
                    {data.map((user: any, index: number) => (
                        <div key={index}
                             className="border bg-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow text-sm">
                            <h3 className="flex font-semibold text-lg justify-between">{user.username || 'Не указано'} <p onClick={() => handleAboutUser(user.id)} className={'underline'}>{user.id || 'Не указано'}</p></h3>
                            <p><strong>Имя:</strong> {user.first_name || '-'}</p>
                            <p><strong>Фамилия:</strong> {user.last_name || '-'}</p>
                            <p><strong>Страна:</strong> {user.language_code || '-'}</p>
                            <p><strong>Бот:</strong> {user.is_bot ? 'Да' : 'Нет'}</p>
                            <p><strong>Баланс:</strong> {user.balance || '-'}</p>
                            <p><strong>Заработано:</strong> {user.earned || '-'}</p>
                            <p>
                                <strong>Создан:</strong> {user.createdAt ? getCorrectDate(new Date(user.createdAt)) : '-'}
                            </p>
                            <p className={''}  onClick={() => handleAboutUser(user.invitedBy)}><strong>Приглашен:</strong> <i className={'underline'}>{user.invitedBy || '-'}</i></p>
                            <p><strong>Энергия:</strong> {user.energy || '-'}</p>
                            <p><strong>Диаманты:</strong> {user.diamondsBalance || '-'}</p>
                            <p><strong>Последнее обновление
                                энергии:</strong> {user.lastEnergyUpdate ? getCorrectDate(new Date(user.lastEnergyUpdate)) : '-'}
                            </p>
                            <p><strong>Награда:</strong>
                                <span
                                    className={`px-2 font-semibold leading-tight ${user.rewardCollected ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded-sm`}>
                    {user.rewardCollected ? 'Получена' : 'Нет'}
                </span>
                            </p>
                            <p><strong>Реферальный бонус:</strong>
                                <span
                                    className={`px-2 font-semibold leading-tight ${user.gotRefBonus ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded-sm`}>
                    {user.gotRefBonus ? 'Получен' : 'Нет'}
                </span>
                            </p>
                            <p><strong>Последний
                                логин:</strong> {user.lastLogin ? getCorrectDate(new Date(user.lastLogin)) : '-'}</p>
                        </div>
                    ))}
                </div>


                <div className="flex flex-col lg:flex-row justify-between items-center p-2 gap-2">
                    <div>
                        <label htmlFor="limit-select" className="m-2">Записей на страницу:</label>
                        <select id="limit-select" value={limit} onChange={handleLimitChange} className="m-2">
                            <option value={2}>2</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                        </select>
                    </div>
                    <div className={'flex'}>
                        <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>Предыдущая</button>
                        <div className="flex items-center mx-2">
                            {pageNumbers.map((num) => (
                                <button
                                    key={num}
                                    className={`mx-1 px-2 py-1 ${page === num ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
                                    onClick={() => handlePageChange(num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Следующая
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
