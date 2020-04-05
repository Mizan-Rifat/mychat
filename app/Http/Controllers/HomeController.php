<?php

namespace App\Http\Controllers;

use App\Events\NewEvent;
use App\MessageModel;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index($msg)
    {

    }

    public function check()
    {
        return response()->json(['auth' => Auth::check()], 200);
        // if (Auth::check()) {
        //     return response()->json(['auth' => true], 200);
        // } else {
        //     return response()->json(['auth' => false], 403);
        // }
    }


    // SELECT * FROM `msg_tbl` INNER JOIN msg_image_tbl ON msg_tbl.id = msg_image_tbl.msg_id WHERE msg_tbl.id = 1
    public function test()
    {
        $msgs = DB::table('msg_tbl')->get();

      return  $msgs->map(function($msg){
            // return MessageModel::find($msg->id)->image;
            $msg->image = MessageModel::find($msg->id)->image;
            return $msg;
        });
       return MessageModel::find(2)->image;
    }

    public function unSeenMessages($user){
        return $user->received_messages->filter(function($msg){
            return $msg->seen == 0;
        });
    }
    public function unSeenMessagesCount($user,$rid){
        return count($this->unSeenMessages($user)->filter(function($msg) use($rid){
            return $msg->msg_from == $rid; 
        }));
    }
    public function unSeenMessageSenders($user){
        return $this->unSeenMessages($user)->pluck('msg_from')->unique();
    }
}
