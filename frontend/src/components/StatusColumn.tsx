import { Droppable } from '@hello-pangea/dnd'
import ListItems from './ListItems'
import { fetchApi, Status, StatusTitles, type Task } from '../utils'
import { Plus, RotateCcw } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/context';

const colStyles = {
  [Status.Open]: {
    container: 'bg-slate-100/50 hover:bg-slate-100/75 border-slate-200/60',
    dot: 'bg-slate-400',
    badge: 'bg-slate-250/70 text-slate-650',
    addBtn: 'hover:bg-slate-200/80 text-slate-550 hover:text-slate-800',
    droppableDragBg: 'bg-slate-250/30 border-slate-350 border-2 border-dashed',
    emptyText: 'No plans yet',
    showAddHint: true,
  },
  [Status.InProgress]: {
    container: 'bg-amber-50/15 hover:bg-amber-50/25 border-amber-200/45',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100/50 text-amber-700 font-semibold',
    addBtn: 'hover:bg-amber-100/75 text-amber-600 hover:text-amber-800',
    droppableDragBg: 'bg-amber-100/20 border-amber-300 border-2 border-dashed',
    emptyText: 'No work in progress',
    showAddHint: false,
  },
  [Status.Completed]: {
    container: 'bg-emerald-50/20 hover:bg-emerald-50/30 border-emerald-200/45',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100/50 text-emerald-700 font-semibold',
    addBtn: 'hover:bg-emerald-100/75 text-emerald-650 hover:text-emerald-805',
    droppableDragBg: 'bg-emerald-100/20 border-emerald-300 border-2 border-dashed',
    emptyText: 'No completed actions',
    showAddHint: false,
  }
};

interface StatusColumnProps {
  type: Status;
  tasks?: Task[];
  openCreateModal: (status: Status) => void;
  openEditModal: (task: Task) => void;
  priorityFilter: string;
  newTask: { task: Task, isEdited?: boolean, previousStatus?: Status | null } | null;
  loadStats: () => void;
  setTask: React.Dispatch<React.SetStateAction<{ task: Task, isEdited?: boolean, previousStatus?: Status | null } | null>>;
}

