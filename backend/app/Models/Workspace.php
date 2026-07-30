<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Workspace extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['user_id', 'name'];

    // Workspace BELONGS TO 1 User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Workspace HAS MANY Tasks
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}