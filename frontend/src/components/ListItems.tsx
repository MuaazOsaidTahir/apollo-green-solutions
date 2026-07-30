import { Draggable } from '@hello-pangea/dnd'
import { Priority, type Task } from '../utils'
import { Calendar, Edit2, Trash2, GripVertical, AlertTriangle } from 'lucide-react'
import { memo, useCallback } from 'react';

interface ListItemsProps extends Task {
    index: number;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
}

function ListItems({ id, index, title, description, status, due_date, priority, onEdit, onDelete }: ListItemsProps) {
    const getPriorityStyles = (p: Priority) => {
        switch (p) {
            case Priority.High:
                return 'bg-rose-50 text-rose-700 border-rose-200/60';
            case Priority.Moderate:
                return 'bg-amber-50 text-amber-700 border-amber-200/60';
            case Priority.Low:
                return 'bg-emerald-50 text-emerald-700 border-emerald-250/60';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const formatDate = useCallback((dateStr: string) => {
        if (!dateStr) return 'No due date';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return dateStr;
        }
    }, [])

    return (
        <Draggable draggableId={id!.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`group relative border border-slate-200/80 bg-white p-5 rounded-2xl transition-all duration-200 mb-4 select-none
                        ${snapshot.isDragging
                            ? 'shadow-xl border-indigo-250 ring-4 ring-indigo-500/5 scale-[1.01] bg-slate-50/50'
                            : 'shadow-xs hover:shadow-md hover:border-slate-350'
                        }`}
                >
                    <div className='flex items-start justify-between gap-3 mb-2'>
                        {/* Title and grip */}
                        <div className='flex items-center gap-2 flex-grow min-w-0'>
                            <GripVertical className='w-4 h-4 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab' />
                            <h3 className='font-semibold text-slate-800 leading-snug truncate text-[15px]'>
                                {title}
                            </h3>
                        </div>

                        {/* Actions */}
                        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0'>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit({ id, title, description, status, due_date, priority });
                                }}
                                className='p-1.5 text-slate-450 hover:text-indigo-650 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer'
                                title="Edit Task"
                            >
                                <Edit2 className='w-3.5 h-3.5' />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(id!, );
                                }}
                                className='p-1.5 text-slate-450 hover:text-rose-650 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer'
                                title="Delete Task"
                            >
                                <Trash2 className='w-3.5 h-3.5' />
                            </button>
                        </div>
                    </div>

                    <p className='text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed'>
                        {description || <span className='italic text-slate-400'>No description provided</span>}
                    </p>

                    <div className='flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs'>
                        {/* Priority Badge */}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium border text-[10px] uppercase tracking-wider ${getPriorityStyles(priority)}`}>
                            {priority === Priority.High && <AlertTriangle className='w-3 h-3 mr-1 shrink-0' />}
                            {priority}
                        </span>

                        {/* Due Date */}
                        <div className='flex items-center gap-1 text-slate-500'>
                            <Calendar className='w-3.5 h-3.5 text-slate-450' />
                            <span>{formatDate(due_date)}</span>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default memo(ListItems)