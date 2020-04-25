import React, { useState } from 'react';
import DropZone from 'react-dropzone';
import { Icon } from 'antd';
import Axios from 'axios';
import { PRODUCT_SERVER } from '../Config';

export default function FileUpload(props) {

    const [Images, setImages] = useState([])

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append('file', files[0]);

        Axios.post(`${PRODUCT_SERVER}/uploadImg`, formData, config)
        .then(res => {
            if(res.data.success) {
                setImages([...Images, res.data.images]);
                props.refreshFunction([...Images, res.data.images]);
            } else {
                alert("Fail to save to server");
            }
        });
    }

    const onDelete = (image) => {
        const currentIndex = Images.indexOf(image);

       let newImage = [...Images];
        newImage.splice(currentIndex, 1);

        setImages(newImage);
        props.refreshFunction(newImage);
    }

    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <DropZone 
                onDrop={onDrop}
                multiple={false}
                maxSize={8000000000}
            >
                {({getRootProps, getInputProps}) => (
                    <div style={{cursor: "pointer", width: "300px", height: "240px", border: "1px solid lightgray",
                     display: "flex", alignItems: "center", justifyContent: "center" }}
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        <Icon type="plus" style={{ fontSize: "3rem" }}/>
                    </div>
                )}
            </DropZone>

            <div style={{ display: "flex", width: "300px", height: "240px", overflowX: "scroll" }}>
                {Images.map((img, i) => (
                    <div key={i} onClick={() => onDelete(img)}>
                      <img style={{ minWidth: "300px", width: "300px", height: "220px" }} src={`http://localhost:9000/${img}`} alt={`productImg-${i}`}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

