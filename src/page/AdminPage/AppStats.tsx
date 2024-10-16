import React, {useEffect, useState} from "react";
import {checkTokenExpiry} from "../../app/services/checkTokenExpire";
import {useNavigate} from "react-router-dom";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import {Pie} from "react-chartjs-2";
import TableReact from "./TableReact";
import {PulseLoader} from "react-spinners";

interface LanguageDistribution {
    language_code: string;
    percentage: string;
    count:number;
}

interface OsDistribution {
    os: string | null;
    percentage: string;
    count:number;
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
    totalUsers:number;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const AppStats = () => {
    // @ts-ignore
    const [data, setData] = useState<AppStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeUsers, setActiveUsers] = useState(0);
    const navigate = useNavigate()

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            const token = localStorage.getItem('token');

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };

            response = await fetch('https://modok-back-cold-butterfly-4160.fly.dev/api/statistic/application', {headers});


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
        fetchData();

        const ws = new WebSocket("wss://modok-back-cold-butterfly-4160.fly.dev/ws");

        ws.onopen = () => {
            console.log("WebSocket connection established");
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.activeUsers !== undefined) {
                setActiveUsers(message.activeUsers);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            ws.close();
        };
    }, []);

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

    if (loading) return (
        <div className={'h-screen flex items-center justify-center'}>
            <PulseLoader loading={loading}/>
        </div>
    );

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>No data available.</div>;
    }

    return (
        <div className={'flex flex-col w-full'}>
            <h2 className="text-2xl lg:flex justify-between">Статистика по приложению <p>Онлайн: {activeUsers} <span className={'w-2 h-2 text-green-500'}>&#9679;</span></p> </h2>
            <div className={'h-2/6'}>
                <div className="grid grid-cols-2 gap-4 lg:mt-4 lg:my-0 my-4 lg:text-base text-sm">
                    <div className="bg-gray-100 p-4 rounded-md shadow ">
                        <h3 className="font-bold">Средний баланс</h3>
                        <p className={'pt-1'}>{parseFloat(data.averageBalance).toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md shadow">
                        <h3 className="font-bold">Общий баланс</h3>
                        <p className={'pt-1'}>{parseFloat(data.totalBalance).toFixed(2)}</p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md shadow">
                        <h3 className="font-bold">Средняя сумма заработанных TON</h3>
                        <p className={'pt-1'}>{parseFloat(data.averageEarnedTonValue).toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md shadow">
                        <h3 className="font-bold">Общая сумма заработанных TON</h3>
                        <p className={'pt-1'}>{parseFloat(data.totalEarnedTonValue).toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md shadow">
                        <h3 className="font-bold">Количество успешных транзакций</h3>
                        <p className={'pt-1'}>{data.successfulTransactionCount}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md shadow">
                        <h3 className="font-bold">Всего пользователей приложения</h3>
                        <p className={'pt-1'}>{data.totalUsers}</p>
                    </div>
                </div>
            </div>
            <div className={'h-2/6 lg:pt-4 w-full'}>
                <hr/>
                <div className={'flex lg:flex-row flex-col w-full items-center justify-between lg:gap-0 gap-16 pt-8'}>
                    <div className={'lg:w-1/3 h-[400px]  flex flex-col items-center justify-center gap-4'}>
                        <h3 className="text-xl w-full text-center">Статистика по языковым группам</h3>
                        <Pie data={getLanguageDistributionData(data.languageDistribution)}
                             options={{
                                 responsive: true,
                                 maintainAspectRatio: false,
                                 plugins: {
                                     tooltip: {
                                         callbacks: {
                                             label: (tooltipItem) => {
                                                 const index = tooltipItem.dataIndex;
                                                 const { percentage, count } = data.languageDistribution[index];
                                                 return `${percentage}% - Количество: ${count}`;
                                             }
                                         }
                                     },
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
                    <div className={'lg:w-1/3 h-[400px] flex flex-col items-center justify-center gap-4'}>
                        <h3 className="text-xl w-full text-center">Статистика по ОС</h3>
                        <Pie data={getOsDistributionData(data.osDistribution)} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: (tooltipItem) => {
                                            const index = tooltipItem.dataIndex;
                                            const { percentage, count } = data.osDistribution[index];
                                            return `${percentage}% - Количество: ${count}`;
                                        }
                                    }
                                },
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
                    <div className={'lg:w-1/3 h-[400px] flex flex-col items-center justify-center gap-4'}>
                        <h3 className="text-xl w-full text-center">Статистика по алмазам</h3>
                        <Pie data={getGoodDistributionData(data.goodDistribution)} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: (tooltipItem) => {
                                            const index = tooltipItem.dataIndex;
                                            const { percentage, count } = data.goodDistribution[index];
                                            return `${percentage}% - Количество: ${count}`;
                                        }
                                    }
                                },
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
}

export default AppStats