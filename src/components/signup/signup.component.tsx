import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import Input from '../input/input.component'

const SignUp=()=>{
    const [disabled,setDisabled]=useState(true)
    const [loading,setLoading]=useState(false)
    const[errors,setErrors]=useState({
      username:'',
      email:'',
      password:'',
      repassword:''
    })
    const [successRequestStatus,setSuccessRequestStatus]=useState(false)
    const [signUpData,setSignUpData]=useState<any>({
        username:'',
        email:'',
        password:'',
        repassword:''
    })
    const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target
        setSignUpData((signUpData:any)=>({...signUpData,[name]:value}))
    }
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{ 
        try{
            e.preventDefault()
            const {username,email,password}=signUpData
            setLoading(true)
            await axios.post('/api/1.0/users',{username,email,password})   
            setSuccessRequestStatus(true)
            setLoading(false)
        }
        catch(ex:any){
           //here will handle the error
           setLoading(false)
           setErrors(errors=>({...errors,...ex.response.data.validationErrors}))
        }
    }

    useEffect(()=>{
      setErrors({
        username:'',
        email:'',
        password:'',
        repassword:''
    })
      setDisabled(signUpData['password']&&signUpData['password']===signUpData['repassword']?false:true)
    },[signUpData,signUpData])
  
    return(
        <div className='container'>
          {
            !successRequestStatus?(
                <form className='col-lg-6 col-md-8 offset-lg-3  offset-md-2 card mt-5' data-testid='form-container' onSubmit={handleSubmit}>
                <div className='card-header'>
                 <h1 className='text-center'>Heading For Sign Up</h1>
                 </div>
                <div className='card-body'>
                  <Input 
                    label='User Name'
                    type='text' 
                    value={signUpData['username']} 
                    name='username' 
                    onChange={handleInputChange}
                    hasError={!!errors['username']}
                    errorMsg={errors['username']}
                    />
                
                 <Input 
                    label='Email'
                    type='email' 
                    value={signUpData['email']} 
                    name='email' 
                    onChange={handleInputChange}
                    hasError={!!errors['email']}
                    errorMsg={errors['email']}
                    />

                  <Input 
                    label='Password'
                    type='password' 
                    value={signUpData['password']} 
                    name='password' 
                    onChange={handleInputChange}
                    hasError={!!errors['password']}
                    errorMsg={errors['password']}
                    />

                  <Input 
                    label='Retype Password'
                    type='password' 
                    value={signUpData['repassword']} 
                    name='repassword' 
                    onChange={handleInputChange}
                    hasError={!!errors['repassword']}
                    errorMsg={errors['repassword']}
                    />

                <div  className='mb-3'>
                  <button type='submit' name='submit' disabled={loading?true:disabled} className='btn btn-primary'>
                   {loading&&<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} 
                      Submit
                  </button>
                </div>
                </div>
             
              </form>
            ) :(        
                <div className="alert alert-success mt-5" role="alert">
                     Activation Link Will send to your following mail! 
                </div>
            )       
          }  
        </div>
     
        
    )

} 
export default SignUp