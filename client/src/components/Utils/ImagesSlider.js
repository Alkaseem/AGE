import React from 'react'
import { Carousel } from 'antd'

function ImagesSlider(props) {
    return (
        <div>
            <Carousel autoplay>
                {props.img.map((img, i) => (
                    <div key={i}>
                        <img style={{ width: "100%", height: "150px" }} src={`http://localhost:9000/${img}`} alt="productImage" />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default ImagesSlider