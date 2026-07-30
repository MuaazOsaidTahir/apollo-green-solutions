import { X } from 'lucide-react'
import React, { useState } from 'react'
import { fetchApi } from '../utils';
import { useAuth } from '../context/context';

function WorkSpacesModal({ setIsWorkSpaceModalOpen }: { setIsWorkSpaceModalOpen: (open: boolean) => void }) {
    const [formError, setFormError] = useState('');
    const [workSpaceForm, setworkSpaceForm] = useState("")
    const { setWorkspace, setCurrentWorkspace } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!workSpaceForm) {
            setFormError('Please enter a workspace name');
            return;
        }

        const response = await fetchApi("workspaces", "POST", {
            name: workSpaceForm,
        });

        const data = await response.json();

        if (response.ok) {
            setWorkspace((prev: any) => [...prev, { id: data?.data?.id, name: workSpaceForm }]);
            setCurrentWorkspace(data?.data?.id);
            localStorage.setItem('current_workspace', data?.data?.id);
            setIsWorkSpaceModalOpen(false);
            setworkSpaceForm("");
        }
    }

    return (
        <div
            onClick={() => setIsWorkSpaceModalOpen(false)}
            className='fixed inset-0 bg-slate-900/45 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in'
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-slide-up'
            >
                <div className='px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50'>
                    <h3 className='font-bold text-slate-900 text-lg'>
                        Create WorkSpace
                    </h3>
                    <button
                        onClick={() => setIsWorkSpaceModalOpen(false)}
                        className='p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer'
                    >
                        <X className='w-4.5 h-4.5' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-4.5'>
                    {formError && (
                        <div className='text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-lg'>
                            {formError}
                        </div>
                    )}

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-bold text-slate-500 uppercase tracking-wider'>WorkSpace Name</label>
                        <input
                            type='text'
                            value={workSpaceForm}
                            onChange={(e) => setworkSpaceForm(e.target.value)}
                            name="workspace_name"
                            placeholder='e.g., Apollo Green Solutions'
                            className='px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium text-slate-800'
                            autoFocus
                        />
                    </div>

                    <div className='flex items-center justify-end gap-3.5 pt-4 border-t border-slate-100 mt-2'>
                        <button
                            type='button'
                            onClick={() => setIsWorkSpaceModalOpen(false)}
                            className='px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer'
                            onClick={handleSubmit}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default WorkSpacesModal