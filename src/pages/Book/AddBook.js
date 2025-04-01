import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";
import axios from "axios";

const AddBook = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    image: null,
    publishDate: "", // Thêm trường ngày xuất bản vào state
  });
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("publishDate", formData.publishDate); // Thêm ngày xuất bản vào FormData

    try {
      const response = await axios.post(
        "http://localhost:8086/api/book/create",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Sách đã được thêm thành công!");
      history.push("/book");
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error);
      alert("Có lỗi xảy ra khi thêm sách. Vui lòng thử lại!");
    }
  };

  return (
    <Container>
      <h3 className="mt-3">Add New Book</h3>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
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
        <FormGroup>
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
        <FormGroup>
          <Label for="image">Book Image</Label>
          <Input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
            accept="image/*"
          />
        </FormGroup>
        <FormGroup>
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
        <Button color="primary" type="submit">
          Add Book
        </Button>
      </Form>
    </Container>
  );
};

export default AddBook;
