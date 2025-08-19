<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    /**
     * Index function paginates everything to 12/page
     */
    public function index(Request $request)
    {
        $events = Event::with('tickets')
            ->orderBy('starts_at', 'asc')
            ->paginate(12);

        return response()->json($events);
    }
    /**
     * Save the events + tickets
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'startsAt'    => 'required|date',
            'location'    => 'nullable|string|max:255',
            'capacity'    => 'nullable|integer',
            'category'    => 'nullable|string|max:255',
            'status'      => 'required|in:draft,published,cancelled',
            'tickets'     => 'required|array|min:1',
            'tickets.*.name'     => 'required|string|max:255',
            'tickets.*.price'    => 'required|numeric|min:0',
            'tickets.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated) {
            $event = Event::create([
                'title'       => $validated['title'],
                'description' => $validated['description'] ?? null,
                'starts_at'    => $validated['startsAt'],
                'location'    => $validated['location'] ?? null,
                'capacity'    => $validated['capacity'] ?? null,
                'category'    => $validated['category'] ?? null,
                'status'      => $validated['status'],
            ]);

            foreach ($validated['tickets'] as $ticketData) {
                $event->tickets()->create($ticketData);
            }

            return response()->json([
                'message' => 'Event created successfully',
                'event'   => $event->load('tickets'),
            ], 201);
        });
    }
}
