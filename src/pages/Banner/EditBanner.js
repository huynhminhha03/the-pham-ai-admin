import React, { useEffect, useState } from "react"
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
import { useParams, useHistory } from "react-router-dom"
import { adminApis, authAPI } from "helpers/api"
import { setBreadcrumbItems } from "../../store/actions"
import { connect } from "react-redux"

const EditBanner = props => {
  const { id } = useParams()
  const history = useHistory()

  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Banner", link: "#" },
    { title: "Edit Banner", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems("Edit Banner", breadcrumbItems)
  }, [])

  const [banner, setBanner] = useState({
    title: "",
    image: "",
    description: "",
    created_at: "",
  })

  const [selectedFile, setSelectedFile] = useState(null) 
  const [previewImage, setPreviewImage] = useState(null) 

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await authAPI().get(adminApis.getBannerById(id))

        setBanner({
          title: response.data.banner.title,
          image: response.data.banner.image,
          description: response.data.banner.description,
          created_at: new Date(response.data.banner.created_at).toLocaleString(
            "vi-VN"
          ),
        })
        setPreviewImage(response.data.banner.image) // Set preview image from existing banner
      } catch (error) {
        console.error("Error fetching banner data:", error)
      }
    }

    fetchBanner()
  }, [id])

  const handleChange = (e) => {
    setBanner({ ...banner, [e.target.name]: e.target.value })
  }

  // handle select imagefile
  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewImage(URL.createObjectURL(file)) // Show image
    }
  }

  const handleSave = async e => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append("title", banner.title)
      formData.append("description", banner.description)
      if (selectedFile) {
        formData.append("image", selectedFile) // add imagefile into formData
      }

      // Send request PUT to update banner with imagefile
      await authAPI().patch(adminApis.updateBanner(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      history.push("/banner", 2000) // 
    } catch (error) {
      console.error("Error updating banner:", error)
    }
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Edit Banner | ThePhamAI
        </title>
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
                    required: {
                      value: true,
                      errorMessage: "Title is required",
                    },
                    minLength: {
                      value: 3,
                      errorMessage: "Title must be at least 3 characters",
                    },
                  }}
                />

                {/* Image Upload */}
                <FormGroup className="mb-3">
                  <Label for="image" className="mb-3 me-3">
                    Upload Image
                  </Label>
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
                <Input
                    className="mb-3"
                    type="textarea"
                    id="description"
                    name="description"
                    onChange={handleChange}
                    rows="5"
                    value={banner.description}
                  />
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
                    <Button
                      type="reset"
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
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(EditBanner)
