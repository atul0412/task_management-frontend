"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getSecureJsonValueFromLocalStorage, getUid, } from "@/app/Services/core.services";
import Link from "next/link";
import Spinner from "@/app/components/Spinner";
import { FaUser } from "react-icons/fa";

const UserProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const user = getSecureJsonValueFromLocalStorage('user') ?? '';

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
            <div className="bg-white p-8 rounded shadow-md w-auto">
            <div className="flex justify-center mb-4">
                    <FaUser size={60} className="text-gray-700" />  {/* User icon */}
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form >
                    <div className="flex gap-10">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={user.first_name}
                                name="first_name"
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
                                name="last_name"
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            name="email"
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Phone number
                        </label>
                        <input
                            type="text"
                            value={user.phone_number}
                            name="phone_number"
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserProfile;
