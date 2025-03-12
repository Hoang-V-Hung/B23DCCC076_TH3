import React, { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

interface Appointment {
  id: number;
  date: string;
  time: string;
  staff: string;
  status: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}


const Reports: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointmentStats, setAppointmentStats] = useState<any>({});
  const [revenueStats, setRevenueStats] = useState<any>({});

  useEffect(() => {
    const storedAppointments = localStorage.getItem("appointments");
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }

    const storedServices = localStorage.getItem("services");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }
  }, []);

  useEffect(() => {
    const stats: any = {};
    appointments.forEach((appt) => {
      const date = appt.date;
      stats[date] = (stats[date] || 0) + 1;
    });
    setAppointmentStats(stats);
  }, [appointments]);

  useEffect(() => {
    const stats: any = {};
    services.forEach((service) => {
      stats[service.name] = (stats[service.name] || 0) + service.price;
    });
    setRevenueStats(stats);
  }, [services]);

  return (
    <div>
      <Typography.Title level={3}>Thống kê & Báo cáo</Typography.Title>

      {/* Biểu đồ nhỏ hiển thị lịch hẹn theo ngày */}
      <Typography.Title level={5}>Lịch hẹn theo ngày</Typography.Title>
      <div style={{ width: "300px", height: "200px" }}>
        <Bar
          data={{
            labels: Object.keys(appointmentStats),
            datasets: [
              {
                label: "Số lượng lịch hẹn",
                data: Object.values(appointmentStats),
                backgroundColor: "rgba(75,192,192,0.6)",
              },
            ],
          }}
          options={{ maintainAspectRatio: false }}
        />
      </div>

      {/* Bảng thống kê doanh thu */}
      <Typography.Title level={5} style={{ marginTop: 20 }}>
        Doanh thu theo dịch vụ
      </Typography.Title>
      <Table
        size="small"
        dataSource={Object.keys(revenueStats).map((key) => ({
          service: key,
          revenue: revenueStats[key],
        }))}
        columns={[
          { title: "Dịch vụ", dataIndex: "service", key: "service" },
          { title: "Doanh thu (VND)", dataIndex: "revenue", key: "revenue" },
        ]}
        rowKey="service"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Reports;
