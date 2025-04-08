import React, { useState, useEffect } from "react"
import MetaTags from "react-meta-tags"
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
import { useHistory } from "react-router-dom"
import { adminApis, authAPI } from "helpers/api"
import { setBreadcrumbItems } from "../../store/actions"
import { connect } from "react-redux"

const AddBanner = props => {
  const breadcrumbItems = [
    { title: "Banner", link: "/banner" },
    { title: "Add Banner", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems("Add Banner", breadcrumbItems)
  }, [])

  const history = useHistory()
   const [formData, setFormData] = useState({
      title: "",   
      description: "",
      image: null,
    })
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await authAPI().get(adminApis.allCategories)
        if (response.data) {
          setCategories(response.data.categories)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewImage(URL.createObjectURL(file))
      setFormData({
        ...formData,
        image: file, // Cập nhật vào formData
      })
    }
  }

  const handleSubmit = async e => {
      e.preventDefault()
  
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("image", formData.image)
  
      setLoading(true)
      try {
        await authAPI().post(adminApis.createBanner, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        history.push("/banner", 1000)
      } catch (error) {
        console.error("Error :", error)
      } finally {
        setLoading(false)
      }
    }
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
              <AvForm>
                <AvField
                  className="mb-3"
                  name="title"
                  label="Title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Title is required",
                    },
                  }}
                />

                {/* Upload Ảnh */}
                <FormGroup className="mb-3">
                  <Label for="image">Upload Image</Label>
                  <div className="image-upload-wrapper">
                    <Input
                      type="file"
                      name="image"
                      id="image"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {previewImage && (
                      <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                      </div>
                    )}
                  </div>
                </FormGroup>
                
                <FormGroup className="mt-3">
                  <Label>Description</Label>      
                    <Input
                      type="textarea"
                      id="description"
                      name="description"
                      onChange={handleChange}
                      rows="3"                    
                    />
                  </FormGroup>

                {/* Chọn Category */}
                <FormGroup className="mb-3">
                  <Label for="category_id">Category</Label>
                  <Input
                    type="select"
                    name="category_id"
                    id="category_id"
                    value={formData.category_id || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>

                <FormGroup className="mb-3">
                  <div>
                    <Button
                      type="submit"
                      color="primary"
                      className="ms-1"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <span>Loading...</span> // Hiển thị trạng thái loading
                      ) : (
                        "AddBanner"
                      )}
                    </Button>{" "}
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => history.push("/banner")}
                    >
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
  )
}

export default connect(null, { setBreadcrumbItems })(AddBanner)
