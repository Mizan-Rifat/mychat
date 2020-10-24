<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ContentResource extends JsonResource
{
   
    public function toArray($request)
    {
        return [
            'content' => $this->format == 'image' ? asset('uploads/pics/'.$this->content) : $this->content,
            'format' => $this->format,
        ];
    }
}
