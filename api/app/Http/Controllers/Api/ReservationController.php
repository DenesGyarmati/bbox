<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Reservation;

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

            $reservation->update([
                'quantity' => $newQuantity
            ]);

            return response()->json([
                'message' => 'Reservation updated successfully',
                'reservation' => $reservation
            ], 200);
        }

        $reservation = Reservation::create([
            'user_id' => $userId,
            'event_id' => $event->id,
            'quantity' => $validated['quantity'],
        ]);

        return response()->json([
            'message' => 'Reservation successfuly placed',
            'reservation' => $reservation,
        ], 201);
    }
}