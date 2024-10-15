import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import {User} from "../../entity/user/model/types";

interface BoosterStatistic {
    // title: string;
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

interface UserStats {
    amountOfEnters: number,
    boosters: BoosterStatistic[],
    earnedWithRef: number,
    refCount: number,
    refSpent: number,
    timeInGame: number,
    totalEarned: number,
    transactionStats: TransactionStats,
    user: User
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

                const sessionResponse = await fetch(`https://modok-back-cold-butterfly-4160.fly.dev/api/statistic/game-session?userId=${id}`, {headers});
                const sessionData = await sessionResponse.json();
                setSessionStats(sessionData);

                const userResponse = await fetch(`https://modok-back-cold-butterfly-4160.fly.dev/api/statistic/user?userId=${id}`, {headers});
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

    return (
        <div className={'flex flex-col w-full'}>
            <h2 className="text-2xl pb-2 lg:text-left text-center">Информация о пользователе: <b
                className={'underline'}>{allStats.user.username}</b></h2>
            <hr/>
            <p className={'text-base py-4 text-center font-bold'}>{'>> '}Общая информация{' <<'}</p>
            <div className={'flex lg:flex-row flex-col justify-between items-center w-full gap-4'}>
                <div className={'flex lg:w-1/4 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Имя:</strong> {allStats.user.first_name || "Не указано"}</p>
                    <p><strong>Фамилия:</strong> {allStats.user.last_name || "Не указано"}</p>
                    <p><strong>Язык:</strong> {allStats.user.language_code || "Не указано"}</p>
                </div>
                <div className={'flex lg:w-1/4 w-full flex-col bg-gray-100 p-4 rounded-md shadow  '}>
                    <p><strong>Баланс:</strong> {allStats.user.balance || 0}</p>
                    <p><strong>Баланс алмазов:</strong> {allStats.user.diamondsBalance || 0}</p>
                    <p><strong>Всего заработано:</strong> {allStats.totalEarned ||0 }</p>
                </div>
                <div className={'flex lg:w-1/4 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Времени в игре:</strong> {allStats.timeInGame || 0}</p>
                    <p><strong>Энергия:</strong> {allStats.user.energy || 0}</p>
                    <p><strong>Создан:</strong> {getCorrectDate(new Date(allStats.user.createdAt)) || "Не указано"}</p>
                </div>
                <div className={'flex lg:w-1/4 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Последний логин:</strong> {getCorrectDate(new Date(allStats.user.lastLogin)) || "Не указано"}</p>
                    <p><strong>Дней подряд:</strong> {allStats.user.consecutiveDays || 0}</p>
                </div>

            </div>

            <p className={'text-base py-4 text-center font-bold'}>{'>> '}Сессийная информация{' <<'}</p>
            <div className={'flex lg:flex-row flex-col justify-between items-center w-full gap-4'}>
                <div className={'flex lg:w-1/3 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Средняя длительность сессии:</strong> {sessionStats.averageDuration}</p>
                </div>
                <div className={'flex lg:w-1/3 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Сума длительности всех сессий:</strong> {sessionStats.totalDuration}</p>
                </div>
                <div className={'flex lg:w-1/3 w-full flex-col bg-gray-100 p-4 rounded-md shadow '}>
                    <p><strong>Среднее заработаных монет за сессию:</strong> {sessionStats.earned.totalEarned}</p>
                </div>
            </div>
            <div className={'flex lg:flex-row flex-col lg:gap-4'}>
                <div className={'lg:w-1/2 flex items-center justify-between bg-gray-100 p-4 rounded-md shadow mt-4'}>
                    <p><strong>Всего монет:</strong></p>

                    <div className={'lg:flex grid grid-cols-2 gap-4'}>
                        <p className={'flex flex-col items-center'}>
                            <strong>Черные:</strong> {sessionStats.totalCoins.totalBlack}</p>
                        <p className={'flex flex-col items-center'}>
                            <strong>Жёлтые:</strong> {sessionStats.totalCoins.totalYellow}</p>
                        <p className={'flex flex-col items-center'}>
                            <strong>Красные:</strong> {sessionStats.totalCoins.totalRed}</p>
                        <p className={'flex flex-col items-center'}>
                            <strong>Зеленые:</strong> {sessionStats.totalCoins.totalGreen}</p>
                        <p className={'flex flex-col items-center'}>
                            <strong>Белые:</strong> {sessionStats.totalCoins.totalWhite}</p>
                    </div>
                </div>

                <div className={'lg:w-1/2 flex items-center justify-between bg-gray-100 p-4 rounded-md shadow mt-4'}>
                    <p><strong>Средне словлено <br className={'lg:hidden'}/>монет за сессию:</strong></p>
                    <div className={'lg:flex grid grid-cols-2 gap-4'}>
                        <p className={'flex flex-col items-center'}>
                            <strong>Черные:</strong> {sessionStats.averageCoins.averageBlack}</p>
                        <p className={'flex flex-col items-center'}>
                            <strong>Жёлтые:</strong> {sessionStats.averageCoins.averageYellow}</p>
                        <p className={'flex flex-col items-center'}>
                            <strong>Красные:</strong> {sessionStats.averageCoins.averageRed}</p>
                        <p className={'flex flex-col items-center'}>
                            <strong>Зеленые:</strong> {sessionStats.averageCoins.averageGreen}</p>
                        <p className={'flex flex-col items-center'}>
                            <strong>Белые:</strong> {sessionStats.averageCoins.averageWhite}</p>
                    </div>
                </div>
            </div>
            <div className={'flex lg:flex-row flex-col items-start lg:gap-4'}>
                <div className={'lg:w-1/2 w-full '}>
                    <p className={'text-center font-bold py-4'}>{'>> '}Бустеры{' <<'}</p>
                    <table className="table-auto w-full text-center bg-gray-100 p-4 rounded-md shadow ">
                        <thead>
                        <tr>
                            {/*<th className="py-3 px-3">Название</th>*/}
                            <th className="py-3 px-3">Тип</th>
                            <th className="py-3 px-3">Всего куплено</th>
                            <th className="py-3 px-3">Всего активировано</th>
                        </tr>
                        </thead>
                        <tbody>
                        {allStats.boosters.map((booster, index) => (
                            <tr key={index} className={'border'}>
                                {/*<td className="py-2 px-3">{data.title}</td>*/}
                                <td className="py-2 px-3">{booster.type}</td>
                                <td className="py-2 px-3">{booster.totalBought || 0}</td>
                                <td className="py-2 px-3">{booster.totalActivated ||0}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className={'lg:w-1/2 w-full'}>
                    <p className={'text-center font-bold py-4'}>{'>> '}Транзакции{' <<'}</p>
                    <div className={'grid grid-cols-2 gap-4'}>
                        <div className={'flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md shadow'}>
                            <p><strong>Количество успешных:</strong> {allStats.transactionStats.successfulCount || 0}</p>
                        </div>
                        <div className={'flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md shadow'}>
                            <p><strong>Количество неудавшихся:</strong> {allStats.transactionStats.failedCount || 0}</p>
                        </div>
                        <div className={'flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md shadow'}>
                            <p><strong>Сума успешных:</strong> {allStats.transactionStats.successfulSum || 0}</p>

                        </div>
                        <div className={'flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md shadow'}>
                            <p><strong>Среднее успешных:</strong> {allStats.transactionStats.successfulAverage ||0}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AboutUser;
