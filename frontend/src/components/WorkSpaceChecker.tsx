import { Outlet } from 'react-router';
import { useAuth } from '../context/context';
import NavBar from './NavBar';
import { FolderKanban, Sparkles } from 'lucide-react';

function WorkSpaceChecker() {
    const { workspace, isLoadingWorkspace, currentWorkspace } = useAuth();

    if (isLoadingWorkspace) {
        return (
            <div className='min-h-screen bg-slate-50 flex items-center justify-center px-6'>
                <div className='bg-white border border-slate-200/80 rounded-2xl shadow-xs px-8 py-6 text-center'>
                    <div className='w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4'>
                        <Sparkles className='w-5 h-5' />
                    </div>
                    <p className='text-sm font-semibold text-slate-700'>Preparing your workspace view...</p>
                </div>
            </div>
        );
    }

    if (!workspace?.length) {
        return (
            <>
                <NavBar />
                <main className='min-h-[calc(100vh-80px)] bg-slate-50 px-6 py-10 flex items-center justify-center'>
                    <div className='w-full max-w-xl rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm text-center'>
                        <div className='w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5'>
                            <FolderKanban className='w-6 h-6' />
                        </div>
                        <h2 className='text-2xl font-semibold text-slate-900'>Create your first workspace</h2>
                        <p className='mt-3 text-sm leading-6 text-slate-500'>Start by creating a workspace to organize projects, tasks, and progress for your team.</p>
                        <div className='mt-6 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-600'>
                            Use the workspace action in the navigation bar to get started.
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!currentWorkspace) {
        return (
            <>
                <NavBar />
                <main className='min-h-[calc(100vh-80px)] bg-slate-50 px-6 py-10 flex items-center justify-center'>
                    <div className='w-full max-w-xl rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm text-center'>
                        <div className='w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5'>
                            <FolderKanban className='w-6 h-6' />
                        </div>
                        <h2 className='text-2xl font-semibold text-slate-900'>Choose a workspace</h2>
                        <p className='mt-3 text-sm leading-6 text-slate-500'>Select a workspace from the top navigation to view its tasks and board.</p>
                        <div className='mt-6 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-600'>
                            The workspace selector is ready in the navigation bar.
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return <Outlet />;
}

export default WorkSpaceChecker;