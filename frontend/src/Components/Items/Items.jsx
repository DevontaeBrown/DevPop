import React from 'react'
import './Items.css'
import { Link } from 'react-router-dom'
const Items = (props) => {
  return (
    <div className='item'>
        {/* by setting our image on click to window scroll to we pass it x and y coordinates and the window will go to those coordinates upon clicking*/}
        <Link to={`/product/${props.id}`}><img onClick={window.scrollTo(0,0)}src={props.image} alt=""/></Link>
        <p>{props.name}</p>
        <div className="item-prices">
            <div className="item-price-new">
                ${props.new_price}
            </div>
            <div className="item-price-old">
                ${props.old_price}
            </div>
        </div>
        </div>
  )
}

export default Items