<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateSimpleToken
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $header = $request->header('Authorization');

        if (! $header || ! str_starts_with($header, 'Bearer ')) {
            throw new AuthenticationException('Unauthenticated.');
        }

        $token = substr($header, 7);
        $parts = explode('.', $token, 2);

        if (count($parts) !== 2) {
            throw new AuthenticationException('Unauthenticated.');
        }

        [$payload, $signature] = $parts;
        $expectedSignature = hash_hmac('sha256', $payload, config('app.key'));

        if (! hash_equals($expectedSignature, $signature)) {
            throw new AuthenticationException('Unauthenticated.');
        }

        $base64 = strtr($payload, '-_', '+/');
        $padding = strlen($base64) % 4;
        if ($padding) {
            $base64 .= str_repeat('=', 4 - $padding);
        }

        $decodedPayload = json_decode(base64_decode($base64), true);

        if (! is_array($decodedPayload) || empty($decodedPayload['sub']) || ($decodedPayload['exp'] ?? 0) < time()) {
            throw new AuthenticationException('Unauthenticated.');
        }

        $user = User::find($decodedPayload['sub']);

        if (! $user) {
            throw new AuthenticationException('Unauthenticated.');
        }

        $request->setUserResolver(fn () => $user);
        Auth::setUser($user);

        return $next($request);
    }
}
