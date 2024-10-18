"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SetUICookie } from "@/app/utils/utils";
import { getUid, setSecureJsonValueInLocalStorage } from "@/app/Services/core.services";
import Link from "next/link";
import Spinner from "@/app/components/Spinner";

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: '',
        first_name:'',
        last_name:'',
        phone_number:''
    });
    const router = useRouter();

    const handleInputChange = (e:any) => {
        setUser((prevTask: any) => ({ ...prevTask, [e.target.name]: e.target.value }));
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
                id: getUid(),
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
                email: user.email,
                password: user.password,
            });
            if (response.status === 200) {
                setLoading(false)
                router.push('/')
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }

    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign up</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleRegister}>
                <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={user.first_name}
                            name = "first_name"
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={user.last_name}
                            name = "last_name"
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            name="email"
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={user.password}
                            name="password"
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-9 text-gray-600"
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13.875 18.825A9.953 9.953 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.977 9.977 0 014.413-5.467m3.658-1.544A9.978 9.978 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.977 9.977 0 01-3.017 4.34M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3l18 18"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Phone number
                        </label>
                        <input
                            type="text"
                            value={user.phone_number}
                            name = "phone_number"
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-2">
                    <p className="text-center text-sm text-gray-500">
                        Already have an account? <Link href="/" className="text-blue-800">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
