import React, { useEffect, useState, useMemo } from "react"
import MetaTags from "react-meta-tags"
import { MDBDataTable } from "mdbreact"
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap"
import { connect } from "react-redux"
import { setBreadcrumbItems } from "../../store/actions"

import { useHistory, useLocation } from "react-router-dom"
import { adminApis, authAPI } from "helpers/api"

const User = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "User", link: "#" },
  ]
  const history = useHistory()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    props.setBreadcrumbItems("User", breadcrumbItems)
  }, [props])

  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authAPI().get(
          `${adminApis.allUsers}?page=${currentPage}&limit=${pageSize}`
        )
        setUsers(response.data.users)
        setTotalPages(
          response.data.totalPages ||
            Math.ceil(response.data.totalItems / pageSize) ||
            1
        )
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error)
      }
    }
    fetchUsers()
  }, [currentPage])

  const formatDate = dateStr => new Date(dateStr).toLocaleString("vi-VN")

  const handleToggleStatus = async (userId, status) => {
    try {
      await authAPI().patch(adminApis.updateUser(userId), { status: !status })

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: !status } : user
        )
      )
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái user:", error)
    }
  }
  const handlePageChange = newPage => {
    setCurrentPage(newPage)
    history.push(`/user?page=${newPage}`) // Thay đổi URL khi chuyển trang
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
  const data = useMemo(
    () => ({
      columns: [
        { label: "Username", field: "username", sort: "asc", width: 150 },
        { label: "Email", field: "email", sort: "asc", width: 200 },
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },
        { label: "Status", field: "status", sort: "asc", width: 100 },
        {
          label: "Action",
          field: "actions",
          width: 200,
        },
      ],
      rows: users.map(user => ({
        username: user.username,
        email: user.email,
        created_at: formatDate(user.created_at),
        updated_at: formatDate(user.updated_at),
        status: (
          <button
            onClick={() => handleToggleStatus(user.id, user.status)}
            style={{
              backgroundColor: user.status ? "green" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {user.status ? "ON" : "OFF"}
          </button>
        ),
        actions: (
          <div>
            <i
              onClick={() => handleEdit(user.id)}
              className="ti-pencil fs-4 me-3 icon-hover text-success"
            ></i>
            <i
              onClick={() => handleOpenDeleteModal(user)}
              className="ti-trash fs-4 me-3 icon-hover text-danger"
            ></i>
          </div>
        ),
      })),
    }),
    [users]
  )
  const handleEdit = id => {
    history.push(`/edit-user/${id}`) // Navigate to the edit page
  }

  // Hàm xử lý khi nhấn nút "Xóa"
  const handleDelete = async id => {
    try {
      await authAPI().delete(adminApis.deleteUser(id))
      setUsers(users.filter(user => user.id !== id))
      setShowModal(false)

    } catch (error) {
      console.error("Lỗi khi xóa user:", error)
      setShowModal(false)

    }
  }
  const handleOpenDeleteModal = user => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }


  return (
    <React.Fragment>
      <MetaTags>
        <title>User | ThePhamAI</title>
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
                  Do you want to delete user named{" "}
                  <strong>
                    {selectedUser ? selectedUser.username : "this user"}
                  </strong>
                  ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleDelete(selectedUser.id)}
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
              {/* Bảng danh sách user */}
              <MDBDataTable
                responsive
                striped
                bordered
                data={data}
                paging={false} // Tắt phân trang mặc định
              />
              {/* <Row className="mt-3">
                <Col className="d-flex justify-content-center align-items-center">
                  <Button color="secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <span className="mx-3 ">Page {currentPage} of {totalPages}</span>
                  <Button color="secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                  </Button>
                </Col>
              </Row> */}
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

export default connect(null, { setBreadcrumbItems })(User)
