import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from "antd"
import FileUpload from '../../Utils/FileUpload';
import { PRODUCT_SERVER } from '../../Config';
import Axios from 'axios'

const { Title } = Typography;
const { TextArea } = Input;

export default function UploadProduct(props) {
  
    const [ProductName, setProductName] = useState("");
    const [Descriptions, setDescriptions] = useState("");
    const [Price, setPrice] = useState(0);
    const [Delivery, setDelivery] = useState("")

    const [Images, setImage] = useState([])

    const onProductChange = (e) => {
        e.preventDefault();
        setProductName(e.currentTarget.value)
    }

    const onDescriptions = (e) => {
        e.preventDefault();
        setDescriptions(e.currentTarget.value)
    }

    const onPrice = (e) => {
        e.preventDefault();
        setPrice(e.currentTarget.value)
    }

    const updateImage = (newImage) => {
        setImage(newImage);
    }

    const handleDelivery = (e) => {
        e.preventDefault();
        setDelivery(e.currentTarget.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!ProductName || !Descriptions || !Price || !Images) {
            return alert("Field must not be empty");
        }

        const variables = {
            creator: props.user.userData._id,
            productName: ProductName,
            description: Descriptions,
            images: Images,
            price: Price,
            delivery: Delivery
        }

        Axios.post(`${PRODUCT_SERVER}/addProduct`, variables)
            .then(res => {
                console.log("Data" + res.data);
                if(res.data.success) {
                    alert("Uploaded successfuly");
                    props.history.push('/');
                } else {
                    alert("Failed to upload the product")
                }
            })
    }

        return (
            <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <Title level={2}>Upload Product Image</Title>
                </div>

                <Form onSubmit={handleSubmit}>
                    {/* DropXone */}
                <FileUpload refreshFunction={updateImage}/>

                    <br />
                    <br />
                    <label>ProductName</label>
                    <Input 
                        onChange={onProductChange}
                        value={ProductName}
                    />
                     <br />
                     <br />
                     <label>Discriptions</label>
                    <TextArea 
                        onChange={onDescriptions}
                        value={Descriptions}
                    />
                     <br />
                     <br />
                     <label>Price($)</label>
                    <Input 
                        onChange={onPrice}
                        value={Price}
                        type="number"
                    />
                     <br />
                     <br />
                     <label>Delivery</label>
                     <Input 
                        onChange={handleDelivery}
                        value={Delivery}
                    />
                     <br />
                     <br />
                    <Button onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form>

            </div>
        )
}
