<?php

namespace App\Http\Controllers;

use App\Events\ChatEvent;
use App\Events\NewEvent;
use App\MessageModel;
use App\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;
use Validator;

class MessageController extends Controller
{
    public function getMessages(Request $request)
    {

        $user = Auth::user();
        $rid = $request->rid;
        $page = $request->page;

        $recipent = User::find($rid);
        $limit = 10;

        $count = DB::table('msg_tbl')
            ->where(function ($query) use ($user, $recipent) {
                $query->where('msg_to', $user->id)
                    ->Where('msg_from', $recipent->id)
                    ->where('is_deleted_from_reciever', 0);
            })
            ->orWhere((function ($query) use ($user, $recipent) {
                $query->where('msg_to', $recipent->id)
                    ->Where('msg_from', $user->id)
                    ->where('is_deleted_from_sender', 0);
            }))
            ->count();

        $messagesQ = DB::table('msg_tbl')
            ->where(function ($query) use ($user, $recipent) {
                $query->where('msg_to', $user->id)
                    ->Where('msg_from', $recipent->id)
                    ->where('is_deleted_from_reciever', 0);
            })
            ->orWhere((function ($query) use ($user, $recipent) {
                $query->where('msg_to', $recipent->id)
                    ->Where('msg_from', $user->id)
                    ->where('is_deleted_from_sender', 0);
            }))
            ->offset($count - ($limit * $page))
            ->limit($limit)
            ->get();


        $messages = $messagesQ->map(function ($msg) {
            // return MessageModel::find($msg->id)->image;
            $contents = MessageModel::find($msg->id)->content;
            $msg->contents = $contents->map(function ($content) {
                $a['content'] = $content->content;
                $a['format'] = $content->format;
                return $a;
            });
            return $msg;
        });




        $perPageCount = count($messages);

        $any = DB::table('msg_tbl')
            ->where('msg_to', $user->id)
            ->Where('msg_from', $recipent->id)
            ->where('is_deleted_from_reciever', 0)
            ->where('seen', 0)
            ->update(['seen' => 1]);


        return response()->json(['messages' => $messages, 'count' => $count]);
    }


    public function getAllusers()
    {
        $users = User::all()->except(Auth::user()->id);

        $user = User::find(Auth::user()->id);

        $users->map(function ($us) use ($user) {

            if ($this->unSeenMessageSenders($user)->contains($us->id)) {
                $us['unReadMessages'] = $this->unSeenMessagesCount($user, $us->id);
            } else {
                $us['unReadMessages'] = 0;
            }

            return $us;
        });

        return response()->json(['users' => $users]);
    }

    public function store(Request $request)
    {

        // return $request;


        $user = Auth::user();
        // $validator = validator::make($request->all(), [
        //     'msg' => 'required'
        // ]);

        $newMsg = new MessageModel;

        $newMsg->msg_from = $user->id;
        $newMsg->msg_to = $request->msg_to;
        $newMsg->save();

        collect($request->content)->map(function ($item) use ($request,$newMsg) {
            
            if($request->format == 'image'){
                $item->store('pics');

                $newMsg->content()->create([
                    'content' => $item->hashName(),
                    'format' => $request->format,
                ]);
            }elseif($request->format == 'text'){
                $newMsg->content()->create([
                    'content' => $item,
                    'format' => $request->format,
                ]);
            }
           
        });
   

        $newMsg->save();

        return $newMsg;

        $id = DB::table('msg_tbl')
            ->insertGetId([
                'msg_from' => $user->id,
                'msg_to' => $request->msg_to,
            ]);

        if ($request->format == 'text') {

            $content = DB::table('msg_content_tbl')
                ->insert([
                    'content' => $request->content,
                    'format' => $request->format,
                    'msg_id' => $id
                ]);
        }



        $message = MessageModel::find($id);

        if ($request->format == 'image') {

            collect($request->content)->map(function ($item) use ($id, $request) {
                $item->store('pics');
                DB::table('msg_content_tbl')
                    ->insert([
                        'content' => $item->hashName(),
                        'format' => $request->format,
                        'msg_id' => $id
                    ]);
            });
            // $uploadedFiles[] = $request->pics[0]->getClientOriginalName();
            // $uploadedFiles[] = $request->pics[0]->path();
            // $uploadedFiles[] = $request->pics[0]->extension();
            // $uploadedFiles[] = $request->pics[0]->hashName();
            // $uploadedFiles[] = $request->pics[0]->hashName();
            // $uploadedFiles[] = $request->pics[0]->clientExtension();
        }


        // event(new ChatEvent($message, $request->msg_to));
        // event(new NewEvent($user->id, $request->msg_to));

        return response()->json(['message' => $message]);
    }



    public function delete(Request $request)
    {

        $msg = MessageModel::find($request->id);

        if (Auth::user()->id == $msg->sender['id']) {

            if ($msg->is_deleted_from_reciever == 1) {
                $msg->delete();
            } else {
                DB::table('msg_tbl')
                    ->where('id', $request->id)
                    ->update(['is_deleted_from_sender' => 1]);
            }
        } elseif (Auth::user()->id == $msg->receiver['id']) {

            if ($msg->is_deleted_from_sender == 1) {
                $msg->delete();
            } else {
                DB::table('msg_tbl')
                    ->where('id', $request->id)
                    ->update(['is_deleted_from_reciever' => 1]);
            }
        }

        return response()->json(['data' => 'message deleted successfully'], 200);
    }
    public function deleteAll(Request $request)
    {
        $user = Auth::user();
        $recipent = $request;

        try {


            $receivedMessages = DB::table('msg_tbl')
                ->where('msg_to', $user->id)
                ->Where('msg_from', $recipent->id)
                ->where('is_deleted_from_reciever', 0)
                ->update(['is_deleted_from_reciever' => 1]);

            $sendMessages = DB::table('msg_tbl')
                ->where('msg_from', $user->id)
                ->Where('msg_to', $recipent->id)
                ->where('is_deleted_from_sender', 0)
                ->update(['is_deleted_from_sender' => 1]);


            return response()->json(['messages' => 'conversation deleted'], 200);
        } catch (Exception $e) {
            return response()->json(['messages' => $e]);
        }
    }

    public function getMessagesCount()
    {
        $user = Auth::user();
        $messages = $this->unSeenMessages($user);
        $messageSenders = $this->unSeenMessageSenders($user);

        $data = $messageSenders->map(function ($item) use ($messages) {
            $msg['id'] = $item;
            $msg['count'] = count($messages->filter(function ($msg) use ($item) {
                return $msg->msg_from == $item;
            }));
            return $msg;
        });


        return $data;
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


    public function setSeen(Request $request)
    {
        DB::table('msg_tbl')
            ->where('id', $request->id)
            ->update(['seen' => 1]);
    }


    public function uploadFiles(Request $request)
    {
        return $request;
    }
}
