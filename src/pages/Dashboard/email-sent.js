import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody } from "reactstrap";
import ReactApexChart from 'react-apexcharts';
import { adminApis, authAPI } from "helpers/api"; // Sửa theo đúng đường dẫn project của bạn

const MonthlyEarnings = () => {
  const [chartOptions, setChartOptions] = useState({
    chart: { toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    grid: {
      borderColor: '#f8f8fa',
      row: { colors: ['transparent', 'transparent'], opacity: 0.5 }
    },
    xaxis: { categories: [] },
    colors: ['#28bbe3'],
    tooltip: {
      x: {
        format: 'dd/MM'
      }
    }
  });

  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        const res = await authAPI().get(adminApis.conversationStatisticsByDay);
        const data = res?.data;

        // Kiểm tra dữ liệu
        if (
          data &&
          Array.isArray(data.labels) &&
          Array.isArray(data.series) &&
          data.series.length > 0 &&
          Array.isArray(data.series[0].data)
        ) {
          setChartOptions(prev => ({
            ...prev,
            xaxis: { ...prev.xaxis, categories: data.labels }
          }));

          setSeries(data.series);
        } else {
          console.warn("Dữ liệu từ API không hợp lệ:", data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API thống kê conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversationData();
  }, []);

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">Conversation</h4>

        {loading ? (
          <div>Loading chart...</div>
        ) : series.length > 0 ? (
          <div dir="ltr">
            <ReactApexChart
              options={chartOptions}
              series={series}
              type="area"
              height="300"
            />
          </div>
        ) : (
          <div>Không có dữ liệu hiển thị</div>
        )}
      </CardBody>
    </Card>
  );
};

export default MonthlyEarnings;
