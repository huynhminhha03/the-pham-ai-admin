import React, { useEffect, useState, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import axios from "axios"; // Thêm axios để gọi API
import { useHistory, useLocation } from "react-router-dom";
import actions from "redux-form/lib/actions";



const User = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "User", link: "#" },
  ]
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page") || 1;
  useEffect(() => {
    props.setBreadcrumbItems("User", breadcrumbItems)
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [props] [page]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

    const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    if (!token) {
      console.error("No token found, please login!");
      return;
    }
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`http://localhost:8086/api/admin/user/all?page=${currentPage}&limit=${pageSize}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data && Array.isArray(response.data.users)) {
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages || Math.ceil(response.data.totalItems / pageSize) || 1);
          } else {
            console.error("API không trả về danh sách hợp lệ:", response.data);
            setUsers([]);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu:", error);
        }
      };
  
    
      if (token) {
        fetchUsers();
      }
    }, [token]);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");
    
    const handleToggleStatus = async (userId) => {
  try {
    const updatedUser = users.find(user => user.id === userId);
    const newStatus = !updatedUser.isActive;

    const response = await axios.patch(`http://localhost:8086/api/user/${userId}`, 
      { status: newStatus }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } else {
      console.error("Failed to update user status:", response);
      alert("Không thể cập nhật trạng thái user!");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái user:", error);
    alert("Lỗi khi cập nhật trạng thái user!");
  }
};
const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
  history.push(`/user?page=${newPage}`); // Thay đổi URL khi chuyển trang
};
//
const handleNextPage = () => {
  if (currentPage < totalPages) {
    handlePageChange(currentPage + 1);
  }
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    handlePageChange(currentPage - 1);
  }
};
    const data = useMemo(() => ({
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
      rows: users.map((user) => ({
        username: user.username,
        email: user.email,
        created_at: formatDate(user.created_at),
        updated_at: formatDate(user.updated_at),
        status: (
          <button
            onClick={() => handleToggleStatus(user.id)}
            style={{
              backgroundColor: user.status ? "green" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {users.st ? "ON" : "OFF"}
          </button>
        ),            
        actions: (
          <div>
            <i
              onClick={() => handleEdit(user.id)}
              className="ti-pencil fs-4 me-3 icon-hover text-success"             
            >           
            </i>
            <i
              onClick={() => handleDelete(user.id)}
              className="ti-trash fs-4 me-3 icon-hover text-danger"
            >
            </i>
          </div>
        ),                
      })),
    }), [users]);
    const handleEdit = (id) => {
      history.push(`/edit-user/${id}`); // Navigate to the edit page
    };
  
    // Hàm xử lý khi nhấn nút "Xóa"
    const handleDelete = async (id) => {
      const confirmDelete = window.confirm("Are you sure want to delete this user?");
      if (confirmDelete) {
        try {
          const token = JSON.parse(localStorage.getItem("authUser"))?.token;
          await axios.delete(`http://localhost:8086/api/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Delete successfull!");
          // Update listUser after delete user
          setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
          console.error("Lỗi khi xóa user:", error);
          alert("Không thể xóa user. Vui lòng thử lại!");
        }
      }
    };
  
  
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
                  <PaginationItem disabled={currentPage === 1} active={currentPage===1}>
                    <PaginationLink previous onClick={handlePrevPage}>Previous</PaginationLink>
                  </PaginationItem>

                  {[...Array(totalPages).keys()].map((page) => (
                    <PaginationItem key={page + 1} active={currentPage === page + 1}>
                      <PaginationLink onClick={() => handlePageChange(page + 1)}>
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem disabled={currentPage === totalPages} active={currentPage===totalPages}>
                    <PaginationLink next onClick={handleNextPage}>Next</PaginationLink>
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
