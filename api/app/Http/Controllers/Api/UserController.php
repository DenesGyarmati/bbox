<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    /**
     * Returns the role options
     */
    public function roles(Request $request)
    {
        return Role::select('id', 'name')->get();
    }

    /**
     * Generate jwt after login/register
     * The auth part is relative small so it can stay inside the UserController
     */
    protected function generateJwt(User $user)
    {
        $customClaims = [
            'roleId' => $user->role_id,
            'username' => $user->name,
        ];

        $token = JWTAuth::customClaims($customClaims)->fromUser($user);

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
        ];
    }

    /**
     * Registration
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role,
        ]);
        $jwt = $this->generateJwt($user);

        return response()->json([
            'user' => $user,
            'access_token' => $jwt['access_token'],
            'token_type' => $jwt['token_type'],
            'expires_in' => $jwt['expires_in'],
        ]);
    }
    /**
     * Login + jwt
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $user = JWTAuth::user();
            $jwt = $this->generateJwt($user);

            return response()->json([
                'user' => $user,
                'access_token' => $jwt['access_token'],
                'token_type' => $jwt['token_type'],
                'expires_in' => $jwt['expires_in'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }

    /**
     * List out all users with all relevant data for the admin users.
     */
    public function index()
    {
        $users = User::with('role:id,name')
        ->select('id', 'name', 'email', 'is_active', 'created_at', 'role_id')
        ->get();

        return response()->json($users);
    }

    public function activate(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if ($request->has('is_active')) {
            $user->is_active = $request->input('is_active');
        } else {
            $user->is_active = !$user->is_active;
        }

        $user->save();

        return response()->json([
            'message' => $user->is_active ? 'User activated successfully' : 'User deactivated successfully',
            'user' => $user
        ]);
    }
}