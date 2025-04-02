import React, { useEffect, useState, useMemo, useCallback } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";

const Category = (props) => {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page") || 1;
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Category", link: "#" },
  ];

  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(page || 1)
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Số danh mục trên mỗi trang

  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  useEffect(() => {
    props.setBreadcrumbItems("Category", breadcrumbItems);
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [props] [page]);
  // 
  const fetchCategories = useCallback(async () => {
    if (!token) return console.error("No token found, please login!");

    try {
      const response = await axios.get(
        `http://localhost:8086/api/category/all?page=${currentPage}&limit=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response:", response.data); 

      if (response.data && Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
        setTotalPages(response.data.totalPages || 1);
      } else {
        console.error("API không trả về danh sách hợp lệ:", response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  }, [token, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  //
  const handleToggleStatus = async (categoryId) => {
    try {
      const updatedCategory = categories.find((category) => category.id === categoryId);
      const newStatus = !updatedCategory.status;

      const response = await axios.patch(
        `http://localhost:8086/api/category/${categoryId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId ? { ...category, status: newStatus } : category
          )
        );
      } else {
        console.error("Failed to update status:", response);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    history.push(`/category?page=${newPage}`); // Thay đổi URL khi chuyển trang
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

  // 
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:8086/api/category/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Category deleted successfully!");
        fetchCategories(); // Load lại dữ liệu sau khi xóa
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again!");
      }
    }
  };

  const handleCreateCategory = () => {
    history.push("/add-category");
  };

  const handleEdit = (id) => {
    history.push(`/edit-category/${id}`);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");

  // 
  const data = useMemo(
    () => ({
      columns: [
        { label: "Name", field: "name", sort: "asc", width: 200 },
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },
        { label: "Status", field: "status", width: 100 },
        { label: "Actions", field: "actions", width: 150 },
      ],
      rows: categories.map((category) => ({
        name: category.name,
        created_at: formatDate(category.created_at),
        updated_at: formatDate(category.updated_at),
        status: (
          <button
            onClick={() => handleToggleStatus(category.id)}
            style={{
              backgroundColor: category.status ? "green" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {category.status ? "ON" : "OFF"}
          </button>
        ),
        actions: (
          <div>
            <i
              onClick={() => handleEdit(category.id)}
              className="ti-pencil fs-4 me-3 icon-hover text-success"
              style={{ cursor: "pointer" }}
            ></i>
            <i
              onClick={() => handleDelete(category.id)}
              className="ti-trash fs-4 me-3 icon-hover text-danger"
              style={{ cursor: "pointer" }}
            ></i>
          </div>
        ),
      })),
    }),
    [categories]
  );

  return (
    <React.Fragment>
      <MetaTags>
        <title>Category | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <Button color="primary" onClick={handleCreateCategory} className="mb-3">
                Add Category
              </Button>
              <MDBDataTable responsive striped bordered data={data} paging={false} />
              {/* <Row className="mt-3">
                <Col className="d-flex justify-content-center align-items-center">
                  <Button color="secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <span className="mx-3">Page {currentPage} of {totalPages}</span>
                  <Button color="secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                  </Button>
                </Col>
              </Row> */}
              <nav aria-label="Page navigation">
                <Pagination className="d-flex justify-content-end">
                  <PaginationItem disabled={currentPage === 1}>
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
  );
};

export default connect(null, { setBreadcrumbItems })(Category);
