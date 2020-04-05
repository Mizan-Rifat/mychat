import React, { useState } from 'react'
import axios from "axios";

export default function Test2() {

    const [state, setState] = useState([])
    const [preview, setPreviews] = useState([])

    const onChangeHandler = e => {
        console.log(e.target.files)
        let array = e.target.files;
        let fileArray = [];
        for (let i = 0; i < array.length; i++) {
            fileArray.push(array[i]);
        }

        console.log(fileArray)

        setState(fileArray);


    };

    const onSubmitHandler = e => {
        e.preventDefault();



        let formData = new FormData();

        for (let i = 0; i < state.length; i++) {
            formData.append('pics[]', state[i]);
        }

        axios
            .post("/api/sendmessage", formData)
            .then(res => {
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleRemove=(index)=>{
        setState(state.filter((item,ind)=>ind != index))
    }
    return (
        <div>
            <form className="form-product" encType="multipart/form-data" onSubmit={onSubmitHandler} >

                <div className="form-row">
                    <label htmlFor="customFile">Product Images</label>

                    <div className="custom-file col-md-12">
                        <input type="file" multiple className="custom-file-input" id="customFile" name="files" onChange={onChangeHandler} />
                        <label className="custom-file-label" htmlFor="customFile">
                            Choose Main Photo
  </label>
                    </div>
                </div>

                <div className="col-md-12 text-center">
                    <button type="submit" className="btn btn-primary new-product-button">
                        Add
</button>
                </div>

            </form>

            <div className="">

                {
                    state.map((item,index) => (
                        <>
                            <img src={URL.createObjectURL(item)} height='100px' />
                            <button onClick={()=>handleRemove(index)}>remove</button>
                        </>
                    ))
                }


            </div>

        </div>
    )
}





