import React, { useState, useEffect } from 'react';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
// import { Emoji } from 'emoji-mart'
import ImageUploader from 'react-images-upload';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import Emoji from "react-emoji-render";

export default function Test() {

  const [emoji, setemoji] = useState({});
  const [loading, setLoading] = useState(true);
  const [picker, setPicker] = useState(false);
  const [inputText, setInputText] = useState('');
  const [pictures, setPictures] = useState([]);

  const addEmoji = (emoji) => {
    console.log(emoji)
    setemoji(emoji)
    setLoading(false)
  }

  useEffect(() => {
    if (!loading)
      setInputText(`${inputText} ${emoji.native}`)
  }, [emoji])


  const onDrop = (pictureFiles, pictureDataURLs)=>{
    console.log(pictureDataURLs)
    setPictures(pictureFiles)
  }

  const options = {
    baseUrl: "http://127.0.0.1:8000/storage/32.png",
    ext: "png",
  };

  return (


    <div>

      {
        loading ? '' : <Emoji text={`This sentence includes ${emoji.colons} a variety of emoji types `} options={options} />
      }
      {/* {
        loading ? '' : <Emoji emoji={`asmdakdj ${emoji.colons}`} set='facebook' size={25} backgroundImageFn={() => `/storage/32.png`} />
      } */}


      {/* <p >{state}</p> */}

      <FormControl >
        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
          id="standard-adornment-password"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setPicker(!picker)}
              >
                <InsertEmoticonIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      {
        picker ? <Picker set='facebook' onSelect={addEmoji} showPreview={false} backgroundImageFn={() => `/storage/32.png`} showSkinTones={false} exclude={["flags"]} />
          : ''
      }


      <ImageUploader
        withIcon={true}
        buttonText='Choose images'
        onChange={onDrop}
        imgExtension={['.jpg', '.gif', '.png', '.gif']}
        maxFileSize={5242880}
        withPreview={true}
      />





    </div>
  )
}
