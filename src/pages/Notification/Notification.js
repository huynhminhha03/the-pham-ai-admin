import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody } from "reactstrap";
import { setBreadcrumbItems } from "../../store/actions";
import React, { useEffect } from "react";
import { connect } from "react-redux";

const Notification = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Notification", link: "#" },
  ]
  useEffect(() => {
      props.setBreadcrumbItems("Notification", breadcrumbItems)
    }, [])  
  return (
    <React.Fragment>
      <MetaTags>
        <title>Notification | ThePhamAI</title>
      </MetaTags>
      <Row>
        <Col className="col-12">
          <Card>
            <CardBody> 
                      
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(Notification)