<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'price',
        'quantity',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function users()
    {
        return $this->belongsTo(User::class, 'ticket_user')
            ->withPivot('quantity')
            ->withTimestampls();
    }
}
