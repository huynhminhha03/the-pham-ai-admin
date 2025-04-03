import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Button, FormGroup, Label, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { adminApis, authAPI } from "helpers/api";

const AddBanner = () => {
  const history = useHistory();
  const [banner, setBanner] = useState({
    title: "",
    category_id: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);


  const handleChange = (e) => {
    setBanner({ ...banner, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {     

      const formData = new FormData();
      formData.append("title", banner.title);
      formData.append("category_id", banner.category_id);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await authAPI().post(adminApis.createBanner, formData);
      history.push("/banner",2000);
    } catch (error) {
      console.error("Error adding banner:", error);
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>Add Banner | ThePhamAI - Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <h4 className="card-title">Add New Banner</h4>
              <AvForm onSubmit={handleSave}>
                <AvField
                  className="mb-3"
                  name="title"
                  label="Title"
                  type="text"
                  value={banner.title || ""}
                  onChange={handleChange}
                  validate={{ required: { value: true, errorMessage: "Title is required" } }}
                />

                {/* Upload Ảnh */}
                <FormGroup className="mb-3">
                  <Label for="image">Upload Image</Label>
                  <div className="image-upload-wrapper">
                    <Input type="file" name="image" id="image" accept="image/*" onChange={handleFileChange} />
                    {previewImage && (
                      <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                      </div>
                    )}
                  </div>
                </FormGroup>

                {/* Chọn Category */}
                <FormGroup className="mb-3">
                  <Label for="category_id">Category</Label>
                  <Input type="select" name="category_id" id="category_id" value={banner.category_id||""} onChange={handleChange}>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>

                <FormGroup className="mb-3">
                  <div>
                    <Button type="submit" color="primary" className="ms-1">
                      Save
                    </Button>{" "}
                    <Button type="button" color="secondary" onClick={() => history.push("/banner")}>
                      Cancel
                    </Button>
                  </div>
                </FormGroup>
              </AvForm>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* CSS cho ảnh preview */}
      <style>
        {`
          .image-upload-wrapper {
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 10px;
          }
          .image-preview {
            margin-top: 10px;
            width: 150px;
            height: 150px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease-in-out;
          }
          .image-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .image-preview:hover {
            transform: scale(1.1);
          }
        `}
      </style>
    </React.Fragment>
  );
};

export default AddBanner;
