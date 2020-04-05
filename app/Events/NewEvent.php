<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class NewEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    

     public $rid;
     public $msg_from;
    public function __construct($msg_from,$msg_to)
    {
        $this->rid = $msg_to;
        $this->msg_from = $msg_from;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('MyChannel'.$this->rid);
    }
    // public function broadcastOn()
    // {
    //     return ['laravelAirLock'];
    // }

    public function broadcastWith(){
            return [$this->msg_from];
        }
              
}
