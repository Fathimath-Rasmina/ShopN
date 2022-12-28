import React,{useState,useEffect} from 'react'
import {useNavigate,useParams, Link } from 'react-router-dom'
import { Row,Col,Button,ListGroup,Image, Card } from "react-bootstrap"
import {useDispatch,useSelector} from 'react-redux'
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalButton } from 'react-paypal-button-v2'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import {ORDER_PAY_RESET} from '../constants/orderConstants'



function OrderScreen() {
    const {id} =useParams()
    const orderId = id
    const dispatch = useDispatch()

    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error,loading} = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const {loading:loadingPay, success:successPay } = orderPay

    const navigate = useNavigate()
    
    if(!loading && !error ){
        order.itemsPrice =  order.orderItems.reduce((acc, item) => acc + item.price * item.qty,0).toFixed(2)
    }

    //AbNSPn3M4z9_XXr-1lAOx7jRq7LBItFEM5NRr7hEOs_eqfTS91-LN_6lCts5BidwCyFeEMV0liJqBr9F   ===> client id

    
    const addPayPalScript = () =>{
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AbNSPn3M4z9_XXr-1lAOx7jRq7LBItFEM5NRr7hEOs_eqfTS91-LN_6lCts5BidwCyFeEMV0liJqBr9F'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }



    useEffect(() => {
        if(!order || successPay || order._id !== Number(orderId)){
            dispatch({type:ORDER_PAY_RESET})
            dispatch(getOrderDetails(orderId))
        }else if(!order.isPaid){
            if(!window.paypal){
                addPayPalScript()
            }else{
                setSdkReady(true)
            }
        }

        
    },[dispatch, order, orderId,successPay])


    const successPaymentHandler = (paymentResult) =>{
        dispatch(payOrder(orderId, paymentResult))
    }

   
  return loading ? (
    <Loader/>
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) :  (
        <div>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name : </strong>{order.user.name}</p>
                            <p><strong>Email : </strong><a href={`mailro:${order.user.email}`}>{order.user.email}</a></p>

                            <p>
                                <strong>Shipping : </strong>
                                {order.shippingAddress.address} , {order.shippingAddress.city}
                                {'   '} 
                                {order.shippingAddress.postalCode},
                                {'   '}
                                {order.shippingAddress.country}
                            </p>

                            {order.isDelivered ? (
                                    <Message variant='success'>Delivered On {order.deliveredAt}</Message>
                                ):(
                                    <Message variant='warning'>Not Delivered</Message>
                                )}

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                                {order.paymentMethod === "paypal" && `PayPal`}
                                {order.paymentMethod === "razorpay4" && `RazorPay`}

                                {order.isPaid ? (
                                    <Message variant='success'>Paid On {order.paidAt}</Message>
                                ):(
                                    <Message variant='warning'>Not Paid</Message>
                                )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Message variant='info'>
                                Order is empty!
                            </Message> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>

                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>

                                                <Col md={4}>
                                                    {item.qty} X ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <center><h2>Order Summary</h2></center>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items: </Col>
                                    <Col>₹{order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping: </Col>
                                    <Col>₹{order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>₹{order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total: </Col>
                                    <Col>₹{order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>


                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader/>}

                                        {!sdkReady ? (
                                            <Loader/>
                                        ): ( 
                                            
                                                    <PayPalButton style={{ layout: "horizontal" }}
                                                    amount={order.totalPrice}
                                                    onSuccess={successPaymentHandler} />
                                            
                                        )}
                                    </ListGroup.Item>
                                )}



                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
  )
}

export default OrderScreen