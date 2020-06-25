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
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Stmt\TryCatch;
use Validator;

class MessageController extends Controller
{
    public function getMessages(Request $request)
    {

        $user = Auth::user();
        $rid = $request->rid;
        $page = $request->page;

        $recipient = User::find($rid);
        $recipientName = $recipient->name;
        $initLimit = 10;
        $limit=10;

        $ruser = User::find($rid);

        if(!$ruser){
            return response()->json([],404);
        }

        $count = DB::table('msg_tbl')
            ->where(function ($query) use ($user, $recipient) {
                $query->where('msg_to', $user->id)
                    ->Where('msg_from', $recipient->id)
                    ->where('is_deleted_from_reciever', 0);
            })
            ->orWhere((function ($query) use ($user, $recipient) {
                $query->where('msg_to', $recipient->id)
                    ->Where('msg_from', $user->id)
                    ->where('is_deleted_from_sender', 0);
            }))
            ->count();

            if($count / $page < $limit){
                $limit = $count % $limit;
            }

        $limitedCount = DB::table('msg_tbl')
            ->where(function ($query) use ($user, $recipient) {
                $query->where('msg_to', $user->id)
                    ->Where('msg_from', $recipient->id)
                    ->where('is_deleted_from_reciever', 0);
            })
            ->orWhere((function ($query) use ($user, $recipient) {
                $query->where('msg_to', $recipient->id)
                    ->Where('msg_from', $user->id)
                    ->where('is_deleted_from_sender', 0);
            }))
            // ->skip($count - ($limit * $page))
            ->take($count - ($limit * $page))
            ->get();

        $messagesQ = DB::table('msg_tbl')
            ->where(function ($query) use ($user, $recipient) {
                $query->where('msg_to', $user->id)
                    ->Where('msg_from', $recipient->id)
                    ->where('is_deleted_from_reciever', 0);
            })
            ->orWhere((function ($query) use ($user, $recipient) {
                $query->where('msg_to', $recipient->id)
                    ->Where('msg_from', $user->id)
                    ->where('is_deleted_from_sender', 0);
            }))
            ->skip($count - ($initLimit * $page))
            ->take($limit)
            ->get();


        $messages = $messagesQ->map(function ($msg) {
            // return MessageModel::find($msg->id)->image;
            $contents = MessageModel::find($msg->id)->contents;
            $msg->contents = $contents->map(function ($content) {
                if($content->format == 'image'){
                    $a['content'] = asset('storage/pics/'.$content->content);    
                }else{
                    $a['content'] = $content->content;
                }
                
                $a['format'] = $content->format;
                return $a;
            });
            return $msg;
        });




        $perPageCount = count($messages);

        $any = DB::table('msg_tbl')
            ->where('msg_to', $user->id)
            ->Where('msg_from', $recipient->id)
            ->where('is_deleted_from_reciever', 0)
            ->where('seen', 0)
            ->update(['seen' => 1]);


        return response()->json(['messages' => $messages,'recipientName'=>$recipientName,'count' => $count,'lc'=>$limitedCount]);
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

        $user = Auth::user();
        // $validator = validator::make($request->all(), [
        //     'msg' => 'required'
        // ]);

        $newMsg = new MessageModel;

        $newMsg->msg_from = $user->id;
        $newMsg->msg_to = $request->msg_to;
        $newMsg->save();

        collect($request->content)->map(function ($item) use ($request, $newMsg) {

            if ($request->format == 'image') {
                $item->store('pics');

                $newMsg->contents()->create([
                    'content' => $item->hashName(),
                    'format' => $request->format,
                ]);
            } elseif ($request->format == 'text') {
                $newMsg->contents()->create([
                    'content' => $item,
                    'format' => $request->format,
                ]);
            }
        });


        $newMsg->save();

        $message = $newMsg::with('contents')->where('id', $newMsg->id)->get();


        broadcast(new ChatEvent($message, $request->msg_to))->toOthers();

        event(new NewEvent($user->id, $request->msg_to));

        return response()->json(['message' => $message]);
    }



    public function delete(Request $request)
    {

        $msg = MessageModel::find($request->id);

        if (Auth::user()->id == $msg->sender['id']) {

            $this->deleteMessageFrom($msg,'is_deleted_from_reciever','is_deleted_from_sender');

        } elseif (Auth::user()->id == $msg->receiver['id']) {

            $this->deleteMessageFrom($msg,'is_deleted_from_sender','is_deleted_from_reciever');

        }

        return response()->json(['data' => 'message deleted successfully'], 200);
    }


    public function deleteMessageFrom($msg,$property1,$property2)
    {
        if ($msg->{$property1} == 1) {

            $msg->contents->map(function ($item) {
                if ($item->format == 'image') {
                    Storage::delete('/pics/' . $item->content);
                }
            });

            DB::table('msg_content_tbl')
                ->where('msg_id', $msg->id)
                ->delete();

            $msg->delete();
        } else {
            $msg->{$property2} = 1;
            $msg->save();
        }
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


    public function checkRid($rid)
    {
        $user = User::find($rid);
        if($user){
            return response()->json(['found' => true],200);
        }else{
            return response()->json(['found' => false],404);
        }
        
    }
}
