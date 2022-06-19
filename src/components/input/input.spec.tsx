import {screen,render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import Input from './input.component'

describe('Input Component ',()=>{ 
    const defaultInputProps={
        name:'',
        value:'',
        label:'',
        onChange:(e:React.ChangeEvent<HTMLInputElement>)=>{}
    }
    it('has is-invalid class for input when error is set',()=>{
      
        render(<Input hasError={true}{...defaultInputProps} />)
        const InputControl=screen.queryByRole('input')   
        expect(InputControl?.classList).toContain('is-invalid')
    })
    it('does not have is-invalid class for input when help is not set',()=>{
      
        render(<Input hasError={false}{...defaultInputProps} />)
        const InputControl=screen.queryByRole('input')   
        expect(InputControl?.classList).not.toContain('is-invalid')
    })
})