import React from 'react'
import { Spinner } from "react-bootstrap";


function Loader() {
  return (
    
    <Spinner
        animation='grow'
        style={{
            height: '200px',
            width: '200px',
            margin: 'auto',
            display: 'block'
        }}
        >

    </Spinner>
    
  )
}

export default Loader