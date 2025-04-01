import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Button, FormGroup, Label, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

const EditBook = () => {
  const { id } = useParams();  // Lấy id từ URL
  const history = useHistory();  // Để điều hướng sau khi lưu

  const [book, setBook] = useState({
    title: "",
    author: "",
    imageUrl: "",
    published_at: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);  // Thêm state để lưu file đã chọn
  const [previewImage, setPreviewImage] = useState(null);  // Thêm state để xem trước ảnh

  // Fetch dữ liệu sách từ API khi component được mount
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authUser"))?.token;
        if (!token) {
          alert("No token found, please login!");
          return;
        }

        const response = await axios.get(`http://localhost:8086/api/book/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setBook({
            title: response.data.book.title,
            author: response.data.book.author,
            imageUrl: response.data.book.imageUrl,
            published_at: new Date(response.data.book.published_at).toLocaleDateString("vi-VN"),
          });
          setPreviewImage(response.data.book.imageUrl); // Hiển thị hình ảnh hiện tại
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  // Xử lý thay đổi file hình ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Cập nhật hình ảnh xem trước
    }
  };

  // Xử lý lưu thay đổi
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("authUser"))?.token;
      if (!token) {
        alert("No token found, please login!");
        return;
      }

      const formData = new FormData();
      formData.append("title", book.title);
      formData.append("author", book.author);
      formData.append("published_at", new Date(book.published_at).toLocaleDateString("vi-VN")); // Sửa chính tả ở đây

      if (selectedFile) {
        formData.append("image", selectedFile); // Thêm file hình ảnh vào formData
      }

      await axios.patch(`http://localhost:8086/api/book/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("Book updated successfully!");
      history.push("/book",2000);  // Điều hướng về danh sách sách
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>Edit Book | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <h4 className="card-title">Edit Book</h4>
              <AvForm onSubmit={handleSave}>
                {/* Title */}
                <AvField
                  className="mb-3"
                  name="title"
                  label="Title"
                  type="text"
                  value={book.title}
                  onChange={handleChange}
                  validate={{
                    required: { value: true, errorMessage: "Title is required" },
                    minLength: { value: 3, errorMessage: "Title must be at least 3 characters" },
                  }}
                />

                {/* Author */}
                <AvField
                  className="mb-3"
                  name="author"
                  label="Author"
                  type="text"
                  value={book.author}
                  onChange={handleChange}
                  validate={{
                    required: { value: true, errorMessage: "Author is required" },
                    minLength: { value: 3, errorMessage: "Author must be at least 3 characters" },
                  }}
                />

                {/* Image Upload */}
                <FormGroup className="mb-3">
                  <Label for="image">Upload Image</Label>
                  <Input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {previewImage && (
                    <div className="image-preview mt-3">
                      <img src={previewImage} alt="Preview" width="200" />
                    </div>
                  )}
                </FormGroup>

                {/* Published Date */}
                <AvField
                  className="mb-3"
                  name="published_at"
                  label="Published Date"
                  type="date"
                  value={book.published_at}
                  onChange={handleChange}
                  validate={{
                    required: { value: true, errorMessage: "Published Date is required" },
                  }}
                />

                <FormGroup className="mb-0">
                  <div>
                    <Button type="submit" color="primary" className="ms-1">
                      Save
                    </Button>{" "}
                    <Button type="reset" color="secondary" onClick={() => history.push("/book")}>
                      Cancel
                    </Button>
                  </div>
                </FormGroup>
              </AvForm>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default EditBook;
