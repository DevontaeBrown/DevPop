import React from 'react'
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext'


const ProductDisplay = (props) => {
  const {product} = props;
  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="img" />
          <img src={product.image} alt="img" />
          <img src={product.image} alt="img" />
          <img src={product.image} alt="img" />
        </div>
          <div className="productdisplay-img">
            
          </div>
      </div>
        <div className="productdisplay-right">

        </div>
    </div>
  )
}

export default ProductDisplay