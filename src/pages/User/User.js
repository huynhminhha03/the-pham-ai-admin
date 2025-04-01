import React, { useEffect, useState, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import axios from "axios"; // Thêm axios để gọi API
import { useHistory } from "react-router-dom";
import actions from "redux-form/lib/actions";



const User = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "User", link: "#" },
  ]
  const history = useHistory();
  useEffect(() => {
    props.setBreadcrumbItems("User", breadcrumbItems)
  }, [])
  const [users, setUsers] = useState([]);

    const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    if (!token) {
      console.error("No token found, please login!");
      return;
    }
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("http://localhost:8086/api/admin/user/all", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data && Array.isArray(response.data.users)) {
            setUsers(response.data.users); // Lấy danh sách từ response.data.users
          } else {
            console.error("API không trả về danh sách hợp lệ:", response.data);
            setUsers([]); // Gán mảng rỗng để tránh lỗi hiển thị
          }
        } catch (error) {
          console.error("Error fetching data:", error);
         
        }
      };
    
      if (token) {
        fetchUsers();
      }
    }, [token]);
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");
    const handleToggleStatus = (userId) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
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
              backgroundColor: user.isActive ? "green" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {user.isActive ? "ON" : "OFF"}
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
          await axios.delete(`http://localhost:8086/api/admin/user/${id}`, {
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
              <MDBDataTable responsive striped bordered data={data} paging={true} entries={10} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(User)
