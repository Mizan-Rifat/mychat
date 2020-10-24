<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
  
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'msg_to' => $this->msg_to,
            'msg_from' => $this->msg_from,
            'contents'=> ContentResource::collection($this->contents),
            'created_at' => $this->created_at,
            'seen' => $this->seen,
        ];
    }
}
