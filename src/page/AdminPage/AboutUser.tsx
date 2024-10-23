import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import {User} from "../../entity/user/model/types";

import GreenCoin from "../../assets/coins/green.png";
import BlackCoin from "../../assets/coins/black.png";
import YellowCoin from "../../assets/coins/yellow.png";
import RedCoin from "../../assets/coins/red.png";
import WhiteCoin from "../../assets/coins/standart.png";
import {all} from "axios";

interface BoosterStatistic {
    title: string;
    type: string;
    totalBought: number | string;
    totalActivated: number | string;
}

interface TransactionStats {
    failedCount: string | number;
    successfulAverage: string | number;
    successfulCount: string | number;
    successfulSum: string | number;
}

interface AverageCoins {
    averageBlack: number | string;
    averageGreen: number | string;
    averageRed: number | string;
    averageWhite: number | string;
    averageYellow: number | string;
}

interface TotalCoins {
    totalBlack: number | string;
    totalGreen: number | string;
    totalRed: number | string;
    totalWhite: number | string;
    totalYellow: number | string;
}

interface Earned {
    averageEarned: number | string;
    totalEarned: number | string;
}

interface GameSession {
    averageCoins: AverageCoins;
    averageDuration: number | string;
    earned: Earned;
    totalCoins: TotalCoins;
    totalDuration: number | string;
}

interface RefStats {
    earnedWithRef: number,
    refCount: number,
    refSpent: number,
}

interface Card {
    id: number;
    name: string;
}

interface CardStats {
    Card: Card;
    id: number;
    level: number;
    updatedAt: string;
    upgradeCost: number;
}

interface UserStats {
    amountOfEnters: number,
    boosters: BoosterStatistic[],
    refStats: RefStats,
    timeInGame: number,
    totalEarned: number,
    transactionStats: TransactionStats,
    user: User
    cardStats: CardStats[];
}


