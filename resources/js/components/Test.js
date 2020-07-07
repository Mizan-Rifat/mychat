import React from 'react';
import {Button} from '@material-ui/core'
export default function Test() {
  const sound = new Audio('/uploads/pics/pri.mp3')
  return (
    <div>
      <Button onClick={()=>sound.play()}>Click</Button>
    </div>
  )
}
