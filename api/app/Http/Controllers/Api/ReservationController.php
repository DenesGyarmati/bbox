<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    /**
     * Creates or updates a reservation 
     * rules:
     * 1 user for 1 event max 5 reservation
     * 
     */
    public function reserve(Request $request, Event $event)
    {
        $userId = $request->user->id;
        
        if ($event->owner_id === $userId){
            return response()->json(['message' => "Can't make reservations for your own event"], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:5'
        ]);

        $reservation = DB::transaction(function () use ($event, $userId, $validated) {
            $event = Event::where('id', $event->id)->lockForUpdate()->first();

            $currentReserved = $event->reservations()->sum('quantity');

            $available = max($event->capacity - $currentReserved, 0);

            if ($available <= 0) {
                return response()->json(['message' => 'No spots left for this event'], 422);
            }

            $reservation = Reservation::where('user_id', $userId)
                ->where('event_id', $event->id)
                ->first();

            if ($reservation) {
                $newQuantity = $reservation->quantity + $validated['quantity'];

                if ($newQuantity > 5) {
                    return response()->json([
                        'message' => 'You cannot reserve more than 5 tickets for this event'
                    ], 422);
                }

                if ($newQuantity > $available) {
                    return response()->json([
                        'message' => "Only {$available} spots left for this event"
                    ], 422);
                }

                $reservation->update(['quantity' => $newQuantity]);
                return $reservation;
            }

            if ($validated['quantity'] > $available) {
                return response()->json([
                    'message' => "Only {$available} spots left for this event"
                ], 422);
            }

            return Reservation::create([
                'user_id' => $userId,
                'event_id' => $event->id,
                'quantity' => $validated['quantity'],
            ]);
        });

        if ($reservation instanceof \Illuminate\Http\JsonResponse) {
            return $reservation;
        }

        return response()->json([
            'message' => 'Reservation successfully placed/updated',
            'reservation' => $reservation,
        ]);
    }

    public function reservations(Request $request)
    {
        $userId = $request->user->id;
        
        $reservations = Reservation::where('user_id', $userId)
            ->with('event:id,title')
            ->paginate(12);

        return response()->json($reservations);

    }
}