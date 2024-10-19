import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import {to} from "@react-spring/web";

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const response = await fetch('https://modok-play-back.online/api/auth/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/admin/appStats');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Sign in failed');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred during sign in');
        }
    };

    return (
        <div className="bg-gray-50 font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="max-w-md w-full">
                    <div className="p-8 rounded-2xl bg-white shadow">
                        <h2 className="text-gray-800 text-center text-2xl font-bold">Авторизация</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSignIn();
                            }}
                            className="mt-8 space-y-4"
                        >
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Логин</label>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="Введите логин"
                                />
                            </div>

                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Пароль</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        placeholder="Введите пароль"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 text-gray-600"
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div className="!mt-8">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Войти
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer position={'bottom-right'}/>
        </div>
    );
};

export default AdminLoginPage;
