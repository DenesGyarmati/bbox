<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Event API",
 *     description="API documentation for managing events",
 *     @OA\Contact(
 *         email="support@example.com"
 *     )
 * )
 *
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="API Server"
 * )
 */
class EventController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/events",
     *     summary="Retrieve a list of events",
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search term for event title",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="location",
     *         in="query",
     *         description="Filter by location",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="category",
     *         in="query",
     *         description="Filter by category",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Number of items per page",
     *         required=false,
     *         @OA\Schema(type="integer", default=12)
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="A list of events",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     required={"id","title","starts_at","status"},
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="title", type="string", example="Sample Event"),
     *                     @OA\Property(property="starts_at", type="string", format="date-time", example="2025-08-23T14:00:00Z"),
     *                     @OA\Property(property="status", type="string", enum={"draft","published","cancelled"}, example="published"),
     *                     @OA\Property(property="reserved_quantity", type="integer", example=5)
     *                 )
     *             ),
     *             @OA\Property(property="links", type="object"),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $location = $request->input('location');
        $category = $request->input('category');
        $perPage = $request->input('per_page', 12);
        $page = $request->input('page', 1);

        $events = Event::query()
            ->with('reservations')
            ->withSum('reservations as reserved_quantity', 'quantity')
            ->where('status', 'published')
            ->when($search, function ($query, $search) {
                $search = strtolower($search);
                $query->where(function ($q) use ($search) {
                    $q->whereRaw('LOWER(title) LIKE ?', ["%{$search}%"]);
                });
            })
            ->when($location, function ($query, $location) {
                $query->where('location', $location);
            })
            ->when($category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->select('events.*')
            ->selectRaw('COALESCE(SUM(reservations.quantity), 0) as reserved_quantity')
            ->leftJoin('reservations', 'reservations.event_id', '=', 'events.id')
            ->groupBy('events.id')
            ->havingRaw('COALESCE(SUM(reservations.quantity), 0) < events.capacity')
            ->orderBy('starts_at', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($events);
    }

    /**
     * Summary of my
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function my(Request $request)
    {
        $userId = $request->user->id;
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 12);

        $events = Event::with('reservations')
            ->where('owner_id', $userId)
            ->orderBy('starts_at', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($events);
    }
    /**
     * Summary of store
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
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
     * Summary of update
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Event $event
     * @return \Illuminate\Http\JsonResponse
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
     * Summary of status
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Event $event
     * @return \Illuminate\Http\JsonResponse
     */
    public function status(Request $request, Event $event)
    {
        $userId = $request->user->id;

        if ($event->owner_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status'      => 'required|in:draft,published,cancelled',
        ]);

        $event->update([
            'status'  => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Event status updated successfully',
            'event' => $event,
        ]);
    }

    /**
     * Summary of show
     * @param \Illuminate\Http\Request $request
     * @param mixed $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        $userId = optional($request->user)->id;
        $event = Event::with(['reservations.user:id,name'])->find($id);

        if (!$event) {
            return response()->json([
                'error' => 'Event not found'
            ], 404);
        }

        $totalReserved = $event->reservations->sum('quantity');
        $remainingCapacity = max($event->capacity - $totalReserved, 0);

        $event->remaining_capacity = $remainingCapacity;
        $event->reserved_quantity = $totalReserved;

        if ($userId && $event->owner_id !== $userId) {
            $event->setRelation(
                'reservations',
                $event->reservations->where('user_id', $userId)->values()
            );
        } elseif (!$userId) {
            $event->setRelation('reservations', collect());
        }

        return response()->json($event);
    }
    /**
     * Summary of filter
     * @param \Illuminate\Http\Request $request
     * @return array{categories: mixed, locations: mixed}
     */
    public function filter(Request $request)
    {
        $locations = Event::where('status', 'published')
            ->distinct()
            ->pluck('location')
            ->filter()
            ->values();

        $categories = Event::where('status', 'published')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return [
            'locations' => $locations,
            'categories' => $categories,
        ];
    }
}
