<?php

namespace Database\Seeders;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Event;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regularUsers = User::whereHas('role', fn($q) => $q->where('name', 'user'))->get();

        $events = Event::where('status', 'published')->get();

        foreach ($regularUsers as $user) {
            $reservedEvents = $events->random(rand(3, 8));

            foreach ($reservedEvents as $event) {
                Reservation::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'event_id' => $event->id,
                    ],
                    [
                        'quantity' => rand(1, 5),
                    ]
                );
            }
        }
    }
}