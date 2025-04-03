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
import { connect } from "react-redux"
import { setBreadcrumbItems } from "../../store/actions"

const EditBook = props => {
  const { id } = useParams() // Lấy id từ URL
  const history = useHistory() // Để điều hướng sau khi lưu

  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Books", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems("Edit Book", breadcrumbItems)
  }, [])

  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
    image: "",
    published_year: "",
  })

  const [selectedFile, setSelectedFile] = useState(null) // Thêm state để lưu file đã chọn
  const [previewImage, setPreviewImage] = useState(null) // Thêm state để xem trước ảnh

  // Fetch dữ liệu sách từ API khi component được mount
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await authAPI().get(adminApis.getBookById(id))

        setBook({
          title: response.data.book.title,
          author: response.data.book.author,
          description: response.data.book.description,
          image: response.data.book.image,
          published_year: new Date(
            response.data.book.published_year
          ).toLocaleDateString("vi-VN"),
        })
        setPreviewImage(response.data.book.image) // Hiển thị hình ảnh hiện tại
      } catch (error) {
        console.error("Error fetching book data:", error)
      }
    }

    fetchBook()
  }, [id])

  const handleChange = e => {
    setBook({ ...book, [e.target.name]: e.target.value })
  }

  // Xử lý thay đổi file hình ảnh
  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewImage(URL.createObjectURL(file)) // Cập nhật hình ảnh xem trước
    }
  }

  // Xử lý lưu thay đổi
  const handleSave = async e => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append("title", book.title)
      formData.append("author", book.author)
      formData.append("description", book.description)
      formData.append(
        "published_year",
        new Date(book.published_year).toLocaleDateString("vi-VN")
      ) // Sửa chính tả ở đây

      if (selectedFile) {
        formData.append("image", selectedFile) // Thêm file hình ảnh vào formData
      }

      await authAPI().patch(adminApis.updateBook(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      history.push("/book", 2000) // Điều hướng về danh sách sách
    } catch (error) {
      console.error("Error updating book:", error)
    }
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Edit Book | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard
        </title>
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

                {/* Author */}
                <AvField
                  className="mb-3"
                  name="author"
                  label="Author"
                  type="text"
                  value={book.author}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Author is required",
                    },
                    minLength: {
                      value: 3,
                      errorMessage: "Author must be at least 3 characters",
                    },
                  }}
                />
                <Input
                  className="mb-3"
                  type="textarea"
                  id="textarea"
                  onChange={handleChange}
                  maxLength="225"
                  rows="3"
                  value={book.description}
                />
                {/* Image Upload */}
                <FormGroup className="md-3">
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
                    <div className="image-preview md-3 ">
                      <img src={previewImage} alt="Preview" width="200" />
                    </div>
                  )}
                </FormGroup>

                {/* Published Date */}
                <AvField
                  className="mb-3"
                  name="published_year"
                  label="Published Date"
                  type="date"
                  value={book.published_year}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Published Date is required",
                    },
                  }}
                />

                <FormGroup className="mb-0">
                  <div>
                    <Button type="submit" color="primary" className="ms-1">
                      Save
                    </Button>{" "}
                    <Button
                      type="reset"
                      color="secondary"
                      onClick={() => history.push("/book")}
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

export default connect(null, { setBreadcrumbItems })(EditBook)
