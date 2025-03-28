import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody } from "reactstrap";
import { setBreadcrumbItems } from "../../store/actions";
import React, { useEffect } from "react";
import { connect } from "react-redux";

const SystemManagement = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "SystemManagement", link: "#" },
  ]
  useEffect(() => {
      props.setBreadcrumbItems("SystemManagement", breadcrumbItems)
    }, [])  
  return (
    <React.Fragment>
      <MetaTags>
        <title>SystemManagement | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody> 
                //            
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(SystemManagement)