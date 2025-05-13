<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications
        ]);
    }

    public function getUnreadCount()
    {
        $count = Notification::where('user_id', auth()->id())
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }

    public function getLatest()
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'message' => $notification->data['message'],
                    'icon_html' => $notification->getIconHtml(),
                    'color_class' => $notification->getColorClass(),
                    'time_ago' => $notification->getTimeAgo(),
                    'is_read' => $notification->isRead(),
                ];
            });

        return response()->json(['notifications' => $notifications]);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);
        
        if ($notification->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return back()->with(['success' => "Marqué comme lue"]);
    }

    public function markAllAsRead()
    {
        Notification::where('user_id', auth()->id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return redirect()->back()->with(['success' => "Tout Marqué comme lue"]);
    }
}