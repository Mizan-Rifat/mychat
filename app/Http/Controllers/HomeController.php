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

       

        // return DB::table('msg_tbl')
        //     ->where(function ($query){
        //         $query->where('msg_to', 1)
        //             ->Where('msg_from', 2)
        //             ->where('is_deleted_from_reciever', 0);
        //     })
        //     ->orWhere((function ($query){
        //         $query->where('msg_to', 2)
        //             ->Where('msg_from', 1)
        //             ->where('is_deleted_from_sender', 0);
        //     }))
        //     ->offset(0)
        //     // ->limit(0)
        //     ->get();

        // DB::table('msg_tbl')->truncate();
        // DB::table('msg_content_tbl')->truncate();
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
