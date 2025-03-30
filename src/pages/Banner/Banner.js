import React, { useEffect, useState, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import axios from "axios"; // Thêm axios để gọi API
import { useHistory } from "react-router-dom";
import actions from "redux-form/lib/actions";



const Banner = props => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Banner", link: "#" },
  ]
  const history = useHistory();
  useEffect(() => {
    props.setBreadcrumbItems("Banner", breadcrumbItems)
  }, [])
  const [banners, setBanners] = useState([]);

    const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    if (!token) {
      console.error("No token found, please login!");
      return;
    }
    useEffect(() => {
      const fetchBanners = async () => {
        try {
          const response = await axios.get("http://localhost:8086/api/admin/banners/all", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data && Array.isArray(response.data.banners)) {
            setBanners(response.data.banners); // Lấy danh sách từ response.data.users
          } else {
            console.error("API không trả về danh sách hợp lệ:", response.data);
            setBanners([]); // Gán mảng rỗng để tránh lỗi hiển thị
          }
        } catch (error) {
          console.error("Error fetching data:", error);
         
        }
      };
    
      if (token) {
        fetchUsers();
      }
    }, [token]);
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");
    const handleToggleStatus = (bannerId) => {
      setBanners((prevBanners) =>
        prevBanners.map((banner) =>
          banners.id === bannerId ? { ...banner, isActive: !banner.isActive } : banner
        )
      );
    };
    const data = useMemo(() => ({
      columns: [
        { label: "Bannername", field: "bannername", sort: "asc", width: 150 },
        { label: "Imgage", field: "bannerImg", sort: "asc", width: 150},
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },
        { label: "Status", field: "status", sort: "asc", width: 100 },
        {
          label: "Action",
          field: "actions",
          width: 200,
        },
         
      ],
      rows: banners.map((banners) => ({
        bannername: banners.bannername, 
        bannerImg: banners.bannerImg,     
        created_at: formatDate(banners.created_at),
        updated_at: formatDate(banners.updated_at),
        status: (
          <button
            onClick={() => handleToggleStatus(banners.id)}
            style={{
              backgroundColor: banners.isActive ? "green" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {banners.isActive ? "ON" : "OFF"}
          </button>
        ),            
        actions: (
          <div>
            <i
              onClick={() => handleEdit(banners.bannernamename)}
              className="ti-pencil fs-4 me-3 icon-hover text-success"             
            >           
            </i>
            <i
              onClick={() => handleDelete(banners.bannernamename)}
              className="ti-trash fs-4 me-3 icon-hover text-danger"
            >
            </i>
          </div>
        ),                
      })),
    }), [banners]);
    const handleEdit = (id) => {
      history.push(`/edit-banner/${id}`); // Navigate to the edit page
    };
  
    // Hàm xử lý khi nhấn nút "Xóa"
    const handleDelete = async (id) => {
      const confirmDelete = window.confirm("Are you sure want to delete this banners?");
      if (confirmDelete) {
        try {
          const token = JSON.parse(localStorage.getItem("authUser"))?.token;
          await axios.delete(`http://localhost:8086/api/admin/banner/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Delete successfull!");
          // Update listUser after delete banners
          setBanners(banners.filter((banners) => banners.id !== id));
        } catch (error) {
          console.error("Lỗi khi xóa banners:", error);
          alert("Không thể xóa banners. Vui lòng thử lại!");
        }
      }
    };
  
  
  return (
    <React.Fragment>
      <MetaTags>
        <title>Banner | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <MDBDataTable responsive striped bordered data={data} paging={true} entries={10} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(User)
