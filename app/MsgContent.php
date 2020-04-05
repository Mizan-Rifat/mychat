<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MsgContent extends Model
{
    protected $table = 'msg_content_tbl';

    protected $guarded= [];
    public $timestamps = false;

    public function message(){
        return $this->belongsTo('App\MessageModel','id','msg_id');
    }
}
