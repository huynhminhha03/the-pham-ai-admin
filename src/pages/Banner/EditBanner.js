import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Button, FormGroup, Label, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

const EditBanner = () => {
  const { id } = useParams();
  const history = useHistory();

  const [banner, setBanner] = useState({
    title: "",
    imageUrl: "",
    created_at: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);  // state lưu file hình ảnh đã chọn
  const [previewImage, setPreviewImage] = useState(null);  // state để xem trước hình ảnh

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authUser"))?.token;
        if (!token) {
          alert("No token found, please login!");
          return;
        }

        const response = await axios.get(`http://localhost:8086/api/banner/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setBanner({
            title: response.data.banner.title,
            imageUrl: response.data.banner.imageUrl,
            created_at: new Date(response.data.banner.created_at).toLocaleString("vi-VN"),
          });
          setPreviewImage(response.data.banner.imageUrl); // Set preview image from existing banner
        }
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };

    fetchBanner();
  }, [id]);

  const handleChange = (e) => {
    setBanner({ ...banner, [e.target.name]: e.target.value });
  };

  // Xử lý chọn file hình ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Hiển thị hình ảnh đã chọn trước khi upload
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("authUser"))?.token;
      if (!token) {
        alert("No token found, please login!");
        return;
      }

      const formData = new FormData();
      formData.append("title", banner.title);
      if (selectedFile) {
        formData.append("image", selectedFile); // Thêm file hình ảnh vào formData
      }

      // Gửi request PUT để cập nhật banner với file hình ảnh
      await axios.patch(`http://localhost:8086/api/banner/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("Banner updated successfully!");
      history.push("/banner",2000);  // Điều hướng về danh sách banner
    } catch (error) {
      console.error("Error updating banner:", error);
      alert("Failed to update banner. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>Edit Banner | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <h4 className="card-title">Edit Banner</h4>
              <AvForm onSubmit={handleSave}>
                {/* Title */}
                <AvField
                  className="mb-3"
                  name="title"
                  label="Title"
                  type="text"
                  value={banner.title}
                  onChange={handleChange}
                  validate={{
                    required: { value: true, errorMessage: "Title is required" },
                    minLength: { value: 3, errorMessage: "Title must be at least 3 characters" },
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

                {/* Created Date - View Only */}
                <AvField
                  className="mb-3"
                  name="created_at"
                  label="Created Date"
                  type="text"
                  value={banner.created_at}
                  disabled
                />

                <FormGroup className="mb-0">
                  <div>
                    <Button type="submit" color="primary" className="ms-1">
                      Save
                    </Button>{" "}
                    <Button type="reset" color="secondary" onClick={() => history.push("/banner")}>
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

export default EditBanner;
