<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\PpdbSetting;

class FonnteService
{
    protected $token;

    public function __construct()
    {
        $setting = PpdbSetting::latest()->first();
        $this->token = $setting->body['fonnte_token'] ?? null;
    }

    public function sendMessage($target, $message)
    {
        if (!$this->token) {
            return [
                'status' => false,
                'reason' => 'Fonnte Token belum diatur di pengaturan.',
            ];
        }

        // Clean target number (remove + and ensure it starts with 62 or 08)
        $target = preg_replace('/[^0-9]/', '', $target);

        $response = Http::withHeaders([
            'Authorization' => $this->token,
        ])->post('https://api.fonnte.com/send', [
            'target' => $target,
            'message' => $message,
        ]);

        return $response->json();
    }
}
