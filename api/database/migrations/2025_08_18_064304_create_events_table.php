<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void 
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('title'); 
            $table->text('description')->nullable();
            $table->dateTime('starts_at'); 
            $table->string('location')->nullable(); 
            $table->integer('capacity')->nullable(); 
            $table->string('category')->nullable(); 
            $table->enum('status', ['draft', 'published', 'cancelled'])->default('draft'); 
            $table->timestamps(); 
        }); 
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
