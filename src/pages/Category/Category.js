import React, { useEffect, useState, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Category = (props) => {
  const history = useHistory();
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Category", link: "#" },
  ];

  useEffect(() => {
    props.setBreadcrumbItems("Category", breadcrumbItems);
  }, [props]);

  const [categories, setCategories] = useState([]);
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  useEffect(() => {
    if (!token) {
      console.error("No token found, please login!");
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/category/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          console.error("API không trả về danh sách hợp lệ:", response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategories();
  }, [token]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");

  const handleEdit = (id) => {
    history.push(`/edit-category/${id}`);
  };


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure want to delete this category?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8086/api/category/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Delete successful!");
        setCategories(categories.filter((category) => category.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa category:", error);
        alert("Không thể xóa category. Vui lòng thử lại!");
      }
    }
  };
  const handleCreateCategory = async () => {
    history.push("/add-category")
  };
  const data = useMemo(
    () => ({
      columns: [
        { label: "Name", field: "name", sort: "asc", width: 200 },
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },
        { label: "Actions", field: "actions", width: 150 },
      ],
      rows: categories.map((category) => ({
        name: category.name,
        created_at: formatDate(category.created_at),
        updated_at: formatDate(category.updated_at),
        actions: (
          <div>
            <i
              onClick={() => handleEdit(category.id)}
              className="ti-pencil fs-4 me-3 icon-hover text-success"
            ></i>
            <i
              onClick={() => handleDelete(category.id)}
              className="ti-trash fs-4 me-3 icon-hover text-danger"
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
              <Button color="primary" onClick={() => handleCreateCategory()} className="mb-3 ">
                Add Category
              </Button>
              <MDBDataTable responsive striped bordered data={data} paging={true} entries={10} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(Category);
