import React,{useState,useEffect} from 'react'
import {useSearchParams,useParams,useNavigate, Navigate} from 'react-router-dom'
import { Form,Button } from "react-bootstrap"
import {useDispatch,useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'


function Shippingscreen() {

  const navigate = useNavigate()
  const searchParams= useSearchParams()
  const [address,setAddress] =useState()
  const [city,setCity] =useState()
  const [postalCode,setPostalCode] =useState()
  const [country,setCountry] =useState()

  const submitHandler = (e) => {
    e.preventDefault()
    console.log('submitted')
  }

  return (
    <FormContainer>
      <center><h1>Shipping</h1></center>
      <Form onSubmit={submitHandler}>

      <Form.Group controlId='address'>
          <Form.Label className='my-3'>Address</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter Address'
            value={address ? address: ''}
            onChange={(e)=>setAddress(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='city'>
          <Form.Label className='my-3'>City</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter City'
            value={city ? city: ''}
            onChange={(e)=>setCity(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='postalCode'>
          <Form.Label className='my-3'>Postal Code</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter Postal Code'
            value={postalCode ? postalCode: ''}
            onChange={(e)=>setPostalCode(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='country'>
          <Form.Label className='my-3'>Country</Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter Country'
            value={country ? country: ''}
            onChange={(e)=>setCountry(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        <center><Button type='submit' variant='primary' className='my-3'>
          Continue
        </Button></center>

      </Form>
    </FormContainer>
  )
}

export default Shippingscreen