import axios from 'axios';

export const postAction = (actions,url,formData,dispatch,method='post',headers={}) =>{

    return  new Promise((resolve,reject)=>{
  
     
          if(actions.hasOwnProperty('loading')){
              dispatch(actions.loading)
          }
          
  
          axios.get('/airlock/csrf-cookie')
          .then(response => {
              
              // axios.post(url,formData)
                  axios({
                      method: method,
                      url: url,
                      data:formData,
                      headers:headers
                  })
                  .then(response=>{

                      if(Array.isArray(actions.success)){
                          actions.success.map(item=>{
                              dispatch(item(response.data.data))
                          })
                      }else{
                          dispatch(actions.success(response.data.data))    
                      }
  
                      resolve(response.data.message)
                  })
                  .catch(error=>{
                      console.log({error})
                      const err = {
                          errors:error.response.data.hasOwnProperty('errors') ? error.response.data.errors : {},
                          message:error.response.data.message,
                          errorCode:error.response.status
                      }
                      console.log({err})
                      dispatch(actions.error)
                      reject(err);
                      
                  })
          })
      })
  };
  
  export const getAction = (actions,url,dispatch) =>(
  
      new Promise((resolve,reject)=>{
  
          if(actions.hasOwnProperty('loading')){
              dispatch(actions.loading)
          }
          
  
            axios.get(url,
                { 
                    withCredentials: true 
                })
              .then(response=>{

                console.log({response})
                  if(actions.hasOwnProperty('success')){
                      if(Array.isArray(actions.success)){
                          actions.success.map(item=>{
                              dispatch(item(response.data.data))
                          })
                      }else{
                          if(response.data.hasOwnProperty('meta')){
                            dispatch(actions.success(response.data))    
                          }else{
                            dispatch(actions.success(response.data.data))
                          }
                              
                      }
                  }
                  
                  resolve(response.data.data)
              }).catch(error=>{
                  const err = {
                      errors:error.response.data.hasOwnProperty('errors') ? error.response.data.errors : {},
                      message:error.response.data.message,
                      errorCode:error.response.status
                  }

                  console.log({err})
  
                  dispatch(actions.error)
                  reject(err);
                  
              })
      })
  );
  