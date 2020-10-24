<?php

namespace App\Events;

use App\MessageModel;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class SeenEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */

     public $rid;
     public $user;

     public function __construct($rid)
     {
         $this->rid = $rid;
         $this->user = Auth::user()->id;

     }

    public function broadcastOn()
    {
        return new PrivateChannel('chat.'.min($this->user,$this->rid).'.'.max($this->user,$this->rid));
    }

    public function broadcastWith(){
        return ['seen'=>1];
    }


}
