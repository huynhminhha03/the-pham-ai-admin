import React, { useEffect, useState, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Book = (props) => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Books", link: "#" },
  ];
  const history = useHistory();
  
  useEffect(() => {
    props.setBreadcrumbItems("Books", breadcrumbItems);
  }, []);

  const [books, setBooks] = useState([]);
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/admin/book/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && Array.isArray(response.data.books)) {
          setBooks(response.data.books);
        } else {
          console.error("API không trả về danh sách hợp lệ:", response.data);
          setBooks([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    
    if (token) {
      fetchBooks();
    }
  }, [token]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");

  const handleToggleStatus = (bookId) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, isActive: !book.isActive } : book
      )
    );
  };

  const handleEdit = (id) => {
    history.push(`/edit-book/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sách này?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8086/api/admin/book/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Xóa sách thành công!");
        setBooks(books.filter((book) => book.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
        alert("Không thể xóa sách. Vui lòng thử lại!");
      }
    }
  };

  const data = useMemo(() => ({
    columns: [
      { label: "Tên sách", field: "title", sort: "asc", width: 200 },
      { label: "Tác giả", field: "author", sort: "asc", width: 200 },
      { label: "Ngày xuất bản", field: "published_at", sort: "asc", width: 200 },
      { label: "Trạng thái", field: "status", width: 100 },
      { label: "Hành động", field: "actions", width: 200 },
    ],
    rows: books.map((book) => ({
      title: book.title,
      author: book.author,
      published_at: formatDate(book.published_at),
      status: (
        <button
          onClick={() => handleToggleStatus(book.id)}
          style={{
            backgroundColor: book.isActive ? "green" : "red",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {book.isActive ? "ON" : "OFF"}
        </button>
      ),
      actions: (
        <div>
          <i
            onClick={() => handleEdit(book.id)}
            className="ti-pencil fs-4 me-3 icon-hover text-success"
          ></i>
          <i
            onClick={() => handleDelete(book.id)}
            className="ti-trash fs-4 me-3 icon-hover text-danger"
          ></i>
        </div>
      ),
    })),
  }), [books]);

  return (
    <React.Fragment>
      <MetaTags>
        <title>Books | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
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
  );
};

export default connect(null, { setBreadcrumbItems })(Book);
