import React, { useState, useEffect } from "react";
import { Table, Form, Input, Button, message, Popconfirm } from "antd";

interface Employee {
  id: number;
  name: string;
  maxAppointmentsPerDay: number;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // Load dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
      try {
        setEmployees(JSON.parse(storedEmployees));
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
        localStorage.removeItem("employees"); // Xóa dữ liệu lỗi
      }
    }
  }, []);

  // Cập nhật localStorage khi employees thay đổi
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const handleAddOrUpdateEmployee = (values: any) => {
    if (!values.name || !values.maxAppointmentsPerDay) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newEmployee: Employee = {
      id: editingId ?? Date.now(),
      name: values.name.trim(),
      maxAppointmentsPerDay: parseInt(values.maxAppointmentsPerDay, 10),
    };

    setEmployees((prev) => {
      const updatedList = editingId
        ? prev.map((emp) => (emp.id === editingId ? newEmployee : emp))
        : [...prev, newEmployee];

      localStorage.setItem("employees", JSON.stringify(updatedList));
      return updatedList;
    });

    message.success(editingId ? "Cập nhật nhân viên thành công!" : "Thêm nhân viên thành công!");
    setEditingId(null);
    form.resetFields();
  };

  const handleEdit = (record: Employee) => {
    form.setFieldsValue({
      name: record.name,
      maxAppointmentsPerDay: record.maxAppointmentsPerDay.toString(),
    });
    setEditingId(record.id);
  };

  const handleDelete = (id: number) => {
    setEmployees((prev) => {
      const updatedList = prev.filter((emp) => emp.id !== id);
      localStorage.setItem("employees", JSON.stringify(updatedList));
      return updatedList;
    });
    message.success("Xóa nhân viên thành công!");
  };

  return (
    <div>
      <h2>Quản lý nhân viên</h2>
      <Form form={form} onFinish={handleAddOrUpdateEmployee} layout="inline">
        <Form.Item name="name" rules={[{ required: true, message: "Nhập tên nhân viên!" }]}>
          <Input placeholder="Tên nhân viên" />
        </Form.Item>
        <Form.Item name="maxAppointmentsPerDay" rules={[{ required: true, message: "Nhập giới hạn lịch hẹn!" }]}>
          <Input type="number" placeholder="Giới hạn lịch hẹn/ngày" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editingId ? "Cập nhật" : "Thêm nhân viên"}
          </Button>
        </Form.Item>
      </Form>

      <Table
        dataSource={employees}
        columns={[
          { title: "Tên nhân viên", dataIndex: "name", key: "name" },
          { title: "Giới hạn lịch hẹn/ngày", dataIndex: "maxAppointmentsPerDay", key: "maxAppointmentsPerDay" },
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
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default Employees;
