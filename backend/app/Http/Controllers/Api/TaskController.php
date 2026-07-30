<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TaskController extends Controller
{
    // GET /api/workspaces/{workspace}/tasks
    public function index(Request $request, string $workspaceId, string $status)
    {
        try {
            // $workspace = $request->user()->workspaces()->findOrFail($workspaceId);
            $tasks = Task::where("workspace_id", $workspaceId)->where("status", $status)->get();
            return response()->json(['status' => 'success', 'data' => $tasks]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Workspace not found'], 404);
        }
    }

    public function stats(Request $request)
    {
        try {
            $workspaceId = $request->query('workspace_id');

            $query = Task::query();

            if ($workspaceId) {
                $query->where('workspace_id', $workspaceId);
            }

            $total = (clone $query)->count();
            $inProgress = (clone $query)->where('status', 'in_progress')->count();
            $highPriority = (clone $query)->where('status', 'open')->where('priority', 'high')->count();
            $completed = (clone $query)->where('status', 'completed')->count();
            $completionRate = $total > 0 ? round(($completed / $total) * 100) : 0;

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total' => $total,
                    'in_progress' => $inProgress,
                    'high_priority' => $highPriority,
                    'completed' => $completed,
                    'completion_rate' => $completionRate,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // POST /api/workspaces/{workspace}/tasks
    public function store(Request $request, string $workspaceId)
    {
        try {
            $workspace = $request->user()->workspaces()->findOrFail($workspaceId);
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'nullable|in:open,in_progress,completed',
                'priority' => 'nullable|in:low,moderate,high',
                'due_date' => 'nullable|date',
            ]);

            $task = $workspace->tasks()->create($validated);

            return response()->json(['status' => 'success', 'data' => $task], 201);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Workspace not found'], 404);
        }
    }

    // GET /api/tasks/{task}
    public function show(Request $request, string $id)
    {
        try {
            $task = Task::findOrFail($id);
            if ($task->workspace->user_id !== $request->user()->id) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
            }
            return response()->json(['status' => 'success', 'data' => $task]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Task not found'], 404);
        }
    }

    // PUT/PATCH /api/tasks/{task}
    public function update(Request $request, string $id)
    {
        try {
            $task = Task::findOrFail($id);
            if ($task->workspace->user_id !== $request->user()->id) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'sometimes|in:open,in_progress,completed',
                'priority' => 'sometimes|in:low,moderate,high',
                'due_date' => 'nullable|date',
            ]);

            $task->update($validated);

            return response()->json(['status' => 'success', 'data' => $task]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Task not updated'], 404);
        }
    }

    // DELETE /api/tasks/{task}
    public function destroy(Request $request, string $id)
    {
        try {
            $task = Task::findOrFail($id);
            if ($task->workspace->user_id !== $request->user()->id) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
            }
            $task->delete();

            return response()->json(['status' => 'success', 'message' => 'Task deleted']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Task not deleted'], 404);
        }
    }
}
