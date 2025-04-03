import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Button, FormGroup } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation"
import { useParams, useHistory } from "react-router-dom";
import { adminApis, authAPI } from "helpers/api";


const EditCategory = (props) => {

  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Category", link: "#" },
    { title: "EditCategory", link: "#" },
  ];
  useEffect(() => {
      props.setBreadcrumbItems("Category", breadcrumbItems);
    }, [props]);
    const { id } = useParams();
    const history = useHistory(); // Sử dụng useHistory để điều hướng
    const [loading, setLoading] = useState(false); 
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
      setLoading(true);
      try {
        await authAPI().patch(adminApis.updateCategory(id), category);       
        history.push("/category"); // Chuyển hướng về danh sách category
      } catch (error) {
        console.error("Lỗi khi cập nhật category:", error);
      }
      finally {
        setLoading(false);
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
              <AvForm>
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
                    <Button color="primary" type="submit" onClick={handleSave} disabled={loading}>
                              {loading ? (
                                <span>Loading...</span> // Hiển thị trạng thái loading
                              ) : (
                                "Submit"
                              )}
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

export default connect(null, { setBreadcrumbItems })(EditCategory);

