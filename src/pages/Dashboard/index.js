import React , {useState , useEffect} from "react"
import MetaTags from 'react-meta-tags';
import { connect } from "react-redux";
import {
  Row,
  Col,
} from "reactstrap"

// Pages Components
import Miniwidget from "./Miniwidget"
import MonthlyEarnings from "./montly-earnings";
import EmailSent from "./email-sent";
import MonthlyEarnings2 from "./montly-earnings2";
import Inbox from "./inbox";
import RecentActivity from "./recent-activity";
import WidgetUser from "./widget-user";
import YearlySales from "./yearly-sales";
import LatestTransactions from "./latest-transactions";
import LatestOrders from "./latest-orders";

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";
import { adminApis, authAPI } from "helpers/api";
import { error } from "toastr";

const Dashboard = (props) => {

  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Dashboard", link: "#" }
  ]
  

  useEffect(() => {
    props.setBreadcrumbItems('Dashboard' , breadcrumbItems)
  },[props])
 
  const [countUsers, setCountUsers ] = useState();
  const [countConversation, setCountConversation ] = useState();
  const [countBook, setCountBook ] = useState();
  const [countBanner, setCountBanner ] = useState();
  useEffect(() =>{
    const fetchCountUsers = async () => {
      try {
        const response = await authAPI().get(
          adminApis.countAllUsers);
        setCountUsers(response.data.count);
        console.log(countUsers)     
      }
      catch(err){
        console.error("Error get data", error);
      }
    }
    fetchCountUsers()

    const fetchCountConversation = async() => {
      try{
        const response = await authAPI().get(adminApis.countAllConversations);
        setCountConversation(response.data.count)
      }catch(err){
        console.error("Error get data", error)
      }
    }
    fetchCountConversation()

    const fetchCountBook = async() => {
      try{
        const response = await authAPI().get(adminApis.countAllBooks);
        setCountBook(response.data.count)
      }catch(err){
        console.error("Error get data", error)
      }
    }
    fetchCountBook()

    const fetchCountBanner = async() => {
      try{
        const response = await authAPI().get(adminApis.countAllBooks);
        setCountBanner(response.data.count)
      }catch(err){
        console.error("Error get data", error)
      }
    }
    fetchCountBanner()
  },[])


  const reports = [
    { title: "User", iconClass: "cube-outline", total: countUsers || "0", average: "+11%", badgecolor: "info" },
    { title: "Conversation", iconClass: "buffer", total: countConversation || "0", average: "-29%", badgecolor: "danger" },
    { title: "Book", iconClass: "tag-text-outline", total: countBook || "0", average: "0%", badgecolor: "warning" },
    { title: "Banner", iconClass: "briefcase-check", total: countBanner || "0", average: "+89%", badgecolor: "info" },
  ]

  return (
    <React.Fragment>

      <MetaTags>
        <title>Dashboard | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      {/*mimi widgets */}
      <Miniwidget reports={reports} />

      <Row>
        <Col xl="3">
          {/* Monthly Earnings */}
          <MonthlyEarnings />
        </Col>

        <Col xl="6">
          {/* Email sent */}
          <EmailSent />
        </Col>

        <Col xl="3">
          <MonthlyEarnings2 />
        </Col>

      </Row>
      <Row>

        <Col xl="4" lg="6">
          {/* inbox */}
          <Inbox />
        </Col>
        <Col xl="4" lg="6">
          {/* recent activity */}
          <RecentActivity />

        </Col>
        <Col xl="4">
          {/* widget user */}
          <WidgetUser />

          {/* yearly sales */}
          <YearlySales />
        </Col>
      </Row>

      <Row>
        <Col xl="6">
          {/* latest transactions */}
          <LatestTransactions />
        </Col>

        <Col xl="6">
          {/* latest orders */}
          <LatestOrders />
        </Col>
      </Row>

    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(Dashboard);