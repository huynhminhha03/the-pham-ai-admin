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

const Banner = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "/" },
    { title: "Banner", link: "/banner" },
  ]

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const history = useHistory()
  const [selectedBanner, setSelectedBanner] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    props.setBreadcrumbItems("Banner", breadcrumbItems)
  }, [props])

  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10
  const [banners, setBanners] = useState([])

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await authAPI().get(
          `${adminApis.allBanners}?page=${currentPage}&limit=${pageSize}`
        )
        setBanners(response.data.banners)
        setTotalPages(response.data.totalPages || 1)
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error)
      }
    }

    fetchBanners()
  }, [currentPage])

  const formatDate = dateStr => new Date(dateStr).toLocaleString("vi-VN")

  const handleToggleStatus = async (bannerId, status) => {
    try {
      await authAPI().patch(adminApis.updateBanner(bannerId), {
        status: !status,
      })

      setBanners(prevBanners =>
        prevBanners.map(banner =>
          banner.id === bannerId ? { ...banner, status: !status } : banner
        )
      )
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái banner:", error)
      alert("Lỗi khi cập nhật trạng thái banner!")
    }
  }

  const handleCreateBanner = () => {
    history.push("/add-banner")
  }

  const handleEdit = id => {
    history.push(`/edit-banner/${id}`)
  }

  const handleDelete = async id => {
    try {
      await authAPI().delete(adminApis.deleteBanner(id))
      setBanners(banners.filter(banner => banner.id !== id))
      setShowModal(false)
      setSelectedBanner(null)
    } catch (error) {
      console.error("Lỗi khi xóa banner:", error)
    }
  }

  const handleOpenDeleteModal = banner => {
    setSelectedBanner(banner)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedBanner(null)
  }

  const handlePageChange = newPage => {
    setCurrentPage(newPage)
    history.push(`banner?page=${newPage}`) // Thay đổi URL khi chuyển trang
  }
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
  const data = useMemo(
    () => ({
      columns: [
        { label: "Title", field: "title", sort: "asc", width: 200 },
        { label: "Image", field: "image", width: 150 },
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },
        { label: "Status", field: "status", width: 100 },
        { label: "Action", field: "actions", width: 200 },
      ],
      rows: banners.map(banner => ({
        title: banner.title,
        image: (
          <img
            src={banner.image}
            alt="banner"
            style={{ width: "50px", height: "50px" }}
          />
        ),
        created_at: formatDate(banner.created_at),
        updated_at: formatDate(banner.updated_at),
        status: (
          <button
            onClick={() => handleToggleStatus(banner.id, banner.status)}
            style={{
              backgroundColor: banner.status ? "green" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {banner.status ? "ON" : "OFF"}
          </button>
        ),
        actions: (
          <div>
            <i
              onClick={() => handleEdit(banner.id)}
              className="ti-pencil fs-4 me-3 icon-hover text-success"
              style={{ cursor: "pointer" }}
            ></i>
            <i
              onClick={() => handleOpenDeleteModal(banner)}
              className="ti-trash fs-4 me-3 icon-hover text-danger"
              style={{ cursor: "pointer" }}
              data-toggle="modal"
              data-target="#deleteModal"
            ></i>
          </div>
        ),
      })),
    }),
    [banners]
  )

  return (
    <React.Fragment>
      <MetaTags>
        <title>Banner | ThePhamAI - Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <Button
                color="primary"
                onClick={handleCreateBanner}
                className="mb-3"
              >
                Add Banner
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
                          Do you want to delete banner named{" "}
                          <strong>
                            {selectedBanner
                              ? selectedBanner.title
                              : "this banner"}
                          </strong>
                          ?
                        </p>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => handleDelete(selectedBanner.id)}
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

                  <PaginationItem disabled={currentPage === totalPages}>
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

export default connect(null, { setBreadcrumbItems })(Banner)
