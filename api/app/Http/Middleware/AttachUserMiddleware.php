<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AttachUserMiddleware
{
    /**
     * Handles an incoming request, attaches the user to the request if the user is present.
     *
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            if ($user = JWTAuth::parseToken()->authenticate()) {
                $request->merge(['user' => $user]);
            }
        } catch (JWTException $e) {}
        return $next($request);
    }
}
