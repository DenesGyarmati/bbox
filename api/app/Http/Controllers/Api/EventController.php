<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class EventController extends Controller
{
    /**
     * Index function paginates everything to 12/page
     */
    public function index(Request $request)
    {
        $userId = null;

        try {
            if ($user = JWTAuth::parseToken()->authenticate()) {
                $userId = $user->id;
            }
        } catch (JWTException $e) {}

        $eventsQuery = Event::query()
            ->orderBy('starts_at', 'asc');

        if ($userId) {
            $eventsQuery->where('owner_id', '!=', $userId);
        }

        $events = $eventsQuery->paginate(12);

        return response()->json($events);
    }
    /**
     * Organizators events paginates everything to 12/page
     */
    public function my(Request $request)
    {
        $userId = $request->user->id;

        $events = Event::with('reservations')
            ->where('owner_id', $userId)
            ->orderBy('starts_at', 'asc')
            ->paginate(12);

        return response()->json($events);
    }
    /**
     * Save the events
     */
    public function store(Request $request)
    {
        $userId = $request->user->id;

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'startsAt'    => 'required|date',
            'location'    => 'nullable|string|max:255',
            'capacity'    => 'nullable|integer',
            'price'       => 'nullable|numeric|min:0',
            'category'    => 'nullable|string|max:255',
            'status'      => 'required|in:draft,published,cancelled',
        ]);

        $event = Event::create([
            'owner_id'    => $userId,
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'starts_at'   => $validated['startsAt'],
            'location'    => $validated['location'] ?? null,
            'capacity'    => $validated['capacity'] ?? 0,
            'price'       => $validated['price'] ?? 0,
            'category'    => $validated['category'] ?? null,
            'status'      => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Event created successfully',
            'event'   => $event,
        ], 201);
    }
    /**
     * Update the events
     */
    public function update(Request $request, Event $event)
    {
        $userId = $request->user->id;

        if ($event->owner_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'startsAt'    => 'required|date',
            'location'    => 'nullable|string|max:255',
            'capacity'    => 'nullable|integer|min:' . $event->capacity,
            'price'       => 'nullable|numeric|min:0',
            'category'    => 'nullable|string|max:255',
            'status'      => 'required|in:draft,published,cancelled',
        ]);

        $event->update([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? $event->description,
            'starts_at'   => $validated['startsAt'],
            'location'    => $validated['location'] ?? $event->location,
            'capacity'    => $validated['capacity'] ?? $event->capacity,
            'price'       => $validated['price'] ?? $event->price,
            'category'    => $validated['category'] ?? $event->category,
            'status'      => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Event updated successfully',
            'event'   => $event,
        ]);
    }


    /**
     * Show a single event by ID
     */
    public function show($id)
    {
        $event = Event::with('reservations')->find($id);

        if (!$event) {
            return response()->json([
                'error' => 'Event not found'
            ], 404);
        }

        return response()->json($event);
    }
}
