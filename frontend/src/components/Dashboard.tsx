import { useCallback, useState, useMemo, memo, useEffect } from 'react'
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Priority, Status, type Task, fetchApi } from '../utils'
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    FolderKanban,
} from 'lucide-react'
import TaskModal from './TaskModal'
import StatusColumn from './StatusColumn'
import NavBar from './NavBar'
import { useAuth } from '../context/context'

function Dashboard() {
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<boolean>(false);
    const [formData, setformData] = useState<Task>({
        title: '',
        description: '',
        status: Status.Open as Status,
        priority: Priority.Moderate as Priority,
        due_date: new Date().toISOString().split('T')[0],
    })
    const [task, setTask] = useState<{ task: Task, isEdited?: boolean, previousStatus?: Status | null } | null>(null)
    const [previousStatus, setPreviousStatus] = useState<Status | null>(null)
    const [stats, setStats] = useState({ total: 0, in_progress: 0, high_priority: 0, completed: 0, completion_rate: 0 })
    const { setdragData, currentWorkspace } = useAuth()


    const openCreateModal = useCallback((presetStatus?: Status) => {
        setEditingTask(false);
        setPreviousStatus(null);
        setformData((e) => {
            return { ...e, status: presetStatus || Status.Open, priority: Priority.Moderate, due_date: new Date().toISOString().split('T')[0] }
        })
        setIsModalOpen(true);
    }, [])

    const openEditModal = useCallback((task: Task) => {
        setEditingTask(true);
        setPreviousStatus(null);
        setformData(task);
        setPreviousStatus(task.status)
        setIsModalOpen(true);
    }, [])

    const closeModal = useCallback(() => {
        setformData({
            title: '',
            description: '',
            status: Status.Open,
            priority: Priority.Moderate,
            due_date: new Date().toISOString().split('T')[0],
        })
        setIsModalOpen(false);
        setEditingTask(false);
        setPreviousStatus(null);
    }, [])

    const handleFormData = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setformData(prev => ({ ...prev, [name]: value }));
    }, [])

    const onDragEDnd = useCallback((result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const dragId = parseInt(draggableId, 10);
        const destStatus = destination.droppableId as Status;
        // console.log(dragId, destStatus, destination.index, source.index);

        setdragData({
            id: dragId,
            destinationStatus: destStatus,
            sourceIndex: source.index,
            destinationIndex: destination.index,
            sourceStatus: source.droppableId as Status
        });

    }, []);

    const taskCreated = (task: Task) => {
        if (editingTask) {
            setTask({ task, isEdited: true, previousStatus: previousStatus })
        } else {
            setTask({ task })
        }
    }

    const loadStats = useCallback(async () => {
        try {
            const params = currentWorkspace ? `?workspace_id=${currentWorkspace}` : '';
            const response = await fetchApi(`tasks/stats${params}`);
            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Failed to load task stats:', error);
        }
    }, [currentWorkspace]);

    useEffect(() => {
        loadStats();
    }, [currentWorkspace]);

    const dragDropContext = useMemo(() => <DragDropContext onDragEnd={onDragEDnd}>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow items-start'>
            <StatusColumn type="open" newTask={task} setTask={setTask} openCreateModal={openCreateModal} openEditModal={openEditModal} priorityFilter={priorityFilter} loadStats={loadStats} />
            {/* Column: In Progress */}
            <StatusColumn type="in_progress" newTask={task} setTask={setTask} openCreateModal={openCreateModal} openEditModal={openEditModal} priorityFilter={priorityFilter} loadStats={loadStats} />
            {/* Column: Completed */}
            <StatusColumn type="completed" newTask={task} setTask={setTask} openCreateModal={openCreateModal} openEditModal={openEditModal} priorityFilter={priorityFilter} loadStats={loadStats} />
        </div>
    </DragDropContext>, [task, priorityFilter]);

    return (
        <div className='min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col'>
            <NavBar openCreateModal={openCreateModal} priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter} />

            <main className='flex-grow max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-8'>
                <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <div className='bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between'>
                        <div className='flex flex-col'>
                            <span className='text-xs font-semibold text-slate-450 uppercase tracking-wider'>Total Tasks</span>
                            <span className='text-2xl font-bold text-slate-850 mt-1'>{stats.total}</span>
                        </div>
                        <div className='w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500'>
                            <FolderKanban className='w-5.5 h-5.5' />
                        </div>
                    </div>

                    <div className='bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between'>
                        <div className='flex flex-col'>
                            <span className='text-xs font-semibold text-slate-450 uppercase tracking-wider'>In Progress</span>
                            <span className='text-2xl font-bold text-slate-855 mt-1'>{stats.in_progress}</span>
                        </div>
                        <div className='w-12 h-12 bg-amber-50/50 border border-amber-100/60 rounded-xl flex items-center justify-center text-amber-500'>
                            <Clock className='w-5.5 h-5.5' />
                        </div>
                    </div>

                    <div className='bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between'>
                        <div className='flex flex-col'>
                            <span className='text-xs font-semibold text-slate-450 uppercase tracking-wider'>High Priority (Backlog)</span>
                            <span className='text-2xl font-bold text-rose-600 mt-1'>{stats.high_priority}</span>
                        </div>
                        <div className='w-12 h-12 bg-rose-50/50 border border-rose-100/60 rounded-xl flex items-center justify-center text-rose-500'>
                            <AlertTriangle className='w-5.5 h-5.5' />
                        </div>
                    </div>

                    <div className='bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-center'>
                        <div className='flex items-center justify-between mb-2'>
                            <span className='text-xs font-semibold text-slate-455 uppercase tracking-wider'>Completion Rate</span>
                            <span className='text-sm font-bold text-emerald-600'>{stats.completion_rate}%</span>
                        </div>
                        <div className='w-full bg-slate-100 h-2 rounded-full overflow-hidden flex'>
                            <div
                                className='bg-emerald-500 rounded-full h-full transition-all duration-500'
                                style={{ width: `${stats.completion_rate}%` }}
                            />
                        </div>
                        <span className='text-[10px] text-slate-400 font-medium mt-1.5 flex items-center gap-1'>
                            <CheckCircle2 className='w-3 h-3 text-emerald-500 shrink-0' />
                            {stats.completed} of {stats.total} initiatives finalized
                        </span>
                    </div>
                </section>

                {dragDropContext}
            </main>

            {isModalOpen && <TaskModal taskCreated={taskCreated} editingTask={editingTask} closeModal={closeModal} formData={formData} handleFormData={handleFormData} />}
        </div>
    )
}

export default memo(Dashboard)
