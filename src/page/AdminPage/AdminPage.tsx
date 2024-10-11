import React, {useState, useEffect} from 'react';
import './AdminPage.css';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import {Pie} from "react-chartjs-2";
import TableReact from "./TableReact";
import {checkTokenExpiry} from "../../app/services/checkTokenExpire";
import {useNavigate} from "react-router-dom";

interface LanguageDistribution {
    language_code: string;
    percentage: string;
}

interface OsDistribution {
    os: string | null;
    percentage: string;
}

interface BoosterStatistic {
    type: string;
    totalBought: number | string; // може бути числом або рядком
    totalActivated: number | string; // може бути числом або рядком
}

interface GoodDistribution {
    good: string;
    count: number;
    percentage: string;
}

interface AppStats {
    averageBalance: string;
    totalBalance: string;
    languageDistribution: LanguageDistribution[];
    osDistribution: OsDistribution[];
    boosterStatistics: BoosterStatistic[];
    totalEarnedTonValue: string;
    averageEarnedTonValue: string;
    successfulTransactionCount: number;
    goodDistribution: GoodDistribution[];
}

interface User {
    id: number;
    username: string;
    first_name: string;
    language_code: string;
    is_bot: boolean;
    last_name: string | null;
    os: string;
    balance: string; // Keep as string to preserve format with decimal points
    earned: number;
    createdAt: string; // You may consider using Date if you parse it to a Date object
    invitedBy: number | null; // Assuming invitedBy can be an ID or null
    energy: number;
    lastEnergyUpdate: string; // Same as above, could be Date
    lastLogin: string; // Same as above
    consecutiveDays: number;
    rewardCollected: boolean;
    gotRefBonus: boolean;
    diamondsBalance: number;
    updatedAt: string; // Same as above
}


ChartJS.register(ArcElement, Tooltip, Legend);


