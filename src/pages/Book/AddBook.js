import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import axios from "axios";
import { adminApis, authAPI } from "helpers/api";

const AddBook = () => {

  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const history = useHistory();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description:"",
    image: null,
    publishDate: "",
  });
  const [loading, setLoading] = useState(false); 

  // Xử lý thay đổi input text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý khi chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setFormData({
        ...formData,
        image: file, // Cập nhật vào formData
      });
    }
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("publishDate", formData.publishDate);
    
    setLoading(true);
    try {
      await authAPI().post(adminApis.createBook, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });     
      history.push("/book",1000);
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error);    
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h3 className="mt-3">Add New Book</h3>
      <Form>
        <FormGroup className="md-3">
          <Label for="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup className="md-3">
          <Label for="author">Author</Label>
          <Input
            type="text"
            name="author"
            id="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup className="md-3">
          <Label for="description">Description</Label>
          <Input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup className="md-3">
          <Label for="image">Book Image</Label>
          <div className="image-upload-container">
            <Input
              type="file"
              name="image"
              id="image"
              onChange={handleFileChange}
              accept="image/*"
              className="image-upload-input"
            />
            <div className="image-preview-container">              
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{width:100, height: 100}}                 
                  
                />             
            </div>
          </div>
        </FormGroup>
        <FormGroup className="md-3">
          <Label for="publishDate">Publish Date</Label>
          <Input
            type="date"
            name="publishDate"
            id="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <span>Loading...</span> // Hiển thị trạng thái loading
          ) : (
            "Add Book"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default AddBook;
