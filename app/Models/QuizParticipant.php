<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizParticipant extends Model
{
    protected $fillable = [
        'quiz_session_id',
        'user_id',
        'status',
        'joined_at',
        'ready_at',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(QuizSession::class);
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
