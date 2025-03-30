import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Button, FormGroup } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

const EditBanner = () => {
  const { id } = useParams();
  const history = useHistory();

  const [banner, setBanner] = useState({
    title: "",
    imageUrl: "",
    created_at: "",
  });

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authUser"))?.token;
        if (!token) {
          alert("No token found, please login!");
          return;
        }
        
        const response = await axios.get(`http://localhost:8086/api/admin/banner/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setBanner({
            title: response.data.title,
            imageUrl: response.data.imageUrl,
            created_at: new Date(response.data.created_at).toLocaleString("vi-VN"),
          });
        }
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };

    fetchBanner();
  }, [id]);

  const handleChange = (e) => {
    setBanner({ ...banner, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("authUser"))?.token;
      if (!token) {
        alert("No token found, please login!");
        return;
      }

      await axios.put(`http://localhost:8086/api/admin/banner/${id}`, banner, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Banner updated successfully!");
      history.push("/banners");
    } catch (error) {
      console.error("Error updating banner:", error);
      alert("Failed to update banner. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>Edit Banner | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <h4 className="card-title">Edit Banner</h4>
              <AvForm onSubmit={handleSave}>
                {/* Title */}
                <AvField
                  className="mb-3"
                  name="title"
                  label="Title"
                  type="text"
                  value={banner.title}
                  onChange={handleChange}
                  validate={{
                    required: { value: true, errorMessage: "Title is required" },
                    minLength: { value: 3, errorMessage: "Title must be at least 3 characters" },
                  }}
                />

                {/* Image URL */}
                <AvField
                  className="mb-3"
                  name="imageUrl"
                  label="Image URL"
                  type="text"
                  value={banner.imageUrl}
                  onChange={handleChange}
                  validate={{ required: { value: true, errorMessage: "Image URL is required" } }}
                />

                {/* Created Date - View Only */}
                <AvField
                  className="mb-3"
                  name="created_at"
                  label="Created Date"
                  type="text"
                  value={banner.created_at}
                  disabled
                />

                <FormGroup className="mb-0">
                  <div>
                    <Button type="submit" color="primary" className="ms-1">
                      Save
                    </Button>{" "}
                    <Button type="reset" color="secondary" onClick={() => history.push("/banner")}>
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

export default EditBanner;
