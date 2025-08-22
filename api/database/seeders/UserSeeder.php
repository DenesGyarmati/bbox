<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        $organizerRole = Role::where('name', 'organizer')->first();
        $userRole = Role::where('name', 'user')->first();

        User::firstOrCreate(
            ['email' => 'admin@eventhub.local'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('Admin123!'),
                'role_id' => $adminRole?->id,
                'is_active' => true,
            ]
        );

        $organizerUser = User::firstOrCreate(
            ['email' => 'org@eventhub.local'],
            [
                'name' => 'Organizer User',
                'password' => Hash::make('Org123!'),
                'role_id' => $organizerRole?->id,
                'is_active' => true,
            ]
        );

        Event::factory()->count(24)->for($organizerUser, 'owner')->create();

        User::firstOrCreate(
            ['email' => 'user@eventhub.local'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('User123!'),
                'role_id' => $userRole?->id,
                'is_active' => true,
            ]
        );
    }
}
