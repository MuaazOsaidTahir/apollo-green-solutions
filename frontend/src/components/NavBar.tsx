import { Filter, Leaf, Plus } from 'lucide-react'
import { Priority } from '../utils'
import WorkSpacesModal from './WorkSpacesModal'
import { memo, useState } from 'react';
import { useAuth } from '../context/context';

function NavBar({ openCreateModal, priorityFilter, setPriorityFilter, onlyLogo }: { openCreateModal?: () => void, priorityFilter?: string, setPriorityFilter?: (filter: string) => void, onlyLogo?: boolean }) {
    const [isWorkSpaceModalOpen, setIsWorkSpaceModalOpen] = useState(false);
    const { workspace, currentWorkspace, setCurrentWorkspace, user, logout } = useAuth();

    return (
        <header className='sticky top-0 bg-white border-b border-slate-200/80 z-30 px-6 py-4 shadow-xs'>
            <div className='max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-200/50'>
                        <Leaf className='w-5.5 h-5.5' />
                    </div>
                    <div>
                        <div className='flex items-center gap-2'>
                            <span className='font-bold text-slate-900 tracking-tight text-xl'>Apollo</span>
                            <span className='px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-100'>Green Solutions</span>
                        </div>
                        <p className='text-xs text-slate-400 font-medium mt-0.5'>Project Green Grid Operations Board</p>
                    </div>
                </div>

                {!onlyLogo && <><div className='flex flex-wrap items-center gap-3'>
                    <div className='flex items-center gap-1.5 bg-slate-50 border border-slate-200/85 px-3 py-2 rounded-xl text-sm text-slate-500 focus-within:ring-2 focus-within:ring-emerald-500/20'>
                        <Filter className='w-4 h-4 text-slate-400' />
                        <select
                            value={currentWorkspace}
                            disabled={workspace?.length === 0}
                            onChange={(e) => {
                                setCurrentWorkspace(e.target.value);
                                localStorage.setItem('current_workspace', e.target.value);
                            }}
                            className='bg-transparent border-0 focus:outline-hidden font-medium text-slate-700 pr-1 cursor-pointer'
                        >
                            <option>{workspace?.length === 0 ? "No Workspaces" : "Select Workspace"}</option>
                            {workspace?.length > 0 && (
                                workspace.map((ws: any) => (
                                    <option key={ws.id} value={ws.id}>{ws.name}</option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                    <div className='flex flex-wrap items-center gap-3'>
                        <div className='flex items-center gap-1.5 bg-slate-50 border border-slate-200/85 px-3 py-2 rounded-xl text-sm text-slate-500 focus-within:ring-2 focus-within:ring-emerald-500/20'>
                            <Filter className='w-4 h-4 text-slate-400' />
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className='bg-transparent border-0 focus:outline-hidden font-medium text-slate-700 pr-1 cursor-pointer'
                            >
                                <option value='all'>All Priorities</option>
                                <option value={Priority.High}>High</option>
                                <option value={Priority.Moderate}>Moderate</option>
                                <option value={Priority.Low}>Low</option>
                            </select>
                        </div>

                        <button
                            onClick={() => openCreateModal()}
                            className='inline-flex items-center gap-2 bg-slate-900 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-805 active:scale-[0.98] shadow-sm shadow-slate-900/10 transition-all cursor-pointer'
                        >
                            <Plus className='w-4.5 h-4.5' />
                            Create Task
                        </button>
                        <button
                            onClick={() => setIsWorkSpaceModalOpen(true)}
                            className='inline-flex items-center gap-2 bg-slate-900 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-805 active:scale-[0.98] shadow-sm shadow-slate-900/10 transition-all cursor-pointer'
                        >
                            <Plus className='w-4.5 h-4.5' />
                            Create WorkSpace
                        </button>
                        <div className='flex flex-col items-center gap-3'>
                            <p>Hey {user?.name}👋</p>
                            <button
                                onClick={logout}
                                className='inline-flex items-center gap-2 bg-red-400 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-805 active:scale-[0.98] shadow-sm shadow-slate-900/10 transition-all cursor-pointer'
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </>}
            </div>
            {isWorkSpaceModalOpen && <WorkSpacesModal setIsWorkSpaceModalOpen={setIsWorkSpaceModalOpen} />}
        </header >
    )
}

export default memo(NavBar)