import React, { useEffect, useState, useMemo, useCallback } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";

const Conversation = (props) => {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page") || 1;

  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Conversation", link: "#" },
  ];

  const [conversations, setConversations] = useState([]);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Số cuộc trò chuyện trên mỗi trang

  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  useEffect(() => {
    props.setBreadcrumbItems("Conversation", breadcrumbItems);
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [props, page]);

  const fetchConversations = useCallback(async () => {
    if (!token) return console.error("No token found, please login!");

    try {
      const response = await axios.get(
        `http://localhost:8086/api/conversation/admin/all?page=${currentPage}&limit=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data.conversations)) {
        setConversations(response.data.conversations);
        setTotalPages(response.data.totalPages || 1);
      } else {
        console.error("API không trả về danh sách hợp lệ:", response.data);
        setConversations([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  }, [token, currentPage]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    history.push(`/conversation?page=${newPage}`); // Thay đổi URL khi chuyển trang
  };

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      try {
        await axios.delete(`http://localhost:8086/api/conversation/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Conversation deleted successfully!");
        fetchConversations(); // Load lại dữ liệu sau khi xóa
      } catch (error) {
        console.error("Error deleting conversation:", error);
        alert("Failed to delete conversation. Please try again!");
      }
    }
  };

  const handleEdit = (id) => {
    history.push(`/edit-conversation/${id}`);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");

  const data = useMemo(
    () => ({
      columns: [
        { label: "Name", field: "name", sort: "asc", width: 200 },
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },
        { label: "Actions", field: "actions", width: 150 },
      ],
      rows: conversations.map((conversation) => ({
        name: conversation.name,
        created_at: formatDate(conversation.created_at),
        updated_at: formatDate(conversation.updated_at),
        actions: (
          <div>
            <i
              onClick={() => handleEdit(conversation.id)}
              className="ti-pencil fs-4 me-3 icon-hover text-success"
              style={{ cursor: "pointer" }}
            ></i>
            <i
              onClick={() => handleDelete(conversation.id)}
              className="ti-trash fs-4 me-3 icon-hover text-danger"
              style={{ cursor: "pointer" }}
            ></i>
          </div>
        ),
      })),
    }),
    [conversations]
  );

  return (
    <React.Fragment>
      <MetaTags>
        <title>Conversation | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <MDBDataTable responsive striped bordered data={data} paging={false} />
              <nav aria-label="Page navigation">
                <Pagination className="d-flex justify-content-end">
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={handlePrevPage}>
                      Previous
                    </PaginationLink>
                  </PaginationItem>

                  {[...Array(totalPages).keys()].map((page) => (
                    <PaginationItem key={page + 1} active={currentPage === page + 1}>
                      <PaginationLink onClick={() => handlePageChange(page + 1)}>
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem disabled={currentPage === totalPages} active={currentPage === totalPages}>
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
  );
};

export default connect(null, { setBreadcrumbItems })(Conversation);