const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('players');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const fetchData = async (tab: string) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            const token = localStorage.getItem('token');

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };

            switch (tab) {
                case 'players':
                    response = await fetch('https://modok-back-cold-butterfly-4160.fly.dev/api/user/all', {headers});
                    break;
                case 'appStats':
                    response = await fetch('https://modok-back-cold-butterfly-4160.fly.dev/api/statistic/application', {headers});
                    break;
                case 'playerStats':
                    response = await fetch('https://modok-back-cold-butterfly-4160.fly.dev/api/statistic/user?userId=312312', {headers});
                    break;
                case 'sessionStats':
                    response = await fetch('https://modok-back-cold-butterfly-4160.fly.dev/api/statistic/game-session?userId=3123122', {headers});
                    break;
                default:
                    return;
            }

            if (!response.ok) {
                throw new Error('Ошибка сервиса!');
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            // @ts-ignore
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkTokenExpiry(navigate)
        fetchData(activeTab);
    }, [activeTab]);


    const renderAppStats = (data: AppStats) => {
        return (
            <div className={'flex flex-col w-full'}>
                <h2 className="text-2xl">Статистика по приложению</h2>
                <div className={'h-2/6'}>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-100 p-4 rounded-md shadow">
                            <h3 className="font-bold">Средний баланс</h3>
                            <p>{parseFloat(data.averageBalance).toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md shadow">
                            <h3 className="font-bold">Общий баланс</h3>
                            <p>{parseFloat(data.totalBalance).toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md shadow">
                            <h3 className="font-bold">Общая сумма заработанных TON</h3>
                            <p>{parseFloat(data.totalEarnedTonValue).toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md shadow">
                            <h3 className="font-bold">Средняя сумма заработанных TON</h3>
                            <p>{parseFloat(data.averageEarnedTonValue).toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md shadow">
                            <h3 className="font-bold">Количество успешных транзакций</h3>
                            <p>{data.successfulTransactionCount}</p>
                        </div>
                    </div>
                </div>
                <div className={'h-2/6 pt-4 w-full'}>
                    <hr/>
                    <div className={'flex mt-2 w-full items-center justify-center pt-6'}>
                        <div className={'w-1/3 h-[350px] flex flex-col items-center justify-center gap-4'}>
                            <h3 className="text-xl w-full text-center">Статистика по языковым группам</h3>
                            <Pie data={getLanguageDistributionData(data.languageDistribution)}
                                 options={{
                                     responsive: true,
                                     maintainAspectRatio: false,
                                     plugins: {
                                         legend: {
                                             position: 'bottom',
                                             labels: {
                                                 boxWidth: 20,
                                                 padding: 30,
                                                 font: {
                                                     size: 14,
                                                 },
                                             },
                                         }
                                     }
                                 }}/>
                        </div>
                        <div className={'w-1/3 h-[350px] flex flex-col items-center justify-center gap-4'}>
                            <h3 className="text-xl w-full text-center">Статистика по ОС</h3>
                            <Pie data={getOsDistributionData(data.osDistribution)} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            boxWidth: 20,
                                            padding: 30,
                                            font: {
                                                size: 14,
                                            },
                                        },
                                    }
                                }
                            }}/>
                        </div>
                        <div className={'w-1/3 h-[350px] flex flex-col items-center justify-center gap-4'}>
                            <h3 className="text-xl w-full text-center">Статистика по алмазам</h3>
                            <Pie data={getGoodDistributionData(data.goodDistribution)} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            boxWidth: 20,
                                            padding: 30,
                                            font: {
                                                size: 14,
                                            },
                                        },
                                    }
                                }
                            }}/>
                        </div>
                    </div>
                </div>
                <div className={'h-2/6 pt-8 w-full'}>
                    <hr/>
                    <h3 className={'w-full text-xl text-center pt-2'}>Таблица по топ бустерам</h3>
                    <TableReact boosterStatistics={data.boosterStatistics}/>
                </div>
            </div>

        );
    };
    const getLanguageDistributionData = (languageDistribution: LanguageDistribution[]) => {
        const labels = languageDistribution.map(lang => lang.language_code);
        const data = languageDistribution.map(lang => parseFloat(lang.percentage));
        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                    ],
                },
            ],
        };
    };
    const getOsDistributionData = (osDistribution: OsDistribution[]) => {
        const labels = osDistribution.map(os => os.os || 'Не указано');
        const data = osDistribution.map(os => parseFloat(os.percentage));
        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                    ],
                },
            ],
        };
    };
    const getGoodDistributionData = (goodDistibution: GoodDistribution[]) => {
        const labels = goodDistibution.map(good => good.good || 'Не указано');
        const data = goodDistibution.map(good => parseFloat(good.percentage));
        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                    ],
                },
            ],
        };
    };

    const renderUsers = (users : User[])=>{
        console.log(users)

        return (
            <div>
                <h2 className="text-2xl">Пользователи</h2>
            </div>
        )
    }

    const renderContent = () => {
        if (loading) return <p>Загрузка...</p>;
        if (error) return <p>Ошибка: {error}</p>;

        switch (activeTab) {
            case 'players':
                if (data && typeof data === 'object') {
                    return renderUsers(data as User[]);
                }
                return <p>Загрузка...</p>;
            case 'appStats':
                if (data && typeof data === 'object' && 'averageBalance' in data) {
                    return renderAppStats(data as AppStats);
                }
                return <p>Загрузка...</p>;

            case 'playerStats':
                return (
                    <div>
                        <h2 className="text-2xl">Общая статистика по пользователю</h2>
                        <p>{JSON.stringify(data)}</p>
                    </div>
                );
            case 'sessionStats':
                return (
                    <div>
                        <h2 className="text-2xl">Сессионная статистика по пользователю</h2>
                        <p>{JSON.stringify(data)}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={'w-screen h-screen flex'}>
            <div className={'bg-gray-500 w-1/6 h-full flex flex-col items-center'}>
                <div className={'p-4'}>
                    <p className={'text-2xl'}>Modok Admin Panel</p>
                    <hr/>
                    <div className={'flex flex-col pt-4 items-center justify-center gap-4'}>
                        {['players', 'appStats', 'playerStats', 'sessionStats'].map((tab) => (
                            <div
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center justify-center w-full h-10 rounded-xl cursor-pointer 
                                    ${activeTab === tab ? 'bg-gray-600 text-gray-200' : 'hover:bg-gray-600 hover:text-gray-200'}`}
                            >
                                <p className={'text-left px-2 w-full'}>
                                    {tab === 'players' ? 'Пользователи' :
                                        tab === 'appStats' ? 'Статистика по приложению' :
                                            tab === 'playerStats' ? 'Общая статистика по пользователю' :
                                                'Сессионная статистика по пользователю'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={'bg-white w-5/6 h-full overflow-y-auto'}>
                <div className={'p-4'}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
