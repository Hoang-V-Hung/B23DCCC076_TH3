import React, { useState, useEffect } from "react";
import { Table, Form, Button, Select, DatePicker, TimePicker, message, Popconfirm } from "antd";
import dayjs from "dayjs";

interface Appointment {
  id: number;
  date: string;
  time: string;
  staff: string;
  service: string;
  status: "Chờ duyệt" | "Xác nhận" | "Hoàn thành" | "Hủy";
}

interface Employee {
  id: number;
  name: string;
  maxAppointmentsPerDay: number;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  // Load dữ liệu từ localStorage
  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }

    const storedServices = localStorage.getItem("services");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }

    const storedAppointments = localStorage.getItem("appointments");
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }
  }, []);

  // Cập nhật localStorage khi danh sách lịch hẹn thay đổi
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  // ✅ Hàm kiểm tra trùng lịch hẹn
  const isDuplicateAppointment = (newAppointment: Appointment) => {
    return appointments.some(
      (appt) =>
        appt.date === newAppointment.date &&
        appt.time === newAppointment.time &&
        appt.staff === newAppointment.staff &&
        (editingId === null || appt.id !== editingId)
    );
  };

  // ✅ Hàm kiểm tra số lượng lịch hẹn tối đa trong ngày
  const isExceedingDailyLimit = (newAppointment: Appointment) => {
    const staffInfo = employees.find((emp) => emp.name === newAppointment.staff);
    if (!staffInfo) return false;

    const dailyAppointments = appointments.filter(
      (appt) => appt.date === newAppointment.date && appt.staff === newAppointment.staff
    );

    return dailyAppointments.length >= staffInfo.maxAppointmentsPerDay;
  };

  // ✅ Hàm xử lý thêm hoặc cập nhật lịch hẹn
  const handleAddOrUpdateAppointment = (values: any) => {
    if (!values.date || !values.time || !values.staff || !values.service) {
      message.error("Vui lòng chọn đầy đủ thông tin!");
      return;
    }

    const formattedAppointment: Appointment = {
      id: editingId ?? Date.now(),
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
      staff: values.staff,
      service: values.service,
      status: "Chờ duyệt",
    };

    // Kiểm tra trùng lịch
    if (isDuplicateAppointment(formattedAppointment)) {
      message.error("Nhân viên đã có lịch hẹn vào thời gian này, vui lòng chọn thời gian khác!");
      return;
    }

    // Kiểm tra số lượng lịch hẹn tối đa/ngày
    if (isExceedingDailyLimit(formattedAppointment)) {
      message.error("Nhân viên đã đạt số lượng lịch hẹn tối đa trong ngày!");
      return;
    }

    // Thêm hoặc cập nhật lịch hẹn
    setAppointments((prev) => {
      const updatedList = editingId
        ? prev.map((appt) => (appt.id === editingId ? formattedAppointment : appt))
        : [...prev, formattedAppointment];

      localStorage.setItem("appointments", JSON.stringify(updatedList));
      return updatedList;
    });

    setEditingId(null);
    message.success(editingId ? "Cập nhật lịch hẹn thành công!" : "Đặt lịch thành công!");
    form.resetFields();
  };

  // Hàm sửa lịch hẹn
  const handleEdit = (record: Appointment) => {
    form.setFieldsValue({
      date: dayjs(record.date),
      time: dayjs(record.time, "HH:mm"),
      staff: record.staff,
      service: record.service,
    });
    setEditingId(record.id);
  };

  // Hàm xóa lịch hẹn
  const handleDelete = (id: number) => {
    setAppointments((prev) => {
      const filtered = prev.filter((appt) => appt.id !== id);
      localStorage.setItem("appointments", JSON.stringify(filtered));
      return filtered;
    });
    message.success("Xóa lịch hẹn thành công!");
  };

  return (
    <div>
      <h2>Quản lý Lịch Hẹn</h2>
      <Form form={form} onFinish={handleAddOrUpdateAppointment} layout="inline">
        <Form.Item name="date" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="time" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item name="staff" rules={[{ required: true }]}>
          <Select placeholder="Chọn nhân viên">
            {employees.length > 0 ? (
              employees.map((emp) => (
                <Select.Option key={emp.id} value={emp.name}>
                  {emp.name}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled>Không có nhân viên</Select.Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item name="service" rules={[{ required: true }]}>
          <Select placeholder="Chọn dịch vụ">
            {services.length > 0 ? (
              services.map((svc) => (
                <Select.Option key={svc.id} value={svc.name}>
                  {svc.name}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled>Không có dịch vụ</Select.Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editingId ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form.Item>
      </Form>

      <Table
        dataSource={appointments}
        columns={[
          { title: "Ngày", dataIndex: "date", key: "date" },
          { title: "Giờ", dataIndex: "time", key: "time" },
          { title: "Nhân viên", dataIndex: "staff", key: "staff" },
          { title: "Dịch vụ", dataIndex: "service", key: "service" },
          {
            title: "Thao tác",
            key: "actions",
            render: (_, record) => (
              <>
                <Button onClick={() => handleEdit(record)}>Sửa</Button>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger style={{ marginLeft: 10 }}>Xóa</Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
        rowKey="id"
      />
    </div>
  );
};

export default Appointments;
