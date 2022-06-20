import React from 'react'
import SignUp from './components/signup/signup.component'
import Translator from './components/translator/translator.component'
import './translations/i18n'
const App=()=>{
  return(
    <div>
      <SignUp/>
      <Translator/>
      </div>
  )
}
export default App