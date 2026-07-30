<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = ['workspace_id', 'title', 'description', 'status', 'priority', 'due_date'];

    // Task BELONGS TO 1 Workspace
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}