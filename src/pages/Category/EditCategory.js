import React, { useEffect, useState, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Button, FormGroup } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation"
//import { FormGroup, Form } from "redux-form";
import axios from "axios"; // Thêm axios để gọi API
import { useParams, useHistory } from "react-router-dom";
import { adminApis, authAPI } from "helpers/api";


const EditCategory = () => {
    const { id } = useParams();
    const history = useHistory(); // Sử dụng useHistory để điều hướng
  
    const [category, setCategory] = useState({
      name: "", 
      created_at: "",
    });
    useEffect(() => {
      const fetchCategory = async () => {
        try {                
          const response = await authAPI().get(adminApis.getCategoryById(id));        
            
          setCategory({
              name: response.data.cate.name,             
              created_at: new Date(response.data.cate.created_at).toLocaleString("vi-VN"),
            });          
        } catch (error) {
          console.error("Error get data category:", error);
        }
      };
  
      fetchCategory();
    }, [id]);
    const handleChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
      };    
    const handleSave = async () => {
      try {
        await authAPI().patch(adminApis.updateCategory(id), category);       
        history.push("/category"); // Chuyển hướng về danh sách category
      } catch (error) {
        console.error("Lỗi khi cập nhật category:", error);
      }
    };
    
  return (
    <React.Fragment>
      <MetaTags>
        <title>EditCategory | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>      
            <CardBody>
            <h4 className="card-title">Edit Category</h4>
              <AvForm onSubmit={handleSave}>
                {/* Catename*/}
                <AvField
                  className="mb-3"
                  name="name"
                  label="CategoryName"
                  type="text"
                  value={category.name}
                  onChange={handleChange}
                  validate={{
                    required: { value: true, errorMessage: "CategoryName not null" },
                    minLength: { value: 3, errorMessage: "Tên phải có ít nhất 3 ký tự" },
                  }}
                />                
                {/* CreateDate - only view, not Edit */}
                <AvField
                  className="mb-3"
                  name="created_at"
                  label="CreatedDate"
                  type="text"
                  value={category.created_at}
                  disabled
                />             
                <FormGroup className="mb-0">
                  <div>
                    <Button type="submit" color="primary" className="ms-1">
                      Submit
                        </Button>{" "}
                    <Button type="reset" color="secondary" onClick={() => history.push("/category")}>
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
  )
}

export default EditCategory;

