import React from 'react'
interface InputProps{
    label:string;
    type?:'text'|'password'|'email';
    value:string;
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
    name:string;
    hasError:boolean;
    errorMsg?:string
}
const Input:React.FC<InputProps>=({label,type,value,onChange,name,hasError,errorMsg})=>{
    return(
        <>
         <div className='mb-3'>
            <label htmlFor={name} className='form-label'>{label}</label>
            <input role='input' id={name} type={type} className={hasError?'form-control is-invalid':'form-control'} value={value} name={name} onChange={onChange}/>
            {hasError&&<span data-testid='error-text' className='invalid-feedback'>{errorMsg}</span>}
         </div>
         
        </>
       
    )

}
export default Input