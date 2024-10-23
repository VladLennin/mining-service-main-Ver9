import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {checkTokenExpiry} from "../../app/services/checkTokenExpire";
import {PulseLoader} from "react-spinners";
import {User} from "../../entity/user/model/types";
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import ReactSlider from "react-slider";
import FilterIcon from '../../assets/filter-svgrepo-com.svg'
import SortIcon from '../../assets/sort-amount-up-svgrepo-com.svg'
import SortUpIcon from '../../assets/arrow-up-svgrepo-com.svg'
import EarnIcon from '../../assets/cashback-ui-web-svgrepo-com.svg'
import CoinsIcon from '../../assets/coins-svgrepo-com.svg'
import LanguageIcon from '../../assets/language-translation-svgrepo-com.svg'
import ReferralsIcon from '../../assets/people-team-svgrepo-com.svg'
import DiamondsIcon from '../../assets/diamonds-svgrepo-com.svg'

const UsersPage = () => {
    const animatedComponents = makeAnimated();
    const token = localStorage.getItem('token');
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumbers, setPageNumbers] = useState<number[]>([]);
    const navigate = useNavigate();
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [sortOption, setSortOption] = useState("balance");
    const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [isBot, setIsBot] = useState<boolean>(false);

    const [ranges, setRanges] = useState({
        param1: [0, 0],
        param2: [0, 0],
        param3: [0, 0],
        param4: [0, 0],
    });
    const [selectedRanges, setSelectedRanges] = useState({
        param1: [0, 0],
        param2: [0, 0],
        param3: [0, 0],
        param4: [0, 0],
    });


    const fetchData = async (
        page: number,
        limit: number,
        searchValue: string,
        sortOption: string,
        sortDirection: "ASC" | "DESC",
        selectedLanguages: string[],
        isBot: boolean,
        selectedRanges: { param1: number[], param2: number[], param3: number[], param4: number[] }
    ) => {
        setError(null);
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };
            const languages = selectedLanguages.length > 0 ? selectedLanguages.join(',') : '';
            const botFilter = isBot ? '&isBot=1' : '';

            const url = `https://modok-play-back.online/api/user/all?limit=${limit}&page=${page}&value=${searchValue}&sortOrder=${sortDirection}&sortBy=${sortOption}&languageCode=${languages}${botFilter}&minBalance=${selectedRanges.param1[0]}${selectedRanges.param1[1] > 0 ? `&maxBalance=${selectedRanges.param1[1]}` : ''}&minEarned=${selectedRanges.param2[0]}${selectedRanges.param2[1] > 0 ? `&maxEarned=${selectedRanges.param2[1]}` : ''}&minDiamondsBalance=${selectedRanges.param3[0]}${selectedRanges.param3[1] > 0 ? `&maxDiamondsBalance=${selectedRanges.param3[1]}` : ''}&minReferrals=${selectedRanges.param4[0]}${selectedRanges.param4[1] > 0 ? `&maxReferrals=${selectedRanges.param4[1]}` : ''}`;

            const response = await fetch(url, {headers});
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

    const getFiltersInfo = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };
            const response = await fetch(`https://modok-play-back.online/api/admin/filters`, {headers});

            if (!response.ok) {
                throw new Error('Ошибка сервиса!');
            }

            const result = await response.json();
            setSelectedRanges({
                param1: [Number(result.minMaxValues.minBalance), Number(result.minMaxValues.maxBalance)],
                param2: [result.minMaxValues.minEarned, result.minMaxValues.maxEarned],
                param3: [result.minMaxValues.minDiamondsBalance, result.minMaxValues.maxDiamondsBalance],
                param4: [result.minMaxValues.minReferrals, result.minMaxValues.maxReferrals],
            });
            setRanges({
                param1: [Number(result.minMaxValues.minBalance), Number(result.minMaxValues.maxBalance)],
                param2: [result.minMaxValues.minEarned, result.minMaxValues.maxEarned],
                param3: [result.minMaxValues.minDiamondsBalance, result.minMaxValues.maxDiamondsBalance],
                param4: [result.minMaxValues.minReferrals, result.minMaxValues.maxReferrals],
            });
        } catch (err) {
            // @ts-ignore
            setError(err.message);
        }
    }

    const updatePageNumbers = (total: number, current: number) => {
        const numbers = [];
        const maxDisplay = 8;

        // Добавляем первую страницу
        if (total > 0) numbers.push(1);

        const startPage = Math.max(2, current - Math.floor(maxDisplay / 2));
        const endPage = Math.min(total - 1, startPage + maxDisplay - 3); // Уменьшаем диапазон для оставшегося места

        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i);
        }

        // Добавляем последнюю страницу, если она не отображается
        if (total > 1) numbers.push(total);

        setPageNumbers(numbers);
    };

    useEffect(() => {
        checkTokenExpiry(navigate);
        fetchData(page, limit, searchTerm, sortOption, sortDirection, selectedLanguages, isBot, selectedRanges);
    }, [selectedRanges]);

    useEffect(() => {
        getFiltersInfo()
        fetchData(page, limit, searchTerm, sortOption, sortDirection, selectedLanguages, isBot, selectedRanges); // Fetch data after delay
    }, [page, limit, searchTerm, sortOption, sortDirection, selectedLanguages, isBot]);

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
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); // Сбросить на первую страницу при изменении поиска

        // Очистить предыдущий таймер
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Установить новый таймер для обновления данных
        searchTimeout.current = setTimeout(() => {
            fetchData(1, limit, e.target.value, sortOption, sortDirection, selectedLanguages, isBot, selectedRanges);
        }, 100); // Вызов API с небольшой задержкой, чтобы избежать частых запросов
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

    const toggleFilterDropdown = () => {
        setShowFilterDropdown(prev => {
            if (showSortDropdown) {
                setShowSortDropdown(false);
            }
            return !prev;
        });
    };
    const toggleSortDropdown = () => {
        setShowSortDropdown(prev => {
            if (showFilterDropdown) {
                setShowFilterDropdown(false);
            }
            return !prev;
        });
    };
    const handleSortChange = (option: string) => {
        setSortOption(option);
        console.log(option)
        setShowSortDropdown(false); // Close the dropdown after selecting
        setPage(1); // Reset to first page on sort change
    };
    const handleDirectionChange = (direction: "ASC" | "DESC") => {
        setSortDirection(direction);
        setShowSortDropdown(false);
        setPage(1); // Reset to first page on direction change
    };

    const handleAboutUser = (id: number) => {
        navigate(`/admin/users/${id}`);
    }
    const languageOptions = [
        {value: 'en', label: 'English'},
        {value: 'ru', label: 'Russian'},
        {value: 'uk', label: 'Ukrainian'},
        {value: 'ar', label: 'Arabic'},
        {value: 'es', label: 'Spanish'},
        {value: 'uz', label: 'Uzbek'},
        {value: 'lv', label: 'Latvian'},
        {value: 'fr', label: 'French'},
        {value: 'pt-br', label: 'Portuguese (Brazil)'},
        {value: 'ro', label: 'Romanian'},
        {value: 'ko', label: 'Korean'},
        {value: 'ca', label: 'Catalan'},
        {value: 'de', label: 'German'},
        {value: 'da', label: 'Danish'},
        {value: 'tr', label: 'Turkish'},
        {value: 'nb', label: 'Norwegian Bokmål'},
        {value: 'pt-pt', label: 'Portuguese (Portugal)'},
        {value: 'it', label: 'Italian'},
        {value: 'th', label: 'Thai'},
        {value: 'zh-hans', label: 'Chinese (Simplified)'},
        {value: 'sr', label: 'Serbian'},
        {value: 'hu', label: 'Hungarian'},
        {value: 'be', label: 'Belarusian'},
        {value: 'el', label: 'Greek'}
    ];
    // @ts-ignore
    const handleLanguageChange = (selectedOptions) => {
        // @ts-ignore
        const selectedLanguages = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedLanguages(selectedLanguages);
    };
    const handleBotChange = () => {
        setIsBot(prev => !prev);
    };
    const handleSliderChange = (param: any, values: any) => {
        setSelectedRanges((prevState) => ({
            ...prevState,
            [param]: values,
        }));

    };

    return (
        <div className={'w-full h-full '}>
            <h2 className="text-2xl pb-2">Пользователи</h2>
            <div className={'bg-gray-100 rounded-lg text-sm w-full'}>
                <div className={'flex w-full relative lg:flex-row flex-col'}>
                    <input
                        type="text"
                        placeholder="Поиск по никнейму, имени или фамилии"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 m-2 border rounded lg:w-96 "
                    />
                    <div className={'flex items-center justify-center px-2 gap-4 lg:w-1/4'}>
                        <div className="relative w-1/2">
                            <button onClick={toggleFilterDropdown}
                                    className="p-2 border rounded bg-gray-200 w-full flex items-center lg:justify-around justify-center lg:gap-0 gap-4">
                                <img src={FilterIcon} alt={''} width={18} height={18}/>Фильтры
                            </button>
                            {showFilterDropdown && (
                                <div
                                    className="absolute lg:right-1 transform translate-x-1/6 mt-2 bg-white border rounded shadow-lg p-2 flex flex-col gap-4 w-72 ">
                                    <div>
                                        <p className={'pb-2'}>Фильтр по языкам:</p>
                                        <Select
                                            isMulti
                                            options={languageOptions}
                                            components={animatedComponents}
                                            className="basic-multi-select z-50"
                                            classNamePrefix="select"
                                            placeholder={'Выберите язык(и)'}
                                            onChange={handleLanguageChange}
                                            value={languageOptions.filter(option => selectedLanguages.includes(option.value))}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="mb-2">По балансу</h4>
                                        <ReactSlider
                                            className="w-full h-2 bg-gray-300 rounded-md flex items-center "
                                            thumbClassName="h-5 w-5 bg-blue-500 rounded-full cursor-pointer"
                                            trackClassName="bg-blue-500 h-2"
                                            value={selectedRanges.param1}
                                            min={ranges.param1[0]}
                                            max={ranges.param1[1]}
                                            onChange={(values) => handleSliderChange('param1', values)}
                                            minDistance={1}
                                        />
                                        <div className={'flex items-center justify-between px-1 pt-2'}>
                                            <p>{selectedRanges.param1[0]}</p>
                                            <p>{selectedRanges.param1[1]}</p>
                                        </div>
                                    </div>

                                    {/* Слайдер для параметра 2 */}
                                    <div>
                                        <h4 className="mb-2">По заработаным</h4>
                                        <ReactSlider
                                            className="w-full h-2 bg-gray-300 rounded-md flex items-center"
                                            thumbClassName="h-5 w-5 bg-blue-500 rounded-full cursor-pointer"
                                            trackClassName="bg-blue-500 h-2"
                                            value={selectedRanges.param2}
                                            min={ranges.param2[0]}
                                            max={ranges.param2[1]}
                                            onChange={(values) => handleSliderChange('param2', values)}
                                            minDistance={1}
                                        />
                                        <div className={'flex items-center justify-between px-1 pt-2'}>
                                            <p>{selectedRanges.param2[0]}</p>
                                            <p>{selectedRanges.param2[1]}</p>
                                        </div>
                                    </div>

                                    {/* Слайдер для параметра 3 */}
                                    <div>
                                        <h4 className="mb-2">По алмазам</h4>
                                        <ReactSlider
                                            className="w-full h-2 bg-gray-300 rounded-md flex items-center"
                                            thumbClassName="h-5 w-5 bg-blue-500 rounded-full cursor-pointer"
                                            trackClassName="bg-blue-500 h-2"
                                            value={selectedRanges.param3}
                                            min={ranges.param3[0]}
                                            max={ranges.param3[1]}
                                            onChange={(values) => handleSliderChange('param3', values)}
                                            minDistance={1}
                                        />
                                        <div className={'flex items-center justify-between px-1 pt-2'}>
                                            <p>{selectedRanges.param3[0]}</p>
                                            <p>{selectedRanges.param3[1]}</p>
                                        </div>
                                    </div>

                                    {/* Слайдер для параметра 4 */}
                                    <div>
                                        <h4 className="mb-2">По рефералам</h4>
                                        <ReactSlider
                                            className="w-full h-2 bg-gray-300 rounded-md flex items-center"
                                            thumbClassName="h-5 w-5 bg-blue-500 rounded-full cursor-pointer"
                                            trackClassName="bg-blue-500 h-2"
                                            value={selectedRanges.param4}
                                            min={ranges.param4[0]}
                                            max={ranges.param4[1]}
                                            onChange={(values) => handleSliderChange('param4', values)}
                                            minDistance={1}
                                        />
                                        <div className={'flex items-center justify-between px-1 pt-2'}>
                                            <p>{selectedRanges.param4[0]}</p>
                                            <p>{selectedRanges.param4[1]}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className={'flex items-center justify-start gap-2'}>
                                            <input
                                                type="checkbox"
                                                checked={isBot}
                                                onChange={handleBotChange}
                                            />
                                            Только боты

                                        </label>

                                    </div>

                                </div>
                            )}
                        </div>
                        <div className="relative w-1/2">
                            <button onClick={toggleSortDropdown}
                                    className="p-2 border rounded bg-gray-200 w-full flex items-center lg:justify-around justify-center lg:gap-0 gap-4">
                                <img src={SortIcon} alt={''} width={18} height={18}/>Сортировать
                            </button>
                            {showSortDropdown && (
                                <div
                                    className="absolute lg:left-1/2 left-1/3 transform -translate-x-1/2 mt-2 bg-white border rounded shadow-lg p-2 flex flex-col gap-4 w-64">
                                    <p className="cursor-pointer pt-2 px-2 flex items-center gap-2"
                                       onClick={() => handleSortChange("language_code")}><img src={LanguageIcon}
                                                                                              alt={''} width={18}
                                                                                              height={18}/>Сортировать
                                        по языку</p>
                                    <p className="cursor-pointer px-2  flex items-center gap-2"
                                       onClick={() => handleSortChange("balance")}><img src={CoinsIcon} alt={''}
                                                                                        width={18} height={18}/>Сортировать
                                        по
                                        балансу</p>
                                    <p className="cursor-pointer px-2  flex items-center gap-2"
                                       onClick={() => handleSortChange("earned")}><img src={EarnIcon} alt={''}
                                                                                       width={18} height={18}/>Сортировать
                                        по
                                        заработанному</p>
                                    <p className="cursor-pointer px-2  flex items-center gap-2"
                                       onClick={() => handleSortChange("diamondsBalance")}><img src={DiamondsIcon}
                                                                                                alt={''} width={18}
                                                                                                height={18}/>Сортировать
                                        по алмазам</p>
                                    <p className="cursor-pointer px-2 flex items-center gap-2"
                                       onClick={() => handleSortChange("referralCount")}><img src={ReferralsIcon}
                                                                                              alt={''} width={18}
                                                                                              height={18}/>Сортировать
                                        по рефералам</p>
                                    <div className="border-t mt-2 pt-2">
                                        <div onClick={() => handleDirectionChange('ASC')}
                                             className={`cursor-pointer hover:bg-gray-200 p-2 flex items-center gap-2 ${sortDirection === 'ASC' ? 'bg-gray-200' : ''}`}>
                                            <img src={SortUpIcon} alt={''} width={18} height={18}/>
                                            От меньшего
                                        </div>
                                        <div onClick={() => handleDirectionChange('DESC')}
                                             className={`cursor-pointer hover:bg-gray-200 p-2 flex items-center gap-2  ${sortDirection === 'DESC' ? 'bg-gray-200' : ''}`}>
                                            <img className={'rotate-180'} src={SortUpIcon} alt={''} width={18}
                                                 height={18}/>От большего
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-x-auto hidden lg:block">
                    <table className="min-w-full">
                        <thead>
                        <tr className="text-sm font-semibold tracking-wide text-center text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                            {['ID', 'Никнейм', 'Имя', 'Фамилия', 'Страна', 'Бот', 'Баланс', 'Заработано', 'Аккаунт создан', 'Приглашен', 'Количество рефералов', 'Энергия', 'Диаманты', 'Награда', 'Реферальный бонус', 'Последний логин'].map((header, index) => (
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
                                <td className="px-2 py-1 border text-xs">{user.referralCount || '0'}</td>
                                <td className="px-2 py-1 border text-xs">{user.energy || '-'}</td>
                                <td className="px-2 py-1 border text-xs">{user.diamondsBalance || '-'}</td>
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
                                <td className="px-4 py-3 border text-xs">{user.lastEnergyUpdate ? getCorrectDate(new Date(user.lastLogin)) : '-'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="lg:hidden md:hidden grid grid-cols-1 gap-4 p-2">
                    {data.map((user: any, index: number) => (
                        <div key={index}
                             className="border bg-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow text-sm">
                            <h3 className="flex font-semibold text-lg justify-between">{user.username || 'Не указано'}
                                <p onClick={() => handleAboutUser(user.id)}
                                   className={'underline'}>{user.id || 'Не указано'}</p></h3>
                            <p><strong>Имя:</strong> {user.first_name || '-'}</p>
                            <p><strong>Фамилия:</strong> {user.last_name || '-'}</p>
                            <p><strong>Страна:</strong> {user.language_code || '-'}</p>
                            <p><strong>Бот:</strong> {user.is_bot ? 'Да' : 'Нет'}</p>
                            <p><strong>Баланс:</strong> {user.balance || '-'}</p>
                            <p><strong>Заработано:</strong> {user.earned || '-'}</p>
                            <p>
                                <strong>Создан:</strong> {user.createdAt ? getCorrectDate(new Date(user.createdAt)) : '-'}
                            </p>
                            <p className={''} onClick={() => handleAboutUser(user.invitedBy)}>
                                <strong>Приглашен:</strong> <i className={'underline'}>{user.invitedBy || '-'}</i></p>
                            <p><strong>Количество рефералов:</strong> {user.referralCount || '0'}</p>
                            <p><strong>Энергия:</strong> {user.energy || '-'}</p>
                            <p><strong>Диаманты:</strong> {user.diamondsBalance || '-'}</p>
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
                                логин:</strong> {user.lastLogin ? getCorrectDate(new Date(user.lastEnergyUpdate)) : '-'}
                            </p>
                        </div>
                    ))}
                </div>


                <div className="flex flex-col lg:flex-row justify-between items-center p-2 gap-2 pr-4">
                    <div>
                        <label htmlFor="limit-select" className="m-2">Записей на страницу:</label>
                        <select id="limit-select" value={limit} onChange={handleLimitChange} className="m-2">
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className={'flex'}>
                        <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>{"<"}</button>
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
                        <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>{'>'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;