const AboutUser = () => {
    const [allStats, setAllStats] = useState<UserStats | null>(null);
    const [sessionStats, setSessionStats] = useState<GameSession | null>(null);
    const [loading, setLoading] = useState(false);
    const {id} = useParams()

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                };

                const sessionResponse = await fetch(`https://modok-play-back.online/api/statistic/game-session?userId=${id}`, {headers});
                const sessionData = await sessionResponse.json();
                setSessionStats(sessionData);

                const userResponse = await fetch(`https://modok-play-back.online/api/statistic/user?userId=${id}`, {headers});
                const userData = await userResponse.json();
                setAllStats(userData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchStats();
    }, [id]);

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

    // Проверка на загрузку данных
    if (!allStats || !sessionStats) {
        return (
            <div className={'h-screen flex items-center justify-center'}>
                <PulseLoader loading={loading}/>
            </div>
        );
    }

    const formatTimeInGame = (milliseconds: number) => {
        const totalMinutes = Math.floor(milliseconds / 60000);
        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;

        return `${days} дн. ${hours} ч. ${minutes} мин.`;
    };

    const formatTimeInSession = (milliseconds: number) => {
        const totalMinutes = Math.floor(milliseconds / 60000);
        const minutes = totalMinutes % 60;

        return `${minutes} мин.`;
    }

    const formatTimeInSessionHours = (milliseconds: number) => {
        const totalMinutes = Math.floor(milliseconds / 60000);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;

        return `${hours} ч. ${minutes} мин.`;
    }


    return (
        <div className={'flex flex-col w-full'}>
            <h2 className="text-2xl pb-2 lg:text-left text-center">Информация о пользователе: <b
                className={'underline'}>{allStats.user.username}</b>
                <span className="text-red-500 ml-2">{allStats.user.isBanned ? '(В бане)' : ''} </span></h2>
            <hr/>
            <p className={'text-base py-4 text-center font-bold'}>{'>> '}Общая информация{' <<'}</p>
            <div className={'flex lg:flex-row flex-col justify-between items-center w-full gap-4'}>
                <div
                    className={'flex lg:w-1/4 w-full flex-col justify-center bg-gray-100 p-4 rounded-md shadow lg:h-24'}>
                    <p><strong>Имя:</strong> {allStats.user.first_name || "Не указано"}</p>
                    <p><strong>Фамилия:</strong> {allStats.user.last_name || "Не указано"}</p>
                    <p><strong>Язык:</strong> {allStats.user.language_code || "Не указано"}</p>
                </div>
                <div
                    className={'flex lg:w-1/4 w-full flex-col justify-center bg-gray-100 p-4 rounded-md shadow lg:h-24'}>
                    <p><strong>Баланс:</strong> {allStats.user.balance || 0}</p>
                    <p><strong>Баланс алмазов:</strong> {allStats.user.diamondsBalance || 0}</p>
                    <p><strong>Всего заработано:</strong> {allStats.totalEarned || 0}</p>
                </div>
                <div
                    className={'flex lg:w-1/4 w-full flex-col justify-center bg-gray-100 p-4 rounded-md shadow lg:h-24'}>
                    <p><strong>Времени в игре:</strong> {formatTimeInGame(allStats.timeInGame) || 0}</p>
                    <p><strong>Энергия:</strong> {allStats.user.energy || 0}</p>
                    <p><strong>Создан:</strong> {getCorrectDate(new Date(allStats.user.createdAt)) || "Не указано"}</p>
                </div>
                <div
                    className={'flex lg:w-1/4 w-full flex-col justify-center bg-gray-100 p-4 rounded-md shadow lg:h-24'}>
                    <p><strong>Последний
                        логин:</strong> {getCorrectDate(new Date(allStats.user.lastLogin)) || "Не указано"}</p>
                    <p><strong>Дней подряд:</strong> {allStats.user.consecutiveDays || 0}</p>
                </div>

            </div>
            <p className={'text-base py-4 text-center font-bold'}>{'>> '}Информация по реферальной системе{' <<'}</p>
            <div className={'flex lg:flex-row flex-col gap-4'}>
                <div className={'flex lg:w-1/3 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Сколько заработано с рефералов:</strong> {allStats.refStats.earnedWithRef || 0}</p>
                </div>
                <div className={'flex lg:w-1/3 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Количество рефералов:</strong> {allStats.refStats.refCount || 0}</p>
                </div>
                <div className={'flex lg:w-1/3 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Сколько ТОН потратил реферал:</strong> {allStats.refStats.refSpent || 0}</p>
                </div>
            </div>

            <p className={'text-base py-4 text-center font-bold'}>{'>> '}Сессийная информация{' <<'}</p>
            <div className={'flex lg:flex-row flex-col justify-between items-center w-full gap-4'}>
                <div className={'flex lg:w-1/3 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Средняя длительность
                        сессии:</strong> {formatTimeInSession(Number(sessionStats.averageDuration)) || 0}</p>
                </div>
                <div className={'flex lg:w-1/3 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Сума длительности всех
                        сессий:</strong> {formatTimeInSessionHours(Number(sessionStats.totalDuration)) || 0}</p>
                </div>
                <div className={'flex lg:w-1/3 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Среднее заработаных монет за сессию:</strong> {sessionStats.earned.totalEarned || 0}</p>
                </div>
            </div>
            <div className={'flex lg:flex-row flex-col lg:gap-4'}>
                <div className={'lg:w-1/2 flex items-center justify-between bg-gray-100 p-4 rounded-md shadow mt-4'}>
                    <p className={'w-1/3'}><strong>Всего монет:</strong></p>

                    <div className={'lg:flex grid grid-cols-2 gap-4 w-2/3 justify-center'}>
                        <p className={'flex flex-col items-center'}>
                            <img className={'w-10 h-10'} src={BlackCoin} alt={'Черные:'}/>
                            {sessionStats.totalCoins.totalBlack || 0}
                        </p>
                        <p className={'flex flex-col items-center'}>
                            <img className={'w-10 h-10'} src={YellowCoin} alt={'Желтые:'}/>
                            {sessionStats.totalCoins.totalYellow || 0}
                        </p>
                        <p className={'flex flex-col items-center'}>
                            <img className={'w-10 h-10'} src={RedCoin} alt={'Красные:'}/>
                            {sessionStats.totalCoins.totalRed || 0}
                        </p>
                        <p className={'flex flex-col items-center'}>
                            <img className={'w-10 h-10'} src={GreenCoin} alt={'Зелёные:'}/>
                            {sessionStats.totalCoins.totalGreen || 0}
                        </p>
                        <p className={'flex flex-col items-center'}>
                            <img className={'w-10 h-10'} src={WhiteCoin} alt={'Белые:'}/>
                            {sessionStats.totalCoins.totalWhite || 0}
                        </p>
                    </div>
                </div>

                <div className={'lg:w-1/2 flex items-center justify-between bg-gray-100 p-4 rounded-md shadow mt-4'}>
                    <p className={'w-1/3'}><strong>Средне словлено <br className={'lg:hidden'}/>монет за
                        сессию:</strong></p>
                    <div className={'lg:flex grid grid-cols-2 gap-4 w-2/3 justify-center'}>
                        <p className={'flex flex-col items-center'}>
                            <img className={'w-10 h-10'} src={BlackCoin} alt={'Черные:'}/>
                            {sessionStats.averageCoins.averageBlack || 0}
                        </p>
                        <p className={'flex flex-col items-center'}>
                            <img className={'w-10 h-10'} src={YellowCoin} alt={'Желтые:'}/>
                            {sessionStats.averageCoins.averageYellow || 0}
                        </p>
                        <p className={'flex flex-col items-center'}>
                            <img className={'w-10 h-10'} src={RedCoin} alt={'Красные:'}/>
                            {sessionStats.averageCoins.averageRed || 0}
                        </p>
                        <p className={'flex flex-col items-center'}>
                            <img className={'w-10 h-10'} src={GreenCoin} alt={'Зелёные:'}/>
                            {sessionStats.averageCoins.averageGreen || 0}
                        </p>
                        <p className={'flex flex-col items-center'}>
                            <img className={'w-10 h-10'} src={WhiteCoin} alt={'Белые:'}/>
                            {sessionStats.averageCoins.averageWhite || 0}
                        </p>
                    </div>
                </div>
            </div>
            <div className={'flex lg:flex-row flex-col items-start lg:gap-4'}>
                <div className={'lg:w-1/2 w-full '}>
                    <p className={'text-center font-bold py-4'}>{'>> '}Бустеры{' <<'}</p>
                    <table className="table-auto w-full text-center bg-gray-100 p-4 rounded-md shadow ">
                        <thead>
                        <tr>
                            <th className="py-3 px-3">Название</th>
                            <th className="py-3 px-3">Тип</th>
                            <th className="py-3 px-3">Всего куплено</th>
                            <th className="py-3 px-3">Всего активировано</th>
                        </tr>
                        </thead>
                        <tbody>
                        {allStats.boosters.map((booster, index) => (
                            <tr key={index} className={'border'}>
                                <td className="py-2 px-3">{booster.title}</td>
                                <td className="py-2 px-3">{booster.type}</td>
                                <td className="py-2 px-3">{booster.totalBought || 0}</td>
                                <td className="py-2 px-3">{booster.totalActivated || 0}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className={'lg:w-1/2 w-full'}>
                    <p className={'text-center font-bold py-4'}>{'>> '}Транзакции{' <<'}</p>
                    <div className={'grid grid-cols-2 gap-4'}>
                        <div className={'flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md shadow'}>
                            <p><strong>Количество успешных:</strong> {allStats.transactionStats.successfulCount || 0}
                            </p>
                        </div>
                        <div className={'flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md shadow'}>
                            <p><strong>Количество неудавшихся:</strong> {allStats.transactionStats.failedCount || 0}</p>
                        </div>
                        <div className={'flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md shadow'}>
                            <p><strong>Сума успешных:</strong> {allStats.transactionStats.successfulSum || 0}</p>

                        </div>
                        <div className={'flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md shadow'}>
                            <p><strong>Среднее успешных:</strong> {allStats.transactionStats.successfulAverage || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
            {allStats.cardStats ? <><p className={'text-base py-4 text-center font-bold'}>{'>> '}Информация по
                карточкам{' <<'}</p>
                <div className={'grid grid-cols-2 gap-4'}>
                    {allStats.cardStats.map((cardStat, index)=> (
                            <div key={index} className={'flex items-center justify-center bg-gray-100 rounded-md shadow p-4'}>
                                <div className={'w-1/3'}>
                                    <p className={'text-center text-2xl'}>{cardStat.Card.name}</p>
                                </div>
                                <div className={'w-2/3 flex flex-col items-center justify-center gap-2'}>
                                    <p><b>ID:</b> {cardStat.id}</p>
                                    <p><b>Уровень:</b> {cardStat.level}</p>
                                    <p><b>Стоимость улучшения:</b> {cardStat.upgradeCost}</p>
                                    <p><b>Последнее улучшение:</b> {new Date(cardStat.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </> : <></>}
        </div>
    );
};

export default AboutUser;
