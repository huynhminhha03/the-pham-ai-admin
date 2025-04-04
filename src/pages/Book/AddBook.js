import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap"
import { adminApis, authAPI } from "helpers/api"
import { connect } from "react-redux"
import { setBreadcrumbItems } from "../../store/actions"

const AddBook = (props) => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Books", link: "#" },
    { title: "Add Book", link: "#" },
  ]

  useEffect(() => {
      props.setBreadcrumbItems("Add Book", breadcrumbItems)
    }, [])
  

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const history = useHistory()
  const [textareabadge, settextareabadge] = useState(0)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    image: null,
    published_year: "",
  })
  const [loading, setLoading] = useState(false)

  const textareachange = e => {
    const count = e.target.value.length
    if (count > 0) {
      settextareabadge(true)
    } else {
      settextareabadge(false)
    }
    settextcount(e.target.value.length)
  }

  // Xử lý thay đổi input text
  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Xử lý khi chọn file ảnh
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

  // Xử lý khi submit form
  const handleSubmit = async e => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append("title", formData.title)
    formDataToSend.append("author", formData.author)
    formDataToSend.append("description", formData.description)
    formDataToSend.append("image", formData.image)
    formDataToSend.append("published_year", formData.published_year)

    setLoading(true)
    try {
      await authAPI().post(adminApis.createBook, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      history.push("/book", 1000)
    } catch (error) {
      console.error("Error :", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <h3 className="mt-3">Add New Book</h3>
      <Form>
        <FormGroup className="mt-3">
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
        <FormGroup className="mt-3">
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
        <FormGroup className="mt-3">
        <Label>Description</Label>      
          <Input
            type="textarea"
            id="decription"
            onChange={handleChange}
            maxLength="1000"
            rows="3"
            placeholder="This textarea has a limit of 1000 chars."
          />
          {textareabadge ? (
            <span className="badgecount badge badge-success">
              {" "}
              {textcount} / 225{" "}
            </span>
          ) : null}
        </FormGroup>
        <FormGroup className="mt-3">
          <Label for="image">Book Image</Label>
          <div className="image-upload-container mb-3">
            <Input
              type="file"
              name="image"
              id="image"
              onChange={handleFileChange}
              accept="image/*"
              className="image-upload-input"
            />
            {previewImage && (
              <div className="image-preview-container mt-2">
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: 100, height: 100 }}
                />
              </div>
            )}
          </div>
        </FormGroup>
        <FormGroup className="mt-3">
          <Label for="published_year">Publish Date</Label>
          <Input
            type="date"
            name="published_year"
            id="published_year"
            value={formData.published_year}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button
          className="mt-3"
          color="primary"
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span>Loading...</span> // Hiển thị trạng thái loading
          ) : (
            "Add Book"
          )}
        </Button>
      </Form>
    </Container>
  )
}

export default connect(null, { setBreadcrumbItems })(AddBook)
