import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Button, FormGroup } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation"
//import { FormGroup, Form } from "redux-form";
import axios from "axios"; // Thêm axios để gọi API
import { useParams, useHistory } from "react-router-dom";
const EditUser = () => {
    const { id } = useParams();
    const history = useHistory(); // Sử dụng useHistory để điều hướng
  
    const [user, setUser] = useState({
      username: "",
      email: "",
      created_at: "",
    });
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const token = JSON.parse(localStorage.getItem("authUser"))?.token;
          const response = await axios.get(`http://localhost:8086/api/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data) {
            setUser({
              username: response.data.username,
              email: response.data.email,
              createdDate: new Date(response.data.created_at).toLocaleString("vi-VN"),
            });
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu user:", error);
        }
      };
  
      fetchUser();
    }, [id]);
    const handleChange = (e) => {
        setUser({ ...user, [e.target.username]: e.target.value });
      };    
    const handleSave = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authUser"))?.token;
        await axios.put(`http://localhost:8086/api/admin/user/${id}`, user, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Cập nhật thành công!");
        history.push("/user"); // Chuyển hướng về danh sách users
      } catch (error) {
        console.error("Lỗi khi cập nhật user:", error);
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
            <h4 className="card-title">Chỉnh sửa thông tin User</h4>
              <AvForm onSubmit={handleSave}>
                {/* username*/}
                <AvField
                  className="mb-3"
                  name="username"
                  label="Username"
                  type="text"
                  value={user.username}
                  onChange={handleChange}
                  validate={{
                    required: { value: true, errorMessage: "username not null" },
                    minLength: { value: 3, errorMessage: "Tên phải có ít nhất 3 ký tự" },
                  }}
                />
                {/* Email */}
                <AvField
                  className="mb-3"
                  name="email"
                  label="Email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  validate={{
                    required: { value: true, errorMessage: "Email không được để trống" },
                    email: { errorMessage: "Email không hợp lệ" },
                  }}
                />

                {/* CreateDate - only view, not Edit */}
                <AvField
                  className="mb-3"
                  name="createdDate"
                  label="Ngày tạo"
                  type="text"
                  value={user.created_at}
                  disabled
                />             
                <FormGroup className="mb-0">
                  <div>
                    <Button type="submit" color="primary" className="ms-1">
                      Submit
                        </Button>{" "}
                    <Button type="reset" color="secondary" onClick={() => history.push("/user")}>
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

export default EditUser;

