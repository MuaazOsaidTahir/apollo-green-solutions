import { fetchApi, Priority, Status, type Task } from '../utils'
import { Calendar, X } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useAuth } from '../context/context';

interface TaskModalProps {
    editingTask: boolean;
    closeModal: () => void;
    taskCreated: (task: Task) => void;
    formData: Task;
    handleFormData: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

function TaskModal({ editingTask, closeModal, formData, handleFormData, taskCreated }: TaskModalProps) {
    const [formError, setFormError] = useState('');
    const {currentWorkspace} = useAuth()

    const handleSubmit = useCallback(async(e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setFormError('Task title is required.');
            return;
        }

        try {
            const response = await fetchApi(editingTask ? `tasks/${formData?.id || ""}` : `workspaces/${currentWorkspace}/tasks`, editingTask ? "PUT" : "POST", formData);
            const data = await response.json();
            console.log(data);
            taskCreated({...formData, id: data?.data?.id});
        } catch (error) {
            console.error('Error creating task:', error);
            setFormError('An error occurred while creating the task. Please try again.');
        }
        closeModal();
    }, [formData, editingTask, closeModal])

    return (
        <div
            onClick={closeModal}
            className='fixed inset-0 bg-slate-900/45 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in'
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-slide-up'
            >
                <div className='px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50'>
                    <h3 className='font-bold text-slate-900 text-lg'>
                        {editingTask ? 'Edit Grid Task' : 'Create Grid Task'}
                    </h3>
                    <button
                        onClick={closeModal}
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
                        <label className='text-xs font-bold text-slate-500 uppercase tracking-wider'>Task Title</label>
                        <input
                            type='text'
                            value={formData.title}
                            onChange={(e) => handleFormData(e)}
                            name="title"
                            placeholder='e.g., Conduct Wind Load calculations'
                            className='px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium text-slate-800'
                            autoFocus
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-bold text-slate-500 uppercase tracking-wider'>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleFormData(e)}
                            placeholder='Brief objective of this item...'
                            name='description'
                            rows={3}
                            className='px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium text-slate-800 resize-none'
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-bold text-slate-500 uppercase tracking-wider'>Priority</label>
                            <select
                                name='priority'
                                value={formData.priority}
                                onChange={(e) => handleFormData(e)}
                                className='px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-700 bg-white font-medium cursor-pointer'
                            >
                                <option value={Priority.High}>High</option>
                                <option value={Priority.Moderate}>Moderate</option>
                                <option value={Priority.Low}>Low</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-bold text-slate-500 uppercase tracking-wider'>Status</label>
                            <select
                                name='status'
                                value={formData.status}
                                onChange={(e) => handleFormData(e)}
                                className='px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-700 bg-white font-medium cursor-pointer'
                            >
                                <option value={Status.Open}>Open</option>
                                <option value={Status.InProgress}>In Progress</option>
                                <option value={Status.Completed}>Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5 mb-1.5'>
                        <label className='text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5'>
                            <Calendar className='w-3.5 h-3.5 text-slate-400' />
                            Due Date
                        </label>
                        <input
                            name='due_date'
                            type='date'
                            value={formData.due_date}
                            onChange={(e) => handleFormData(e)}
                            className='px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-700 font-medium cursor-pointer'
                        />
                    </div>

                    <div className='flex items-center justify-end gap-3.5 pt-4 border-t border-slate-100 mt-2'>
                        <button
                            type='button'
                            onClick={closeModal}
                            className='px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer'
                        >
                            {editingTask ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TaskModal