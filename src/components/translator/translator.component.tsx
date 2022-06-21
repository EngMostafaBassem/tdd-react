import React from 'react'
import {ReactComponent as EnglandFlagIcon } from '../../assets/icons/england-svgrepo-com.svg'
import {ReactComponent as GermanFlagIcon } from '../../assets/icons/germany-svgrepo-com.svg'
import i18n from '../../translations/i18n';
const Translator=()=>{
    const styleIcon={
        cursor:'pointer',
        margin:'0 1rem'
    }
    const handleLangChange=(lang:string)=>{
        i18n.changeLanguage(lang)
    }
    return(
        <div className='container'>
            <div className='d-flex justify-content-center mt-3 '>
               <div>
                   <EnglandFlagIcon data-testid='en-flag' style={styleIcon}  onClick={()=>handleLangChange('en')}/>
                   <GermanFlagIcon  data-testid='de-flag' style={styleIcon}  onClick={()=>handleLangChange('de')}/>
               </div>
              
            </div>
          
        </div>
    )

}
export default Translator