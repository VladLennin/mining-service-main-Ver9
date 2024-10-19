import React, {useState} from "react";
import {ToastContainer, toast} from "react-toastify";

const ToolsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [boosterType, setBoosterType] = useState("energy");
    const [boosterQuantity, setBoosterQuantity] = useState(1);
    const [dimondsCount, setDimondsCount] = useState(1);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const token = localStorage.getItem('token');

    const giveBooster = async (id: number) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };
            const body = JSON.stringify({
                userId: id,
                type: boosterType,
                quantity: boosterQuantity
            });

            const response = await fetch(`https://modok-play-back.online/api/admin/booster`, {
                method: 'POST',
                headers,
                body
            });

            if (!response.ok) {
                throw new Error('Ошибка сервиса!');
            }

            const result = await response.json();
            toast.success(`Выдано ${boosterQuantity} ${boosterType} бустер(ов) пользователю ID ${id}.`);
            console.log(result);
        } catch (error) {
            // @ts-ignore
            toast.error(error.message);
        }
    };

    const giveBan = async (id: number, ban: boolean) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };
            const body = JSON.stringify({
                userId: id,
                ban: ban
            });

            const response = await fetch(`https://modok-play-back.online/api/admin/ban-user`, {
                method: 'POST',
                headers,
                body
            });

            if (!response.ok) {
                throw new Error('Ошибка сервиса!');
            }

            const action = ban ? "заблокирован" : "разблокирован";
            toast.success(`Пользователь ID ${id} ${action}.`);
            const result = await response.json();
            console.log(result);
        } catch (error) {
            // @ts-ignore
            toast.error(error.message);
        }
    };

    const giveDimonds = async (id: number) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };
            const body = JSON.stringify({
                userId: id,
                amount: dimondsCount
            });

            const response = await fetch(`https://modok-play-back.online/api/admin/diamonds`, {
                method: 'POST',
                headers,
                body
            });

            if (!response.ok) {
                throw new Error('Ошибка сервиса!');
            }

            toast.success(`Выдано ${dimondsCount} алмаз(ов) пользователю ID ${id}.`);
            const result = await response.json();
            console.log(result);
        } catch (error) {
            // @ts-ignore
            toast.error(error.message);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsButtonEnabled(e.target.value.trim() !== "");
    };

    const handleBoosterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBoosterType(e.target.value);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Number(e.target.value));
        setBoosterQuantity(value);
    };

    const handleDimondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Number(e.target.value));
        setDimondsCount(value);
    };

    return (
        <div>
            <h2 className="text-2xl pb-2">Панель инструментов</h2>
            <div className="flex flex-col gap-4">
                <div className="flex lg:flex-row flex-col gap-4">
                    <input
                        type="number"
                        placeholder="Введите ID пользователя.."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 border rounded lg:w-1/3 w-full"
                    />
                    <div className="flex gap-2">
                        <button
                            className={`transition-opacity duration-300 bg-red-500 p-3 rounded-xl w-full ${isButtonEnabled ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
                            onClick={() => isButtonEnabled && giveBan(Number(searchTerm), true)}
                            disabled={!isButtonEnabled}
                        >
                            Заблокировать
                        </button>
                        <button
                            className={`transition-opacity duration-300 bg-green-500 p-3 rounded-xl w-full ${isButtonEnabled ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
                            onClick={() => isButtonEnabled && giveBan(Number(searchTerm), false)}
                            disabled={!isButtonEnabled}
                        >
                            Разблокировать
                        </button>
                    </div>
                </div>
                <hr className={'lg:hidden'}/>
                <div className="flex lg:flex-row flex-col gap-4 w-full">
                    <div className="flex flex-col gap-4 lg:w-1/3 w-full">
                        <h2 className="text-center font-bold">Выдача бустеров</h2>
                        <div className="flex gap-4">
                            <select
                                value={boosterType}
                                onChange={handleBoosterChange}
                                className={`p-2 border rounded w-1/2 ${isButtonEnabled ? '' : 'opacity-50 cursor-not-allowed'}`}
                                disabled={!isButtonEnabled}
                            >
                                <option value="energy">Energy</option>
                                <option value="autoCatch">AutoCatch</option>
                            </select>
                            <input
                                type="number"
                                min="1"
                                value={boosterQuantity}
                                onChange={handleQuantityChange}
                                className={`p-2 border rounded w-1/2 ${isButtonEnabled ? '' : 'opacity-50 cursor-not-allowed'}`}
                            />
                        </div>
                        <button
                            className={`transition-opacity duration-300 bg-yellow-500 p-3 rounded-xl ${isButtonEnabled ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
                            onClick={() => isButtonEnabled && giveBooster(Number(searchTerm))}
                            disabled={!isButtonEnabled}
                        >
                            Выдать {boosterQuantity} {boosterType} бустер(ов)
                        </button>
                    </div>
                    <div className="flex flex-col gap-4 lg:w-1/3 w-full">
                        <h2 className="text-center font-bold">Выдача алмазов</h2>
                        <input
                            type="number"
                            min="1"
                            value={dimondsCount}
                            onChange={handleDimondsChange}
                            className={`p-2 border rounded w-full ${isButtonEnabled ? '' : 'opacity-50 cursor-not-allowed'}`}
                        />
                        <button
                            className={`transition-opacity duration-300 bg-yellow-500 p-3 rounded-xl ${isButtonEnabled ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
                            onClick={() => isButtonEnabled && giveDimonds(Number(searchTerm))}
                            disabled={!isButtonEnabled}
                        >
                            Выдать {dimondsCount} алмаз(ов)
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer position={'bottom-right'}/>
        </div>
    );
};

export default ToolsPage;
