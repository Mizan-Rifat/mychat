<?php

namespace App\Http\Controllers;

use App\Events\NewEvent;
use App\Http\Resources\MessageCollection;
use App\Http\Resources\MessageResource;
use App\Http\Resources\Messages;
use App\MessageModel;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class HomeController extends Controller
{
    
    public function __construct()
    {
      
    }

    
    public function test()
    { 

      $user = User::where('id','1')->get();
      if($user->isEmpty()){
          return 'gfg';
      }else{
          return 'sdf';
      }
      


        $messages  = MessageModel::unseenMessages(1,2)->update(['seen'=>3]);


     return $messages;
        return new MessageResource($messages);

    }

    public function remove()
    {
        DB::table('msg_tbl')->truncate();
        DB::table('msg_content_tbl')->truncate();
     
    }


    // SELECT * FROM `msg_tbl` INNER JOIN msg_image_tbl ON msg_tbl.id = msg_image_tbl.msg_id WHERE msg_tbl.id = 1
    public function test1(Request $request)
    {

        collect($request)->map(function ($item) {
            if ($item['id'] != 1) {
                $id = DB::table('categories')
                    ->insertGetId([
                        'image' => $item['image_url'],
                        'display_mode' => $item['display_mode']
                    ]);

                DB::table('category_translations')
                    ->insert([
                        'name' => $item['name'],
                        'slug' => $item['slug'],
                        'description' => $item['description'],
                        'category_id' => $id

                    ]);
                collect([11, 23, 24, 25])->map(function ($no) use ($id) {
                    DB::table('category_filterable_attributes')
                        ->insert([

                            'category_id' => $id,
                            'attribute_id' => $no

                        ]);
                });
            }
        });






        // DB::table('msg_tbl')->truncate();
        // DB::table('msg_content_tbl')->truncate();
    }

    public function unSeenMessages($user)
    {
        return $user->received_messages->filter(function ($msg) {
            return $msg->seen == 0;
        });
    }
    public function unSeenMessagesCount($user, $rid)
    {
        return count($this->unSeenMessages($user)->filter(function ($msg) use ($rid) {
            return $msg->msg_from == $rid;
        }));
    }
    public function unSeenMessageSenders($user)
    {
        return $this->unSeenMessages($user)->pluck('msg_from')->unique();
    }

    public function paymentProcess(Request $request){
        \Stripe\Stripe::setApiKey('sk_test_51GuKLVDkImmDuu4ZA2x6pl0MaKWPTg0UeaVtFUxJEEjXuy3S6QyOfkGZno9mSv2HqBn1GqHDIjvjUOlzstpXm4kD00gK6lu955');
        $token = $request->stripeToken;

        $charge = \Stripe\Charge::create([
            'amount'=>10000,
            'currency' => 'usd',
            'description' => 'Example Charge',
            'source'=>$token
        ]);
        

        Session::flash('success', 'Payment successful!');
          
    }
}
