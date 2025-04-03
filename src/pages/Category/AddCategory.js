import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, CardBody, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import axios from "axios";
import { adminApis, authAPI } from "helpers/api";

const AddCategory = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required!");
      return;
    }  

    try {
      await authAPI().post(adminApis.createCategory,
        { name },        
      );    
        setSuccess("Category added successfully!");
        setTimeout(() => history.push("/category"), 2000);     
    } catch (err) {
      setError("Error adding category: " + err.message);
    }
    
  };

  return (
    <Card>
      <CardBody>
        <h4>Add New Category</h4>
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-3">
            <Label for="categoryName">Category Name</Label>
            <Input
              type="text"
              id="categoryName"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup >
          <Button color="primary" type="submit" >
            Add Category
          </Button>
          <Button color="secondary" className="ms-2" onClick={() => history.push("/category")}>
            Cancel
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default AddCategory;
