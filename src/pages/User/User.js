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
import axios from "axios" // Thêm axios để gọi API
import { useHistory, useLocation } from "react-router-dom"
import actions from "redux-form/lib/actions"
import { adminApis, authAPI, authApis } from "helpers/api"

const User = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "User", link: "#" },
  ]
  const history = useHistory()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const page = searchParams.get("page") || 1
  useEffect(() => {
    props.setBreadcrumbItems("User", breadcrumbItems)
    if (page) {
      setCurrentPage(Number(page))
    }
  }, [props, page])
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
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
      await authAPI().patch(
        adminApis.updateUser(userId),
        { status: 
          !status },        
      )     
    
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
              onClick={() => handleDelete(user.id)}
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
  const handleDelete = async (id) => {   
      try {
       
        await authAPI().delete(adminApis.deleteUser(id))
        setUsers(users.filter(user => user.id !== id))
      } catch (error) {
        console.error("Lỗi khi xóa user:", error)        
      }
    } 

  return (
    <React.Fragment>
      <MetaTags>
        <title>User | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              {/* Bảng danh sách banner */}
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
