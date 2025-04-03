import React, { useEffect, useState, useMemo } from "react";
import MetaTags from "react-meta-tags";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import axios from "axios"; 
import { useLocation, useHistory } from "react-router-dom";

const Banner = (props) => {
  const breadcrumbItems = [
    { title: "Thepham AI", link: "#" },
    { title: "Banner", link: "#" },
  ];
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page") || 1;
  const history = useHistory();
  useEffect(() => {
    props.setBreadcrumbItems("Banner", breadcrumbItems);
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [page] [props]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const [banners, setBanners] = useState([]);

  const token = JSON.parse(localStorage.getItem("authUser"))?.token;
  if (!token) {
    console.error("No token found, please login!");
    return;
  }

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/admin/all-banner?page=${currentPage}&limit=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("API Response:", response.data); // Kiểm tra dữ liệu trả về

        if (response.data && Array.isArray(response.data.banners)) {
          setBanners(response.data.banners);
          setTotalPages(response.data.totalPages || 1); // Cập nhật số trang
        } else {
          console.error("API không trả về danh sách hợp lệ:", response.data);
          setBanners([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchBanners();
  }, [token, currentPage]); // 🔥 Gọi API khi `currentPage` thay đổi

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString("vi-VN");

  const handleToggleStatus = async (bannerId) => {
    try {
      const updatedBanner = banners.find((banner) => banner.id === bannerId);
      const newStatus = !updatedBanner.status;

      const response = await axios.patch(
        `http://localhost:8086/api/banner/${bannerId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setBanners((prevBanners) =>
          prevBanners.map((banner) =>
            banner.id === bannerId ? { ...banner, status: newStatus } : banner
          )
        );
      } else {
        console.error("Failed to update banner status:", response);
        alert("Không thể cập nhật trạng thái banner!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái banner:", error);
      alert("Lỗi khi cập nhật trạng thái banner!");
    }
  };

  const handleCreateBanner = () => {
    history.push("/add-banner");
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    history.push(`banner?page=${newPage}`); // Thay đổi URL khi chuyển trang
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage- 1);
    }
  };

  const data = useMemo(
    () => ({
      columns: [
        { label: "Title", field: "title", sort: "asc", width: 200 },
        { label: "Image", field: "image", width: 150 },
        { label: "CreateDate", field: "created_at", sort: "asc", width: 200 },
        { label: "UpdateDate", field: "updated_at", sort: "asc", width: 200 },
        { label: "Status", field: "status", width: 100 },
        { label: "Action", field: "actions", width: 200 },
      ],
      rows: banners.map((banner) => ({
        title: banner.title,
        image: (
          <img
            src={banner.image}
            alt="banner"
            style={{ width: "50px", height: "50px" }}
          />
        ),
        created_at: formatDate(banner.created_at),
        updated_at: formatDate(banner.updated_at),
        status: (
          <button
            onClick={() => handleToggleStatus(banner.id)}
            style={{
              backgroundColor: banner.status ? "green" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {banner.status ? "ON" : "OFF"}
          </button>
        ),
        actions: (
          <div>
            <i
              onClick={() => handleEdit(banner.id)}
              className="ti-pencil fs-4 me-3 icon-hover text-success"
              style={{ cursor: "pointer" }}
            ></i>
            <i
              onClick={() => handleDelete(banner.id)}
              className="ti-trash fs-4 me-3 icon-hover text-danger"
              style={{ cursor: "pointer" }}
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
              <Button color="primary" onClick={handleCreateBanner} className="mb-3">
                Add Banner
              </Button>

              <MDBDataTable
                responsive
                striped
                bordered
                data={data}
                paging={false}
              />
              {/* <Row className="mt-3">
                <Col className="d-flex justify-content-center align-items-center">
                  <Button color="secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <span className="mx-3">Page {currentPage} of {totalPages}</span>
                  <Button color="secondary" onClick={handleNextPage} disabled={currentPage >= totalPages}>
                    Next
                  </Button>
                </Col>
              </Row> */}
              <nav aria-label="Page navigation">
                <Pagination className="d-flex justify-content-end">
                  <PaginationItem disabled={currentPage === 1} >
                    <PaginationLink previous onClick={handlePrevPage}>Previous</PaginationLink>
                  </PaginationItem>

                  {[...Array(totalPages).keys()].map((page) => (
                    <PaginationItem key={page + 1} active={currentPage === page + 1}>
                      <PaginationLink onClick={() => handlePageChange(page + 1)}>
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem disabled={currentPage === totalPages} >
                    <PaginationLink next onClick={handleNextPage}>Next</PaginationLink>
                  </PaginationItem>
                </Pagination>
              </nav>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(Banner);
