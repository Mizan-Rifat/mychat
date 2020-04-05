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

    protected $hidden = ['is_deleted_from_sender','is_deleted_from_reciever','updated_at'];

    public function sender(){
        return $this->hasOne('App\User','id','msg_from');
    }

    public function receiver(){
        return $this->hasOne('App\User','id','msg_to');
    }
    public function content(){
        return $this->hasMany('App\MsgContent','msg_id','id');
    }
}