function StatusColumn({ type, openCreateModal, openEditModal, priorityFilter, newTask, loadStats, setTask }: StatusColumnProps) {
  const styles = colStyles[type];
  const [tasks, setTasks] = useState<Task[]>([]);
  const { currentWorkspace, dragData, taskToMove, settaskToMove, setdragData } = useAuth()
  const [isLoading, setisLoading] = useState(false)
  const [error, setError] = useState(false)
  const [filteredTasks, setfilteredTasks] = useState<Task[]>([])

  const fetchData = useCallback(async () => {
    try {
      setisLoading(true);
      setError(false);
      const response = await fetchApi(`workspaces/${currentWorkspace}/tasks/${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      console.log(data);
      setTasks(data?.data || []);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setisLoading(false);
    }
  }, [currentWorkspace, type]);

  useEffect(() => {
    if (newTask) {
      if (newTask.previousStatus && newTask.previousStatus === type) {
        setTasks(prev => prev.filter(task => task.id !== newTask.task.id));
      }
      if (newTask.task.status === type) {
        if (newTask.isEdited) {
          const index = tasks.findIndex(task => task.id === newTask.task.id)
          if (index !== -1) {
            const updatedTasks = structuredClone(tasks);
            updatedTasks[index] = newTask.task;
            setTasks(updatedTasks);
          } else {
            setTasks([...tasks, newTask.task]);
          }
        } else {
          setTasks([...tasks, newTask.task])
        }
        loadStats();
      }
    }
    setTask(null);
  }, [newTask])

  useEffect(() => {
    fetchData()
  }, [type, currentWorkspace])

  const handleDeleteTask = useCallback(async (id: number) => {
    try {
      const response = await fetchApi(`tasks/${id}`, "DELETE");
      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        alert("Task deleted successfully");
      } else {
        alert("Failed to delete task");
      }
      setTasks(tasks.filter(task => task.id !== id));
      loadStats();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }, [tasks, loadStats]);

  useEffect(() => {
    if (priorityFilter === 'all') {
      setfilteredTasks([])
    } else {
      const filtered = tasks.filter(task => task.priority === priorityFilter);
      setfilteredTasks(filtered)
    }
  }, [priorityFilter])

  const destinationColumn = async (task: Task, index: number, isReverting?: boolean) => {
    if (dragData.destinationStatus === type) {
      // console.log("Moving task to column:", type, task, index);
      try {
        task.status = type;
        if (!isReverting) {
          await fetchApi(`tasks/${task.id}`, "PUT", task);
        }
        if (index >= tasks.length) {
          setTasks([...tasks, task]);
        } else {
          const targetItem = tasks[dragData.destinationIndex];
          const insertIndex = tasks.findIndex(t => t.id === targetItem.id);
          setTasks(prev => {
            const updated = [...prev];
            updated.splice(insertIndex, 0, task);
            return updated;
          });
        }
        settaskToMove(null);
        setdragData(null);
        loadStats();
      } catch (error) {
        console.error("Error moving task:", error);
        alert("Failed to move task. Reverting changes.");
        setdragData({
          id: dragData.id,
          destinationStatus: dragData.sourceStatus,
          // sourceIndex: dragData.sourceIndex,
          destinationIndex: dragData.sourceIndex,
          // sourceStatus: dragData.sourceStatus
        });
      }
    }
  }

  useEffect(() => {
    if (dragData && dragData.sourceStatus === type) {
      const updatedTasks = [...tasks];
      const [movedTask] = updatedTasks.splice(dragData.sourceIndex, 1);
      settaskToMove(movedTask);
      setTasks(updatedTasks);
    } else if (dragData && !dragData.sourceStatus) {
      destinationColumn(taskToMove!, dragData?.destinationIndex, true);
    }
  }, [dragData])

  useEffect(() => {
    if (taskToMove) {
      destinationColumn(taskToMove, dragData?.destinationIndex || 0);
    }
  }, [taskToMove])

  // console.log("Filtered tasks for", type, ":", filteredTasks);
  return (
    <div className={`p-4.5 rounded-2xl flex flex-col min-h-[500px] border transition-all duration-300 ${styles.container}`}>
      <div className='flex items-center justify-between mb-4.5 px-1'>
        <div className='flex items-center gap-2'>
          <div className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
          <h2 className='font-semibold text-slate-800 text-sm uppercase tracking-wider'>
            {StatusTitles[type]}
          </h2>
          <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${styles.badge}`}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => openCreateModal(type)}
          className={`p-1 rounded-lg transition-all cursor-pointer ${styles.addBtn}`}
          title={`Add Task to ${StatusTitles[type]}`}
        >
          <Plus className='w-4.5 h-4.5' />
        </button>
      </div>

      {/* Droppable Container */}
      {isLoading ? <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
      </div> : (!isLoading && error) ?
        <div className='h-32 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 p-4 text-center'>
          <span className='text-xs font-medium'>Failed to load tasks. Please try again.</span>
          <button
            onClick={fetchData}
            className='inline-flex items-center gap-2 bg-emerald-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-805 active:scale-[0.98] shadow-sm shadow-slate-900/10 transition-all cursor-pointer mt-3'
          >
            <RotateCcw className='w-4.5 h-4.5' />
            Retry
          </button>
        </div>
        : <Droppable droppableId={type} direction='vertical'>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-grow rounded-xl transition-all duration-200 overflow-y-auto max-h-[600px] custom-scrollbar p-1
              ${snapshot.isDraggingOver ? styles.droppableDragBg : 'bg-transparent'}`}
            >
              {filteredTasks.length > 0 || (tasks.length > 0 && priorityFilter === 'all') ? (
                (filteredTasks.length > 0 ? filteredTasks : tasks).map((task, index) => (
                  <ListItems
                    key={task.id}
                    {...task}
                    index={index}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTask}
                  />
                ))
              ) : (
                <div className='h-32 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 p-4 text-center'>
                  <span className='text-xs font-medium'>{styles.emptyText}</span>
                  {styles.showAddHint && priorityFilter === 'all' && (
                    <button
                      onClick={() => openCreateModal(type)}
                      className='text-[10px] text-emerald-650 hover:underline mt-1 font-semibold cursor-pointer'
                    >
                      + Add task first
                    </button>
                  )}
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>}
    </div>
  )
}

export default memo(StatusColumn)