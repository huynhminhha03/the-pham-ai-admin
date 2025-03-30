import React, { useEffect, useState, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useHistory } from "react-router-dom";
const Category = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Category", link: "#" },
  ]
  useEffect(() => {
        props.setBreadcrumbItems("Category", breadcrumbItems)
      }, [])    
    //   const [categories, setCategories] = useState([]);
    //   const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    // if (!token) {
    //   console.error("No token found, please login!");
    //   return;
    //}
  //   useEffect(() => {
  //     const fetchCategories = async () => {
  //       try {
  //         const response = await axios.get("http://localhost:8086/api/admin/category/all", {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });
  //         if (response.data && Array.isArray(response.data.categories)) {
  //           setCategories(response.data.categories); // Lấy danh sách từ response.data.categories
  //         } else {
  //           console.error("API không trả về danh sách hợp lệ:", response.data);
  //           setCategories([]); // Gán mảng rỗng để tránh lỗi hiển thị
  //         }
  //       } catch (error) {
  //         console.error("Error fetching data:", error);        
  //       }
  //     };
    
  //     if (token) {
  //       fetchCategories();
  //     }
  //   }, [token]);
  //   const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");
  //   const data = useMemo(() => ({
  //     columns: [       
  //       { label: "Name", field: "name", sort: "asc", width: 200 },
  //       { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
  //       { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },       
  //  ],
  //     rows: categories.map((categories) => ({     
  //       created_at: formatDate(categories.created_at),
  //       updated_at: formatDate(categories.updated_at),        
  //       name: categories.name,
  //     })),
  //   }), [categories]);
  
  // const handleEdit = (id) => {
  //   history.push(`/edit-catgory/${id}`); // Navigate to the edit page
  // };

  // // Hàm xử lý khi nhấn nút "Xóa"
  // const handleDelete = async (id) => {
  //   const confirmDelete = window.confirm("Are you sure want to delete this user?");
  //   if (confirmDelete) {
  //     try {
  //       const token = JSON.parse(localStorage.getItem("authUser"))?.token;
  //       await axios.delete(`http://localhost:8086/api/admin/category/${id}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       alert("Delete successfull!");
  //       // Update listUser after delete user
  //       setCategories(categories.filter(() => categories.id !== id));
  //     } catch (error) {
  //       console.error("Lỗi khi xóa category:", error);
  //       alert("Không thể xóa user. Vui lòng thử lại!");
  //     }
  //   }
  // };
  const handleEdit = (name) => {
    history.push("/editcategory")
  }
  
  const handleDelete = (name) => {
    alert(`Xóa: ${name}`)}
  const data = {
    columns: [
      {
        label: "Name",
        field: "name",
        sort: "asc",        
        width: 150,
      },
      {
        label: "Ngày tạo",
        field: "createdDate",
        sort: "asc",
        width: 200,
      },
      {
        label: "Chi tiết",
        field: "details",
        sort: "asc",
        width: 300,
      },
      { label: "Hành động", 
        field: "actions", 
        width: 200 },
    ],
    rows: [
      {
        name: "John Doe",
        createdDate: "2025-03-28",
        details: "Đây là chi tiết của John Doe",
        status: (
          <button
            onClick={() => handleToggleStatus(user.id)}
            style={{
              backgroundColor: cagetory.isActive ? "green" : "red",
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
            <i onClick={() => handleEdit("John Doe")} className="ti-pencil fs-4 me-3 icon-hover text-warning">
              
            </i>
            <i onClick={() => handleDelete("John Doe")} className="ti-trash fs-4 me-3 icon-hover text-warning">
              
            </i>
          </div>
        )  
      },
      {
        name: "Jane Smith",
        createdDate: "2025-03-27",
        details: "Đây là chi tiết của Jane Smith",
        actions: (
          <div>
            <i onClick={() => handleEdit("John Doe")} className="ti-pencil fs-4 me-3 icon-hover text-warning">
              
            </i>
            <i onClick={() => handleDelete("John Doe")} className="ti-trash fs-4 me-3 icon-hover text-warning">
              
            </i>
          </div>
        )
      },
      {
        name: "Peter Parker",
        createdDate: "2025-03-26",
        details: "Đây là chi tiết của Peter Parker",
        actions: (
          <div>
            <i onClick={() => handleEdit("John Doe")} className="ti-pencil fs-4 me-3 icon-hover text-warning">
            
            </i>
            <i onClick={() => handleDelete("John Doe")} className="ti-trash fs-4 me-3 icon-hover text-warning">
            
            </i>
          </div>
        )
      },
    ],
   };
  
  return (
    <React.Fragment>
      <MetaTags>
        <title>Category | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
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

export default connect(null, { setBreadcrumbItems })(Category)
