import React, { useEffect, useState, useMemo } from "react";
import MetaTags from 'react-meta-tags';
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"

import { connect } from "react-redux";

import { setBreadcrumbItems } from "../../store/actions"
import axios from "axios"; // Thêm axios để gọi API
const Conversation = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Conversation", link: "#" },
  ]

  useEffect(() => {
      props.setBreadcrumbItems("Conversation", breadcrumbItems)
    }, [])
    const [conversations, setConversations] = useState([]);  
  
    const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    if (!token) {
      console.error("No token found, please login!");
      return;
    }
    useEffect(() => {
      const fetchConversations = async () => {
        try {
          const response = await axios.get("http://localhost:8086/api/conversation/all", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data && Array.isArray(response.data.conversations)) {
            setConversations(response.data.conversations); // Lấy danh sách từ response.data.conversations
          } else {
            console.error("API không trả về danh sách hợp lệ:", response.data);
            setConversations([]); // Gán mảng rỗng để tránh lỗi hiển thị
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      if (token) {
        fetchConversations();
      }
    }, [token]);
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");
    const data = useMemo(() => ({
      columns: [       
        { label: "Name", field: "name", sort: "asc", width: 200 },
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },
        { label: "User_Id", field: "user_id", sort: "asc", width: 200 },
   ],
      rows: conversations.map((conversations) => ({     
        created_at: formatDate(conversations.created_at),
        updated_at: formatDate(conversations.updated_at),
        user_id: conversations.user_id,
        name: conversations.name,
      })),
    }), [conversations]);
    
  return (
    <React.Fragment>
      <MetaTags>
        <title>Dashboard | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
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

export default connect(null, { setBreadcrumbItems })(Conversation)
