<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // POST /api/register
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $token = $this->createUserToken($user);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // POST /api/login
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if (!Auth::attempt($validated)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid login credentials.'
                ], 401);
            }

            $user = User::where('email', $validated['email'])->firstOrFail();
            $token = $this->createUserToken($user);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        try {
            return response()->json([
                'status' => 'success',
                'message' => 'Logged out successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // GET /api/user
    public function user(Request $request)
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => $request->user()->only(['id', 'name', 'email'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function createUserToken(User $user): string
    {
        $payload = [
            'sub' => $user->getKey(),
            'iat' => time(),
            'exp' => time() + 60 * 60 * 24,
        ];

        $encodedPayload = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
        $signature = hash_hmac('sha256', $encodedPayload, config('app.key'));

        return $encodedPayload . '.' . $signature;
    }
}
