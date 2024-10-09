import React, {useState, useEffect} from 'react';
import './AdminPage.css';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('players');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (tab: string) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            switch (tab) {
                case 'players':
                    response = await fetch('https://modok-back-cold-butterfly-4160.fly.dev/api/statistic/game-session');
                    break;
                case 'appStats':
                    response = await fetch('https://modok-back-cold-butterfly-4160.fly.dev/api/statistic/application');
                    break;
                case 'playerStats':
                    response = await fetch('/api/playerStats');
                    break;
                case 'sessionStats':
                    response = await fetch('/api/sessionStats');
                    break;
                default:
                    return;
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
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
        fetchData(activeTab);
    }, [activeTab]);

    const renderContent = () => {
        if (loading) return <p>Загрузка...</p>;
        if (error) return <p>Ошибка: {error}</p>;

        switch (activeTab) {
            case 'players':
                return (
                    <div>
                        <h2 className="text-2xl">Гравці (Чекаю ендпоінт)</h2>
                        {/*<ul>*/}
                        {/*    {data && data.map(player => (*/}
                        {/*        <li key={player.id}>{player.name}</li>*/}
                        {/*    ))}*/}
                        {/*</ul>*/}
                    </div>
                );
            case 'appStats':
                return (
                    <div>
                        <h2 className="text-2xl">Статистика по додатку</h2>
                        {/* Здесь разместите статистику по приложению */}
                        <p>{JSON.stringify(data)}</p>
                    </div>
                );
            case 'playerStats':
                return (
                    <div>
                        <h2 className="text-2xl">Загальна статистика по гравцю</h2>
                        {/* Здесь разместите статистику по игроку */}
                        <p>{JSON.stringify(data)}</p>
                    </div>
                );
            case 'sessionStats':
                return (
                    <div>
                        <h2 className="text-2xl">Сессійна статистика по гравцю</h2>
                        {/* Здесь разместите сессионную статистику по игроку */}
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
                                <p className={'text-left px-2 w-full'}>{tab === 'players' ? 'Гравці' :
                                    tab === 'appStats' ? 'Статистика по додатку' :
                                        tab === 'playerStats' ? 'Загальна статистика по гравцю' :
                                            'Сессійна статистика по гравцю'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={'bg-white w-5/6 h-full'}>
                <div className={'p-4'}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
