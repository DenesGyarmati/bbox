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
     * Summary of reserve
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Event $event
     * @return \Illuminate\Http\JsonResponse
     * 
     * Creates or updates a reservation 
     * rules:
     * 1 user for 1 event max 5 reservation
     */
    public function reserve(Request $request, Event $event)
    {
        $userId = $request->user->id;

        if ($event->owner_id === $userId) {
            return response()->json(['message' => "Can't make reservations for your own event"], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:5'
        ]);

        $reservation = DB::transaction(function () use ($event, $userId, $validated) {
            $event = Event::where('id', $event->id)->lockForUpdate()->first();

            $userReservation = $event->reservations()->where('user_id', $userId)->first();
            $userQuantity = $userReservation ? $userReservation->quantity : 0;
            $otherReserved = $event->reservations()->sum('quantity') - $userQuantity;
            $available = max($event->capacity - $otherReserved, 0);

            $newQuantity = $userQuantity + $validated['quantity'];
            if ($newQuantity > 5 || $newQuantity > $available) {
                return response()->json([
                    'message' => "There are not enough tickets left"
                ], 422);
            }

            if ($userReservation) {
                $userReservation->update(['quantity' => $newQuantity]);
                return $userReservation;
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
            'event_price' => $event->price,
        ]);
    }
    /**
     * Summary of reservations
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reservations(Request $request)
    {
        $userId = $request->user->id;

        $perPage = $request->input('per_page', 20);
        $page = $request->input('page', 1);
        
        $reservations = Reservation::where('user_id', $userId)
            ->with('event:id,title,price')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($reservations);
    }
}