<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('chat.{firstId}.{secondId}', function ($user, $firstId,$secondId) {
        if($firstId == $user->id || $secondId == $user->id){
            return ['id'=>$user->id,'name'=>$user->name];
       }
});

Broadcast::channel('MyChannel{userID}', function ($user,$userId) {
       return $user->id == $userId;
});

Broadcast::channel('chat', function ($user) {
        if(Auth::check()){
            return ['id'=>$user->id,'name'=>$user->name];
       }
});
