import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Button, FormGroup } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "axios"; // Thêm axios để gọi API
import { useParams, useHistory } from "react-router-dom";
import { adminApis, authAPI } from "helpers/api";

const EditConversation = () => {
  const { id } = useParams();  // Lấy id từ URL
  const history = useHistory(); // Sử dụng useHistory để điều hướng

  const [conversation, setConversation] = useState({
    name: "",
    created_at: "",
  });

  // Hàm để lấy thông tin cuộc trò chuyện từ API
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await authAPI().get(adminApis.updateConversation(id));       
          
        setConversation({
            name: response.data.conversation.name,
            created_at: new Date(response.data.conversation.created_at).toLocaleString("vi-VN"),
          });       
      } catch (error) {
        console.error("Error get data conversation:", error);
      }
    };
    fetchConversation();
  }, []);

  // Hàm để cập nhật giá trị khi người dùng nhập vào
  const handleChange = (e) => {
    setConversation({ ...conversation, [e.target.name]: e.target.value });
  };

  // Hàm lưu thông tin đã chỉnh sửa
  const handleSave = async () => {
    try {
      await authAPI().patch(adminApis.updateConversation(id), conversation);
      history.push("/conversation"); 
    } catch (error) {
      console.error("Lỗi khi cập nhật conversation:", error);
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>EditConversation | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <h4 className="card-title">Edit Conversation</h4>
              <AvForm onSubmit={handleSave}>
                {/* Tên cuộc trò chuyện */}
                <AvField
                  className="mb-3"
                  name="name"
                  label="Conversation Name"
                  type="text"
                  value={conversation.name}
                  onChange={handleChange}
                  validate={{
                    required: { value: true, errorMessage: "Conversation Name không được để trống" },
                    minLength: { value: 3, errorMessage: "Tên phải có ít nhất 3 ký tự" },
                  }}
                />
                {/* Ngày tạo - chỉ hiển thị, không chỉnh sửa */}
                <AvField
                  className="mb-3"
                  name="created_at"
                  label="CreatedDate"
                  type="text"
                  value={conversation.created_at}
                  disabled
                />
                <FormGroup className="mb-0">
                  <div>
                    <Button type="submit" color="primary" className="ms-1">
                      Submit
                    </Button>{" "}
                    <Button type="reset" color="secondary" onClick={() => history.push("/conversation")}>
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

export default EditConversation;
