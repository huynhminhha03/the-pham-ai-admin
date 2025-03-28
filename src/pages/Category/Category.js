import React, { useEffect, useState, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import axios from "axios"; // Thêm axios để gọi API

const Category = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Category", link: "#" },
  ]
  useEffect(() => {
        props.setBreadcrumbItems("Category", breadcrumbItems)
      }, [])
      const [categories, setCategories] = useState([]);
      const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    if (!token) {
      console.error("No token found, please login!");
      return;
    }
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await axios.get("http://localhost:8086/api/admin/category/all", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data && Array.isArray(response.data.categories)) {
            setCategories(response.data.categories); // Lấy danh sách từ response.data.categories
          } else {
            console.error("API không trả về danh sách hợp lệ:", response.data);
            setCategories([]); // Gán mảng rỗng để tránh lỗi hiển thị
          }
        } catch (error) {
          console.error("Error fetching data:", error);        
        }
      };
    
      if (token) {
        fetchCategories();
      }
    }, [token]);
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");
    const data = useMemo(() => ({
      columns: [       
        { label: "Name", field: "name", sort: "asc", width: 200 },
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },       
   ],
      rows: categories.map((categories) => ({     
        created_at: formatDate(categories.created_at),
        updated_at: formatDate(categories.updated_at),        
        name: categories.name,
      })),
    }), [categories]);
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
