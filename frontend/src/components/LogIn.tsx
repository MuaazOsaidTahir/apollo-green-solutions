import React, { useState } from 'react'
import NavBar from './NavBar';
import { fetchApi } from '../utils';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/context';

function LogIn() {
    const [formError, setFormError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ""
    });
    const [currentState, setCurrentState] = useState("login")
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetchApi(currentState, "POST", formData);
            const data = await response.json();
            if (data.status === "success") {
                login(data.data.token, data.data.user);
                navigate("/");
            } else {
                setFormError(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <div
            className='fixed inset-0 bg-slate-900/45 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in'
        >
            <div
                className='bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-slide-up'
            >
                <NavBar onlyLogo={true} />
                <div className='px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50'>
                    <h3 className='font-bold text-slate-900 text-lg'>
                        {currentState === "login" ? "Log In" : "Register"}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-4.5'>
                    {formError && (
                        <div className='text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-lg'>
                            {formError}
                        </div>
                    )}

                    {currentState === "register" && <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-bold text-slate-500 uppercase tracking-wider'>Name</label>
                        <input
                            type='text'
                            value={formData.name}
                            onChange={(e) => handleFormData(e)}
                            name="name"
                            placeholder='Your Name...'
                            className='px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium text-slate-800'
                        />
                    </div>}

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-bold text-slate-500 uppercase tracking-wider'>Email</label>
                        <input
                            type='text'
                            value={formData.email}
                            onChange={(e) => handleFormData(e)}
                            name="email"
                            placeholder='Your Email...'
                            className='px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium text-slate-800'
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-bold text-slate-500 uppercase tracking-wider'>Password</label>
                        <input
                            type='password'
                            value={formData.password}
                            onChange={(e) => handleFormData(e)}
                            placeholder='password...'
                            name='password'
                            className='px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium text-slate-800 resize-none'
                        />
                    </div>

                    <div className='flex items-center justify-end gap-3.5 pt-4 border-t border-slate-100 mt-2'>
                        <button
                            type='button'
                            onClick={() => setCurrentState(currentState === "login" ? "register" : "login")}
                            className='px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer'
                        >
                            Click here to {currentState === "login" ? "Register" : "Log In"}
                        </button>
                        <button
                            type='submit'
                            className='px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer'
                        >
                            {currentState === "login" ? "Log In" : "Register"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LogIn