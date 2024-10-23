import React, {useEffect, useState} from 'react';
import PromoterStats from "./PromoterStats";
import {checkTokenExpiry} from "../../app/services/checkTokenExpire";
import {useNavigate} from "react-router-dom"; // Import the PromoterStats component

interface Promoter {
    id: number;
    name: string;
}

const PromotersPage = () => {
    const [promoters, setPromoters] = useState<Promoter[]>([]);
    const [activePromoterId, setActivePromoterId] = useState<number | null>(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        checkTokenExpiry(navigate);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
        const fetchPromoters = async () => {
            try {
                const response = await fetch('https://modok-play-back.online/api/admin/promoters/all', {headers});
                const data = await response.json();
                setPromoters(data);
            } catch (error) {
                console.error('Error fetching promoters:', error);
            }
        };

        fetchPromoters();
    }, [token]);

    // @ts-ignore
    const handleTabClick = (id: number) => {
        setActivePromoterId(id);
    };

    return (
        <>
            <h2 className="text-2xl pb-2">Промоутери</h2>
            <div
                className="text-sm font-medium text-center text-black border-b border-gray-200 dark:text-black dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px">
                    {promoters.map(promoter => (
                        <li key={promoter.id} className="me-2">
                            <p
                                className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                                    activePromoterId === promoter.id
                                        ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                                        : 'border-transparent hover:text-white hover:border-gray-300 hover:bg-blue-500 dark:hover:text-black-300'
                                }`}
                                onClick={() => handleTabClick(promoter.id)}
                            >
                                {promoter.name}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>

            {activePromoterId ? (
                <PromoterStats promoterId={activePromoterId}/>
            ) : (
                <p className="text-center mt-4 text-xl text-gray-500">Выберите интересующего промоутера</p>
            )}
        </>
    );
};

export default PromotersPage;
