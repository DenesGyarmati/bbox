<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class AttachUserMiddleware
{
    /**
     * Handles an incoming request, attaches the user to the request if the user is present.
     *
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = JWTAuth::parseToken()->authenticate();
        $request->merge(['user' => $user]);
        return $next($request);
    }
}
