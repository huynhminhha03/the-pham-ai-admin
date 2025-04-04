import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useState, useEffect } from "react"
import { Row, Col, Card, Alert, CardBody, Media, Button } from "reactstrap"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// Redux
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

import avatar from "../../assets/images/users/user-1.jpg"
// actions
import { editProfile, resetProfileFlag } from "../../store/actions"

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions"
import { authAPI, userApis } from "helpers/api"

const UserProfile = props => {
  const [user, setUser] = useState()
  const [username, setUsername] = useState("")
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI().get(userApis.currentUser)
        setUser(response?.data?.user)
        console.log("User data:", response.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
    fetchUser()
  }, [])

  const updateUser = async () => {
    try {
      await authAPI().patch(userApis.updateCurrentUser, {
        username: username,
      })
      setUser({ ...user, username: username })
    } catch (error) {
      console.error("Error updating user data:", error)
    }
  }

  const breadcrumbItems = [
    { title: "The Pham AI", link: "#" },
    { title: "Profile", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems("Profile", breadcrumbItems)
  })

  
  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Profile | ThePhamAI
        </title>
      </MetaTags>

      <Row>
        <Col lg="12">
          {props.error && props.error ? (
            <Alert color="danger">{props.error}</Alert>
          ) : null}
          {props.success ? (
            <Alert color="success">{props.success}</Alert>
          ) : null}

          <Card>
            <CardBody>
              <Media>
                <div className="ms-3">
                  <img
                    src={avatar}
                    alt=""
                    className="avatar-md me-3 rounded-circle img-thumbnail"
                  />
                </div>
                <Media body className="align-self-center">
                  <div className="text-muted">
                    <h5>{user?.username}</h5>
                    <p className="mb-1">{user?.email}</p>
                    <p className="mb-0">Id: #{user?.id}</p>
                  </div>
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <h4 className="card-title mb-4">Change User Name</h4>

      <Card>
        <CardBody>
          <AvForm
            className="form-horizontal"
            
          >
            <div className="form-group">
              <AvField
                name="username"
                label="User Name"
                value={user?.username}
                onChange={e => setUsername(e.target.value)}
                className="form-control"
                placeholder="Enter User Name"
                type="text"
                required
              />
              <AvField name="idx" value={user?.id} type="hidden" />
            </div>
            <div className="text-center mt-4">
              <Button type="submit" color="danger" onClick={updateUser}>
                Edit User Name
              </Button>
            </div>
          </AvForm>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

// UserProfile.propTypes = {
//   editProfile: PropTypes.func,
//   error: PropTypes.any,
//   success: PropTypes.any,
// }

// const mapStatetoProps = state => {
//   const { error, success } = state.Profile
//   return { error, success }
// }

// export default withRouter(
//   connect(mapStatetoProps, {
//     resetProfileFlag,
//     setBreadcrumbItems,
//   })(UserProfile)
// )

export default connect(null, { setBreadcrumbItems })(UserProfile)

