<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Event;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $categories = ['Music', 'Art', 'Tech', 'Sports', 'Education'];
        $locations = ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Miami'];

        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'starts_at' => $this->faker->dateTimeBetween('+1 days', '+3 months'),
            'location' => $this->faker->randomElement($locations),
            'capacity' => $this->faker->numberBetween(50, 500),
            'price' => $this->faker->randomFloat(2, 0, 200),
            'category' => $this->faker->randomElement($categories),
            'status' => 'published', // or random if you like
        ];
    }
}
