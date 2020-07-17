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

class ChatEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */

    public $msg;
    public $rid;
    public $user;

    public function __construct($msg,$rid)
    {
        $this->msg = $msg;
        $this->rid = $rid;
        $this->user = Auth::user()->id;

    }


    public function broadcastOn()
    {
        return new PrivateChannel('chat.'.min($this->user,$this->rid).'.'.max($this->user,$this->rid));
    }

    public function broadcastWith(){
        return ['msg'=>$this->msg];
    }


}
