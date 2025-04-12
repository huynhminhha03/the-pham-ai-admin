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
  const { id } = useParams()
  const history = useHistory()

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

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  function formatDateVNFromISOString(isoString) {
    const date = new Date(isoString) // chuỗi ISO là UTC
    // Cộng thêm 7 tiếng để chuyển sang giờ Việt Nam
    date.setHours(date.getHours() + 7)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await authAPI().get(adminApis.getBookById(id))
        console.log(response.data.book)
        setBook({
          title: response.data.book.title,
          author: response.data.book.author,
          description: response.data.book.description,
          image: response.data.book.image,
          published_year: formatDateVNFromISOString(
            response.data.book.published_year
          ),
        })
        setPreviewImage(response.data.book.image)
      } catch (error) {
        console.error("Error fetching book data:", error)
      }
    }

    fetchBook()
  }, [id])

  const handleChange = e => {
    setBook({ ...book, [e.target.name]: e.target.value })
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

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
      )

      if (selectedFile) {
        formData.append("image", selectedFile)
      }

      await authAPI().patch(adminApis.updateBook(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      history.push("/book", 2000)
    } catch (error) {
      console.error("Error updating book:", error)
    }
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>Edit Book | ThePhamAI</title>
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
                  id="description"
                  name="description"
                  onChange={handleChange}
                  rows="5"
                  value={book.description}
                />
                {/* Image Upload */}
                <FormGroup className="md-3 mb-3">
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

                <FormGroup className="mb-2">
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
