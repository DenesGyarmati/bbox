<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Event;

class AdminController extends Controller
{
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
    /**
     * Toggle user activation
     */
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
    /**
     * List all events
     */

    public function events(Request $request)
    {
        $events = Event::with('reservations')
            ->orderBy('starts_at', 'asc')
            ->paginate(12);

        return response()->json($events);
    }

}