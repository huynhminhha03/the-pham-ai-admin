import React, { useEffect, useState, useMemo } from "react"
import MetaTags from "react-meta-tags"
import { MDBDataTable } from "mdbreact"
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap"
import { connect } from "react-redux"
import { setBreadcrumbItems } from "../../store/actions"

import { useLocation, useHistory } from "react-router-dom"
import { adminApis, authAPI } from "helpers/api"

const Book = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Books", link: "#" },
  ]
  const history = useHistory()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const page = searchParams.get("page") || 1
  const [showModal, setShowModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)

  const handleOpenDeleteModal = book => {
    setSelectedBook(book)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedBook(null)
  }
  useEffect(() => {
    props.setBreadcrumbItems("Books", breadcrumbItems)
    if (page) {
      setCurrentPage(Number(page))
    }
  }, [props, page])

  const [books, setBooks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await authAPI().get(
          `${adminApis.allBooks}?page=${currentPage}&limit=${pageSize}`
        )
        setBooks(response.data.books)
        setTotalPages(
          response.data.totalPages ||
            Math.ceil(response.data.totalItems / pageSize) ||
            1
        )
      } catch (error) {
        console.error("Error getting data:", error)
      }
    }
    fetchBooks()
  }, [currentPage])

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("vi-VN");

  const handleToggleStatus = async (bookId, status) => {
    try {
      await authAPI().patch(adminApis.updateBook(bookId), { status: !status })

      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === bookId ? { ...book, status: !status } : book
        )
      )
    } catch (error) {
      console.error("Error update status book:", error)
    }
  }

  const handleEdit = id => {
    history.push(`/edit-book/${id}`)
  }

  const handleCreateBook = () => {
    history.push("/add-book")
  }

  const handleDelete = async id => {
    try {
      await authAPI().delete(adminApis.deleteBook(id))
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id))
      setShowModal(false)
    } catch (error) {
      console.error("Error deletting book:", error)
      
    }
  }

  const handlePageChange = newPage => {
    setCurrentPage(newPage)
    history.push(`/book?page=${newPage}`) // Change URL turn page
  }
  //
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }
  const max_lenght = 20

  const data = useMemo(
    () => ({
      columns: [
        { label: "Title", field: "title", sort: "asc", width: 200 },
        { label: "Author", field: "author", sort: "asc", width: 200 },
        { label: "Description", field: "description", sort: "asc", width: 200 },
        { label: "Image", field: "image", width: 150 },
        {
          label: "Publish Date",
          field: "published_year",
          sort: "asc",
          width: 200,
        },
        { label: "Status", field: "status", width: 100 },
        { label: "Action", field: "actions", width: 200 },
      ],
      rows: books.map(book => ({
        title: book.title,
        author: book.author,
        description: (
          <span title={book.description}>
            {book.description.length > max_lenght
              ? `${book.description.substring(0, max_lenght)}...`
              : book.description}
          </span>
        ),
        published_year: formatDate(book.published_year),
        image: (
          <img
            src={book.image}
            alt="book"
            style={{ width: "50px", height: "50px" }}
          />
        ),
        status: (
          <button
            onClick={() => handleToggleStatus(book.id, book.status)}
            style={{
              backgroundColor: book.status ? "green" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {book.status ? "ON" : "OFF"}
          </button>
        ),
        actions: (
          <div>
            <i
              onClick={() => handleEdit(book.id)}
              className="ti-pencil fs-4 me-3 icon-hover text-success"
              style={{ cursor: "pointer" }}
            ></i>
            <i
              onClick={() => handleOpenDeleteModal(book)}
              className="ti-trash fs-4 me-3 icon-hover text-danger"
              style={{ cursor: "pointer" }}
            ></i>
          </div>
        ),
      })),
    }),
    [books]
  )

  return (
    <React.Fragment>
      <MetaTags>
        <title>Books | ThePhamAI - Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <Button
                color="primary"
                onClick={handleCreateBook}
                className="mb-3"
              >
                Add Book
              </Button>
              <MDBDataTable
                responsive
                striped
                bordered
                data={data}
                paging={false}
              />
              {showModal && (
                <div
                  className="modal show d-block"
                  tabIndex="-1"
                  role="dialog"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Confirm Delete</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={handleCloseModal}
                        />
                      </div>
                      <div className="modal-body">
                        <p>
                          Do you want to delete the book named{" "}
                          <strong>
                            {selectedBook
                              ? selectedBook.title
                              : "this book"}
                          </strong>
                          ?
                        </p>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => handleDelete(selectedBook.id)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleCloseModal}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <nav aria-label="Page navigation">
                <Pagination className="d-flex justify-content-end">
                  <PaginationItem
                    disabled={currentPage === 1}
                    active={currentPage === 1}
                  >
                    <PaginationLink previous onClick={handlePrevPage}>
                      Previous
                    </PaginationLink>
                  </PaginationItem>

                  {[...Array(totalPages).keys()].map(page => (
                    <PaginationItem
                      key={page + 1}
                      active={currentPage === page + 1}
                    >
                      <PaginationLink
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem
                    disabled={currentPage === totalPages}
                    active={currentPage === totalPages}
                  >
                    <PaginationLink next onClick={handleNextPage}>
                      Next
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </nav>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(Book)
