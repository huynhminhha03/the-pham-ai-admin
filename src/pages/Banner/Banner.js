import React, { useEffect, useState, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import axios from "axios"; 
import { useHistory } from "react-router-dom";

const Banner = (props) => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Banner", link: "#" },
  ];

  const history = useHistory();
  useEffect(() => {
    props.setBreadcrumbItems("Banner", breadcrumbItems);
  }, []);

  const [banners, setBanners] = useState([]);
 

  const token = JSON.parse(localStorage.getItem("authUser"))?.token;
  if (!token) {
    console.error("No token found, please login!");
    return;
  }

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/banner/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.banners)) {
          setBanners(response.data.banners);
        } else {
          console.error("API không trả về danh sách hợp lệ:", response.data);
          setBanners([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    if (token) {
      fetchBanners();
    }
  }, [token]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");

  const handleToggleStatus = (bannerId) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner) =>
        banner.id === bannerId ? { ...banner, isActive: !banner.isActive } : banner
      )
    );
  };

  const handleCreateBanner = async () => {
    history.push("/add-banner")
  };

  const handleEdit = (id) => {
    history.push(`/edit-banner/${id}`); 
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa banner này?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8086/api/banner/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("Xóa thành công!");
        setBanners(banners.filter((banner) => banner.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa banner:", error);
        alert("Không thể xóa banner. Vui lòng thử lại!");
      }
    }
  };

  const data = useMemo(
    () => ({
      columns: [
        { label: "Title", field: "title", sort: "asc", width: 200, },
        { label: "Image", field: "image", width: 150, },
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200, },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200, },
        { label: "Status", field: "status", width: 100, },
        { label: "Action", field: "actions", width: 200, },
      ],
      rows: banners.map((banner) => ({
        title: banner.title,
        image: <img src={banner.image} alt="banner" style={{ width: "50px", height: "50px" }} />,
        created_at: formatDate(banner.created_at),
        updated_at: formatDate(banner.updated_at),
        status: (
          <button
            onClick={() => handleToggleStatus(banner.id)}
            style={{
              backgroundColor: banner.isActive ? "green" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {banner.isActive ? "ON" : "OFF"}
          </button>
        ),
        actions: (
          <div>
            <i
              onClick={() => handleEdit(banner.id)}
              className="ti-pencil fs-4 me-3 icon-hover text-success"
            ></i>
            <i
              onClick={() => handleDelete(banner.id)}
              className="ti-trash fs-4 me-3 icon-hover text-danger"
            ></i>
          </div>
        ),
      })),
    }),
    [banners]
  );

  return (
    <React.Fragment>
      <MetaTags>
        <title>Banner | ThePhamAI - Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              {/* Nút mở modal */}
              <Button color="primary" onClick={() => handleCreateBanner()} className="mb-3 ">
                Add Banner
              </Button>

              {/* Bảng danh sách banner */}
              <MDBDataTable responsive striped bordered data={data} paging={true} entries={10} />
            </CardBody>
          </Card>
        </Col>
      </Row>       
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(Banner);
