import { useHistory } from "react-router-dom";
import { Card, CardBody, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import React, { useEffect, useState } from "react";
import { adminApis, authAPI } from "helpers/api";

const AddCategory = (props) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false); 
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    {title: "Category", link: "#"},
    { title: "AddCategory", link: "#" },
  ];
  
  useEffect(() => {
      props.setBreadcrumbItems("AddCategory", breadcrumbItems);
    }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI().post(adminApis.createCategory,
        { name },        
      );
      history.push("/category");     
    } catch (err) {
    }
    finally {
      setLoading(false);
    }
    
  };

  return (
    <Card>
      <CardBody>
        <h4>Add New Category</h4>
        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-3">
            <Label for="categoryName">Category Name</Label>
            <Input
              type="text"
              id="categoryName"
              placeholder="Enter category name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </FormGroup >
          <Button color="primary" type="submit" onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <span>Loading...</span> // Hiển thị trạng thái loading
                    ) : (
                      "Add Category"
                    )}
                  </Button>
          <Button color="secondary" className="ms-2" onClick={() => history.push("/category")}>
            Cancel
          </Button>
        </Form>
      </CardBody>
    </Card>
  )
}

export default connect(null, { setBreadcrumbItems })(AddCategory)
