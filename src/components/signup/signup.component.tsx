import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../input/input.component'
import '../../translations/i18n'
import i18n from '../../translations/i18n'
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
            await axios.post('/api/1.0/users',{username,email,password},{headers:{'Accept-Langauge':i18n.language}})   
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
    const { t } = useTranslation();
    console.log('current lanfuage',i18n.language)
    return(
        <div className='container'>
          {
            !successRequestStatus?(
                <form role='form' className='col-lg-6 col-md-8 offset-lg-3  offset-md-2 card mt-5' data-testid='form-container' onSubmit={handleSubmit}>
                <div className='card-header'>
                 <h1 className='text-center'>{t('headingTitle')}</h1>
                 </div>
                <div className='card-body'>
                  <Input 
                    label={t("userName")}
                    type='text' 
                    value={signUpData['username']} 
                    name='username' 
                    onChange={handleInputChange}
                    hasError={!!errors['username']}
                    errorMsg={errors['username']}
                    />
                
                 <Input 
                    label={t('email')}
                    type='email' 
                    value={signUpData['email']} 
                    name='email' 
                    onChange={handleInputChange}
                    hasError={!!errors['email']}
                    errorMsg={errors['email']}
                    />

                  <Input 
                    label={t('password')}
                    type='password' 
                    value={signUpData['password']} 
                    name='password' 
                    onChange={handleInputChange}
                    hasError={!!errors['password']}
                    errorMsg={errors['password']}
                    />

                  <Input 
                    label={t('retypePassword')}
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
                      {t('submit')}
                  </button>
                </div>
                </div>
             
              </form>
            ) :(        
                <div className="alert alert-success mt-5" role="alert">
                     {t('activationLinkMsg')}
                </div>
            )       
          }  
        </div>
     
        
    )

} 
export default   SignUp