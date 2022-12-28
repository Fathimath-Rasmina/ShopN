import React,{useState,useEffect} from 'react'
import {useSearchParams,useNavigate} from 'react-router-dom'
import { Form,Button,Col } from "react-bootstrap"
import {useDispatch,useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartAction'

function PaymentScreen() {
    
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector(state => state.cart)
  const {shippingAddress, paymentMethod} = cart

  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(paymentMethod) //later if there is another method, this string will be empty and user can select this 

  if(!shippingAddress.address){
    navigate('/login/shipping')
  }

  const submitHandler = (e) =>{
    e.preventDefault()
    dispatch(savePaymentMethod(currentPaymentMethod))
    navigate('/placeorder')
  }

  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3/>
        <Form onSubmit={submitHandler}>
          <Form.Group>
                <Form.Label as='legend' className='my-3'>Select Method</Form.Label>
                <Col>
                <Form.Check  //we can add more method like this 
                     type='radio'
                     label='PayPayl or Credit Card'
                     aria-label='radio 1'
                     id='paypal'
                     name='paypal'
                     value='paypal'
                     checked={currentPaymentMethod === "paypal"}   //here checked because by default we need this to be checked 
                     onChange={(e) => setCurrentPaymentMethod(e.target.value)}
                    >   
                    </Form.Check>

                    <Form.Check  //we can add more method like this 
                     type='radio'
                     label='RazorPay'
                     aria-label='radio 2'
                     id='razorpay'
                     name='razorpay'
                     value='razorpay'
                     checked={currentPaymentMethod === 'razorpay'}
                      //here checked because by default we need this to be checked 
                     onChange={(e) => setCurrentPaymentMethod(e.target.value)}
                    >   
                    </Form.Check>


                </Col>
            </Form.Group>
            <Button type='submit' variant='primary' className='my-5'>
                Continue
            </Button>

        </Form>
    </FormContainer>
  )
}

export default PaymentScreen