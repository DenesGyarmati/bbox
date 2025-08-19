<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'title',
        'desctiption',
        'starts_at',
        'location',
        'capacity',
        'category',
        'status',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
    ];

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
