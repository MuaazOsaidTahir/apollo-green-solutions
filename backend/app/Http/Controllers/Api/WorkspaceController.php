<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    // GET /api/workspaces
    public function index(Request $request)
    {
        try {
            $workspaces = $request->user()->workspaces()->orderBy("created_at", "desc")->paginate(5);
            return response()->json(['status' => 'success', 'data' => $workspaces]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // POST /api/workspacess
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $workspace = $request->user()->workspaces()->create([
                'name' => $validated['name'],
            ]);

            return response()->json(['status' => 'success', 'data' => $workspace], 201);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/workspaces/{id}
    public function show(Request $request, string $id)
    {
        try {
            $workspace = $request->user()->workspaces()->with('tasks')->findOrFail($id);
            return response()->json(['status' => 'success', 'data' => $workspace]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // PUT/PATCH /api/workspaces/{id}
    public function update(Request $request, string $id)
    {
        try {
            $workspace = $request->user()->workspaces()->findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $workspace->update($validated);
            return response()->json(['status' => 'success', 'data' => $workspace]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // DELETE /api/workspaces/{id}
    public function destroy(Request $request, string $id)
    {
        try {
            $workspace = $request->user()->workspaces()->findOrFail($id);
            $workspace->delete();

            return response()->json(['status' => 'success', 'message' => 'Workspace deleted']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
