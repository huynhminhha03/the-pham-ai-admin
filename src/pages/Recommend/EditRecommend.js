import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Button, FormGroup } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

const EditRecommend = () => {
  const { id } = useParams();
  const history = useHistory();

  const [recommend, setRecommend] = useState({
    title: "",
    description: "",
    created_at: "",
  });

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authUser"))?.token;
        if (!token) {
          alert("No token found, please login!");
          return;
        }
        
        const response = await axios.get(`http://localhost:8086/api/admin/recommend/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setRecommend({
            title: response.data.title,
            description: response.data.description,
            created_at: new Date(response.data.created_at).toLocaleString("vi-VN"),
          });
        }
      } catch (error) {
        console.error("Error fetching recommend data:", error);
      }
    };

    fetchRecommend();
  }, [id]);

  const handleChange = (e) => {
    setRecommend({ ...recommend, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("authUser"))?.token;
      if (!token) {
        alert("No token found, please login!");
        return;
      }

      await axios.put(`http://localhost:8086/api/admin/recommend/${id}`, recommend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Recommendation updated successfully!");
      history.push("/recommendations");
    } catch (error) {
      console.error("Error updating recommendation:", error);
      alert("Failed to update recommendation. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>Edit Recommendation | ThePhamAI</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <h4 className="card-title">Edit Recommendation</h4>
              <AvForm onSubmit={handleSave}>
                {/* Title */}
                <AvField
                  className="mb-3"
                  name="title"
                  label="Title"
                  type="text"
                  value={recommend.title}
                  onChange={handleChange}
                  validate={{
                    required: { value: true, errorMessage: "Title is required" },
                    minLength: { value: 3, errorMessage: "Title must be at least 3 characters" },
                  }}
                />

                {/* Description */}
                <AvField
                  className="mb-3"
                  name="description"
                  label="Description"
                  type="textarea"
                  value={recommend.description}
                  onChange={handleChange}
                  validate={{ required: { value: true, errorMessage: "Description is required" } }}
                />

                {/* Created Date - View Only */}
                <AvField
                  className="mb-3"
                  name="created_at"
                  label="Created Date"
                  type="text"
                  value={recommend.created_at}
                  disabled
                />

                <FormGroup className="mb-0">
                  <div>
                    <Button type="submit" color="primary" className="ms-1">
                      Save
                    </Button>{" "}
                    <Button type="reset" color="secondary" onClick={() => history.push("/recommendations")}>
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

export default EditRecommend;
