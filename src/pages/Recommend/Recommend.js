import React, { useEffect, useState, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import axios from "axios"; // Thêm axios để gọi API

const Recommend = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Recommend", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems("Recommend", breadcrumbItems)
  }, [])
  const [recommends, setRecommends] = useState([]);
    const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    if (!token) {
      console.error("No token found, please login!");
      return;
    }
    useEffect(() => {
      const fetchRecommends = async () => {
        try {
          const response = await axios.get("http://localhost:8086/api/admin/recommend/all", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data && Array.isArray(response.data.recommends)) {
            setRecommends(response.data.recommands); // Lấy danh sách từ response.data.users
          } else {
            console.error("API không trả về danh sách hợp lệ:", response.data);
            setRecommends([]); // Gán mảng rỗng để tránh lỗi hiển thị
          }
        } catch (error) {
          console.error("Error fetching data:", error);
         
        }
      };
    
      if (token) {
        fetchRecommends();
      }
    }, [token]);
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");
    const data = useMemo(() => ({
      columns: [
        { label: "Name", field: "Name", sort: "asc", width: 150 },
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },       
      ],
      rows: recommends.map((recommends) => ({
        name: recommends.name,       
        created_at: formatDate(recommends.created_at),
        updated_at: formatDate(recommends.updated_at),        
      })),
    }), [recommends]);
  return (
    <React.Fragment>
      <MetaTags>
        <title>Recommand | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
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

export default connect(null, { setBreadcrumbItems })(Recommend)
