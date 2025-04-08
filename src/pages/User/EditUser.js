import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { setBreadcrumbItems } from "../../store/actions"
import MetaTags from "react-meta-tags"
import { Row, Col, Card, CardBody, Button, FormGroup, Label } from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"

import { useParams, useHistory } from "react-router-dom"
import { adminApis, authAPI } from "helpers/api"
const EditUser = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "User", link: "#" },
    { title: "EditUser", link: "#" },
  ]
  useEffect(() => {
    props.setBreadcrumbItems("User", breadcrumbItems)
  }, [])

  const { id } = useParams()
  const history = useHistory() // Sử dụng useHistory để điều hướng

  const [user, setUser] = useState({
    username: "",
    password: "",
    created_at: "",
    status: "",
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI().get(adminApis.getUserById(id))
        setUser({
          username: response.data.username,
          password: "",
          created_at: new Date(response.data.created_at).toLocaleString(
            "vi-VN"
          ),
          status: response.data.status,
        })
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu user:", error)
      }
    }

    fetchUser()
  }, [id])

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleToggleStatus = () => {
    setUser(prevUser => ({
      ...prevUser,
      status: !prevUser.status,
    }))
  }

  const handleSave = async () => {
    try {
      const updatedUser = { ...user }
      if (!updatedUser.password) {
        delete updatedUser.password
      }
      await authAPI().patch(adminApis.updateUser(id), updatedUser)
      history.push("/user")
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error)
    }
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>EditCategory | ThePhamAI</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <h4 className="card-title">Edit User</h4>
              <AvForm>
                {/* username*/}
                <AvField
                  className="mb-4"
                  name="username"
                  label="Username"
                  type="text"
                  value={user.username}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "username not null",
                    },
                    minLength: {
                      value: 3,
                      errorMessage: "Tên phải có ít nhất 3 ký tự",
                    },
                  }}
                />
                {/* Email */}
                <AvField
                  className="mb-4"
                  name="password"
                  label="Password"
                  type="password"
                  value={user.password}
                  onChange={handleChange}
                />

                {/* CreateDate - only view, not Edit */}
                <AvField
                  className="mb-4"
                  name="createdDate"
                  label="Ngày tạo"
                  type="text"
                  value={user.created_at}
                  disabled
                />
                <FormGroup className="mb-4">
                  <Label className="mb-3 me-3">Status</Label>
                  <button
                    onClick={() => handleToggleStatus()}
                    style={{
                      backgroundColor: user.status ? "green" : "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {user.status ? "ON" : "OFF"}
                  </button>
                </FormGroup>

                <FormGroup className="mb-0">
                  <div>
                    <Button
                      type="submit"
                      color="primary"
                      className="ms-1"
                      onClick={handleSave}
                    >
                      Submit
                    </Button>{" "}
                    <Button
                      type="reset"
                      color="secondary"
                      onClick={() => history.push("/user")}
                    >
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

export default connect(null, { setBreadcrumbItems })(EditUser)
