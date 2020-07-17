<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MessageModel extends Model
{


    public $table = 'msg_tbl';
    protected $fillable = ['msg_from', 'msg_to','msg'];
    public $timestamps = false;

    protected $casts = [
        'asd' => 'array'
    ];

    public function scopeSendMessages($query,$user_id,$rid)
    {
        return $query->where('msg_from',$user_id)->where('msg_to',$rid);
    }

    public function scopeReceivedMessages($query,$user_id,$rid)
    {
        return $query->where('msg_to',$user_id)->where('msg_from',$rid);
    }
    public function scopeUnseenMessages($query,$user_id,$rid)
    {
        return $query->where('msg_to', $user_id)
            ->Where('msg_from', $rid)
            ->where('is_deleted_from_reciever', 0)
            ->where('seen', 0);
    }

    protected $hidden = ['is_deleted_from_sender','is_deleted_from_reciever','updated_at'];

    public function sender(){
        return $this->hasOne('App\User','id','msg_from');
    }

    public function receiver(){
        return $this->hasOne('App\User','id','msg_to');
    }
    public function contents(){
        return $this->hasMany('App\MsgContent','msg_id','id');
    }
}
