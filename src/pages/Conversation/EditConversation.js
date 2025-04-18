import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Button, FormGroup } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "axios"; // Thêm axios để gọi API
import { useParams, useHistory } from "react-router-dom";
import { adminApis, authAPI } from "helpers/api";

const EditConversation = (props) => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    {title: "Conversation", link:"#"},
    { title: "EditConversation", link: "#" },
  ];
  useEffect(() => {
      props.setBreadcrumbItems("Conversation", breadcrumbItems);
    }, [props]);

  const [loading, setLoading] = useState(false);  
  const { id } = useParams();  
  const history = useHistory(); 

  const [conversation, setConversation] = useState({
    name: "",
    created_at: "",
  });


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
  }, [id]);

  
  const handleChange = (e) => {
    setConversation({ ...conversation, [e.target.name]: e.target.value });
  };


  const handleSave = async () => {
    setLoading(true);
    try {
      await authAPI().patch(adminApis.updateConversation(id), conversation);
      history.push("/conversation"); 
    } catch (error) {
      console.error("Error update conversation:", error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>EditConversation | ThePhamAI</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <h4 className="card-title">Edit Conversation</h4>
              <AvForm onSubmit={handleSave}>
                {/* ConversationName */}
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
                {/* Create_at - only view */}
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
                    <Button color="primary" type="submit" onClick={handleSave} disabled={loading}>
                              {loading ? (
                                <span>Loading...</span>
                              ) : (
                                "Submit"
                              )}
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

export default connect(null, { setBreadcrumbItems })(EditConversation);
