import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Button, FormGroup } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

const EditBook = () => {
  const { id } = useParams();
  const history = useHistory();

  const [book, setBook] = useState({
    title: "",
    author: "",
    published_at: "",
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authUser"))?.token;
        if (!token) {
          alert("No token found, please login!");
          return;
        }
        
        const response = await axios.get(`http://localhost:8086/api/admin/book/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setBook({
            title: response.data.title,
            author: response.data.author,
            published_at: new Date(response.data.published_at).toLocaleString("vi-VN"),
          });
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("authUser"))?.token;
      if (!token) {
        alert("No token found, please login!");
        return;
      }

      await axios.put(`http://localhost:8086/api/admin/book/${id}`, book, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Book updated successfully!");
      history.push("/books");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>Edit Book | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <h4 className="card-title">Edit Book</h4>
              <AvForm onSubmit={handleSave}>
                {/* Title */}
                <AvField
                  className="mb-3"
                  name="title"
                  label="Title"
                  type="text"
                  value={book.title}
                  onChange={handleChange}
                  validate={{
                    required: { value: true, errorMessage: "Title is required" },
                    minLength: { value: 3, errorMessage: "Title must be at least 3 characters" },
                  }}
                />

                {/* Author */}
                <AvField
                  className="mb-3"
                  name="author"
                  label="Author"
                  type="text"
                  value={book.author}
                  onChange={handleChange}
                  validate={{ required: { value: true, errorMessage: "Author is required" } }}
                />

                {/* Published Date - View Only */}
                <AvField
                  className="mb-3"
                  name="published_at"
                  label="Published Date"
                  type="text"
                  value={book.published_at}
                  disabled
                />

                <FormGroup className="mb-0">
                  <div>
                    <Button type="submit" color="primary" className="ms-1">
                      Save
                    </Button>{" "}
                    <Button type="reset" color="secondary" onClick={() => history.push("/books")}>
                      Cancel
                    </Button>
                  </div>
                </FormGroup>
              </AvForm>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default EditBook;
