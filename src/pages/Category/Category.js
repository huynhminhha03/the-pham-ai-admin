import React, { useEffect, useState, useMemo, useCallback } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import { adminApis, authAPI } from "helpers/api";

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
  const pageSize = 10; 

  useEffect(() => {
    props.setBreadcrumbItems("Category", breadcrumbItems);
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [props] [page]);
  // 
  useEffect(()=>{
    const fetchCategories = async () => {
    try {
      const response = await authAPI().get(
        `${adminApis.allCategories}?page=${currentPage}&limit=${pageSize}`
      );
   
        setCategories(response.data.categories);
        setTotalPages(response.data.totalPages || 1);
    
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  }
    fetchCategories()
  }, [currentPage]);


  //
  const handleToggleStatus = async (categoryId, status) => {
    try {
     await authAPI().patch(
        adminApis.updateCategory(categoryId),
        { status: !status },       
      );      
      setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId ? { ...category, status: !status } : category
          )
        );       
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
      try {
        await authAPI().delete(adminApis.deleteCategory(id));
        setConversations(categories.filter(category => category.id !== id))      
      } catch (error) {
        console.error("Error deleting category:", error);
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
            onClick={() => handleToggleStatus(category.id, category.status)}
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
