import React, { useEffect, useState, useMemo, useCallback } from "react"
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

const Category = props => {
  const history = useHistory()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const page = searchParams.get("page") || 1

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Category", link: "#" },
  ]

  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(page || 1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  useEffect(() => {
    props.setBreadcrumbItems("Category", breadcrumbItems)
    if (page) {
      setCurrentPage(Number(page))
    }
  }, [props][page])
  //
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await authAPI().get(
          `${adminApis.allCategories}?page=${currentPage}&limit=${pageSize}`
        )

        setCategories(response.data.categories)
        setTotalPages(response.data.totalPages || 1)
      } catch (error) {
        console.error("Error getting data:", error)
      }
    }
    fetchCategories()
  }, [currentPage])

  const handleOpenDeleteModal = category => {
    setSelectedCategory(category)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedCategory(null)
  }

  const handleToggleStatus = async (categoryId, status) => {
    try {
      await authAPI().patch(adminApis.updateCategory(categoryId), {
        status: !status,
      })
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === categoryId
            ? { ...category, status: !status }
            : category
        )
      )
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const handlePageChange = newPage => {
    setCurrentPage(newPage)
    history.push(`/category?page=${newPage}`)
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

  //
  const handleDelete = async id => {
    try {
      await authAPI().delete(adminApis.deleteCategory(id))
      setCategories(categories.filter(category => category.id !== id))
      setShowModal(false)
    } catch (error) {
      console.error("Error deleting category:", error)
      setShowModal(false)
    }
  }

  const handleCreateCategory = () => {
    history.push("/add-category")
  }

  const handleEdit = id => {
    history.push(`/edit-category/${id}`)
  }

  const formatDate = dateStr => new Date(dateStr).toLocaleString("vi-VN")

  //
  const data = useMemo(
    () => ({
      columns: [
        { label: "Name", field: "name", sort: "asc", width: 200 },
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },
        { label: "Status", field: "status", width: 100 },
        { label: "Actions", field: "actions", width: 150 },
      ],
      rows: categories.map(category => ({
        name: category.name,
        created_at: formatDate(category.created_at),
        updated_at: formatDate(category.updated_at),
        status: (
          <button
            onClick={() => handleToggleStatus(category.id, category.status)}
            style={{
              backgroundColor: category.status ? "green" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {category.status ? "ON" : "OFF"}
          </button>
        ),
        actions: (
          <div>
            <i
              onClick={() => handleEdit(category.id)}
              className="ti-pencil fs-4 me-3 icon-hover text-success"
              style={{ cursor: "pointer" }}
            ></i>
            <i
              onClick={() => handleOpenDeleteModal(category)}
              className="ti-trash fs-4 me-3 icon-hover text-danger"
              style={{ cursor: "pointer" }}
            ></i>
          </div>
        ),
      })),
    }),
    [categories]
  )

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Category | ThePhamAI
        </title>
      </MetaTags>
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)", // Làm mờ nền
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
          <div className="modal-dialog modal-dialog-centered" role="document">
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
                  Do you want to delete category named{" "}
                  <strong>
                    {selectedCategory ? selectedCategory.name : "this category"}
                  </strong>
                  ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleDelete(selectedCategory.id)}
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
      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <Button
                color="primary"
                onClick={handleCreateCategory}
                className="mb-3"
              >
                Add Category
              </Button>
              <MDBDataTable
                responsive
                striped
                bordered
                data={data}
                paging={false}
              />
              {/* <Row className="mt-3">
                <Col className="d-flex justify-content-center align-items-center">
                  <Button color="secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <span className="mx-3">Page {currentPage} of {totalPages}</span>
                  <Button color="secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                  </Button>
                </Col>
              </Row> */}
              <nav aria-label="Page navigation">
                <Pagination className="d-flex justify-content-end">
                  <PaginationItem disabled={currentPage === 1}>
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

export default connect(null, { setBreadcrumbItems })(Category)
