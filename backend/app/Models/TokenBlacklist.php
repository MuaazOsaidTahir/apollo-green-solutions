<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TokenBlacklist extends Model
{
    protected $fillable = [
        'user_id',
        'jti',
        'revoked_at',
    ];

    protected $casts = [
        'revoked_at' => 'datetime',
    ];
}
