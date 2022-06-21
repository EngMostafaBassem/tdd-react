import {screen,render,waitFor, act, waitForElementToBeRemoved} from '@testing-library/react'
import SignUp from './signup.component'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {TRANSLATIONS_DE} from '../../translations/de/translations'
import {TRANSLATIONS_EN} from '../../translations/en/translations'
import i18n from '../../translations/i18n';
import Translator from '../translator/translator.component'



let expectedBody:any={}
let countRequest=0
let acceptlangHeader=''

const server = setupServer(
   // Describe the requests to mock.
   rest.post('/api/1.0/users', (req, res, ctx) => {
   expectedBody=req.body;
   acceptlangHeader=req.headers.get('Accept-Langauge') as string
   countRequest++
   return res(ctx.status(200))
   }),
 )


 beforeAll(()=>server.listen())
 afterAll(()=>server.close())
 beforeEach(()=>{
    countRequest=0;   
    i18n.changeLanguage('en')   
 })
 afterEach(()=>{
    server.resetHandlers()
 })

describe('sign up page',()=>{
   describe('layout',()=>{
      it('has header',()=>{
         render(<SignUp/>)
         waitFor(()=>{
            const header=screen.queryByRole('heading',{name:'Heading For Sign Up'})
            expect(header).toBeInTheDocument()    
         })
         
      })

      it('has input with label text called Username',()=>{
         render(<SignUp/>)
         const input=screen.getByLabelText('User Name')
         expect(input).toBeInTheDocument()
      })
      it('has input with label text called Email',()=>{
         render(<SignUp/>)
         const input=screen.getByLabelText('Email')
         expect(input).toBeInTheDocument()
      })
      it('has input with label text called Password',()=>{
         render(<SignUp/>)
         const input=screen.getByLabelText('Password')
         expect(input).toBeInTheDocument()
      })
      it('has input with label text called Repassword',()=>{
         render(<SignUp/>)
         const input=screen.getByLabelText('Retype Password')
         expect(input).toBeInTheDocument()
      })
      it('has email input with type email',()=>{
         render(<SignUp/>)
         const input=screen.getByLabelText('Email') as HTMLInputElement
         expect(input.type).toBe('email')
      })
      it('has password input with type password',()=>{
         render(<SignUp/>)
         const input=screen.getByLabelText('Password') as HTMLInputElement
         expect(input.type).toBe('password')
      })

      it('has Repassword input with type password',()=>{
         render(<SignUp/>)
         const input=screen.getByLabelText('Retype Password') as HTMLInputElement
         expect(input.type).toBe('password')
      })
      it('has submit button',()=>{
         render(<SignUp/>)
         const button=screen.queryByRole('button',{name:'Submit'})
         expect(button).toBeInTheDocument()
      })

      it('has submit button initially disabled',()=>{
         render(<SignUp/>)
         const button=screen.queryByRole('button',{name:'Submit'})
         expect(button).toBeDisabled()
      })
    
   })

   describe('interaction',()=>{
      let button:any=null
    
      

      const setup=async()=>{
         render(<SignUp/>)
         const userNameInput=screen.getByLabelText('User Name') as HTMLInputElement
         const emailInput=screen.getByLabelText('Email') as HTMLInputElement
         const passwordInput=screen.getByLabelText('Password') as HTMLInputElement
         const rePasswordInput=screen.getByLabelText('Retype Password') as HTMLInputElement
         button=screen.queryByRole('button',{name:'Submit'}) as HTMLElement
         userEvent.type(userNameInput,'mostafa')
         userEvent.type(emailInput,'mostafa@hotmail.com')
         userEvent.type(passwordInput,'passw8rd')
         userEvent.type(rePasswordInput,'passw8rd')     
      }
     
     

      it('has submit button enabled when the user type password and repassowrd',()=>{
         render(<SignUp/>)
         const passwordInput=screen.getByLabelText('Password') as HTMLInputElement
         const rePasswordInput=screen.getByLabelText('Retype Password') as HTMLInputElement
         const button=screen.queryByRole('button',{name:'Submit'})
         userEvent.type(passwordInput,'passw8rd')
         userEvent.type(rePasswordInput,'passw8rd')
         expect(button).toBeEnabled()

      })
      it('send username,email,password to the server after submitting',async()=>{
         setup()
         userEvent.click(button)
         await screen.findByRole("alert") 
         expect(expectedBody).toEqual({
            username:'mostafa',
            email:'mostafa@hotmail.com',
            password:'passw8rd'
         })

      })
      it('disable button when there is ongoing api call',async()=>{
         setup()
         userEvent.click(button)
         userEvent.click(button)
         await waitFor(()=>{
            expect(countRequest).toBe(1)
         })      
      })

      it('display spinner after clicking submit',async()=>{
         setup()
         userEvent.click(button)
         await waitFor(()=>{
            expect(screen.queryByRole('status',{hidden:true})).toBeInTheDocument()
         })
      })

      it('display account activation notification after successful sign up request ',async()=>{
         setup()
         userEvent.click(button)
         const alertMsg='Activation Link Will send to your following mail!'
         const alertControl=await screen.findByRole("alert") 
         expect(alertControl.textContent).toBe(alertMsg)
      })
      
      it('hide signup after successful sign up',async ()=>{
         setup()
         expect(screen.queryByTestId('form-container')).toBeInTheDocument()
         userEvent.click(button)
         await screen.findByRole("alert") 
         expect(screen.queryByTestId('form-container')).not.toBeInTheDocument()
      })
      
      it('clear validations error after username field is updated',async()=>{
         server.use(rest.post('/api/1.0/users',(req,res,ctx)=>{
            return res(ctx.status(400),ctx.json({
               validationErrors:{
                  username:'Username cannot be null'
               }
            }))
         }))
         setup()
         userEvent.click(button)
         const errorSpan=await screen.findByText('Username cannot be null')
         expect(errorSpan).toBeInTheDocument()
         const inputControl=screen.queryByLabelText('User Name') as HTMLInputElement
         userEvent.type(inputControl,'updated')
         expect(errorSpan).not.toBeInTheDocument()
      })

      it.each`
         field|message
         ${'username'}|${'username cannot be null'}
         ${'email'}|${'E-mail cannot be null'}
         ${'password'}|${'Password must be at least 6 characters'}
        `('display $message for $field',async({field,message})=>{
         server.use(
            rest.post('/api/1.0/users',(req,res,ctx)=>{
               return res(ctx.status(400),ctx.json({
                  validationErrors:{
                     [field]:message
                  }
               }))
            })
         )
         setup();
         userEvent.click(button)
         const errorSpan=await screen.findByText(message)
         expect(errorSpan).toBeInTheDocument()
      })

   })

   describe('translations',()=>{

      it('intitally display english language when loading the form',()=>{
         render(<SignUp/>)     
           expect(screen.queryByRole('heading',{name:TRANSLATIONS_EN.headingTitle})).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_EN.userName)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_EN.email)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_EN.password)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_EN.retypePassword)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_EN.submit)).toBeInTheDocument()   
      })

      it('display german language when pressing on german flag',()=>{
         const MockedSignUp=()=>(
            <>
              <SignUp/>
              <Translator/>
            </>
           )
           render(<MockedSignUp/>)     
           const flagButton=screen.queryByTestId('de-flag') as HTMLElement
           userEvent.click(flagButton)
           expect(screen.queryByRole('heading',{name:TRANSLATIONS_DE.headingTitle})).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_DE.userName)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_DE.email)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_DE.password)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_DE.retypePassword)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_DE.submit)).toBeInTheDocument()   
      })

      
      it('display english language when pressing on england flag',()=>{
         const MockedSignUp=()=>(
            <>
              <SignUp/>
              <Translator/>
            </>
           )
           render(<MockedSignUp/>)     
           const flagButton=screen.queryByTestId('en-flag') as HTMLElement
           userEvent.click(flagButton)
           expect(screen.queryByRole('heading',{name:TRANSLATIONS_EN.headingTitle})).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_EN.userName)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_EN.email)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_EN.password)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_EN.retypePassword)).toBeInTheDocument()
           expect(screen.getByText(TRANSLATIONS_EN.submit)).toBeInTheDocument()   
      })

      it('send accept-language to be en when submiting the form',async()=>{
         render(<SignUp/>)  
         const userNameInput=screen.getByLabelText('User Name') as HTMLInputElement
         const emailInput=screen.getByLabelText('Email') as HTMLInputElement
         const passwordInput=screen.getByLabelText('Password') as HTMLInputElement
         const rePasswordInput=screen.getByLabelText('Retype Password') as HTMLInputElement
         const button=screen.queryByRole('button',{name:'Submit'}) as HTMLElement
         userEvent.type(userNameInput,'mostafa')
         userEvent.type(emailInput,'mostafa@hotmail.com')
         userEvent.type(passwordInput,'passw8rd')
         userEvent.type(rePasswordInput,'passw8rd') 
         userEvent.click(button) 
         await waitForElementToBeRemoved(screen.getByRole('form')) 
         expect(acceptlangHeader).toBe('en')  

      })

      it('send accept-language to be de when submiting the form',async()=>{
         const MockedSignUp=()=>(
            <>
              <SignUp/>
              <Translator/>
            </>
           )
         render(<MockedSignUp/>)     
         const flagButton=screen.queryByTestId('de-flag') as HTMLElement
         userEvent.click(flagButton)
         const userNameInput=screen.getByLabelText(TRANSLATIONS_DE.userName) as HTMLInputElement
         const emailInput=screen.getByLabelText(TRANSLATIONS_DE.email) as HTMLInputElement
         const passwordInput=screen.getByLabelText(TRANSLATIONS_DE.password) as HTMLInputElement
         const rePasswordInput=screen.getByLabelText(TRANSLATIONS_DE.retypePassword) as HTMLInputElement
         const button=screen.queryByRole('button',{name:TRANSLATIONS_DE.submit}) as HTMLElement
         userEvent.type(userNameInput,'mostafa')
         userEvent.type(emailInput,'mostafa@hotmail.com')
         userEvent.type(passwordInput,'passw8rd')
         userEvent.type(rePasswordInput,'passw8rd') 
         userEvent.click(button) 
         await waitForElementToBeRemoved(screen.getByRole('form')) 
         expect(acceptlangHeader).toBe('de')  

      })


   })
 
})
