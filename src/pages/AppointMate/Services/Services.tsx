import React, { useState, useEffect } from "react";
import { Table, Form, Input, Button, message, Popconfirm } from "antd";

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // Load dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const storedServices = localStorage.getItem("services");
    if (storedServices) {
      try {
        setServices(JSON.parse(storedServices));
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
        localStorage.removeItem("services"); // Xóa dữ liệu lỗi
      }
    }
  }, []);

  // Cập nhật localStorage khi services thay đổi
  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  const handleAddOrUpdateService = (values: any) => {
    if (!values.name || !values.price || !values.duration) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newService: Service = {
      id: editingId ?? Date.now(),
      name: values.name.trim(),
      price: parseFloat(values.price),
      duration: parseInt(values.duration, 10),
    };

    setServices((prev) => {
      const updatedList = editingId
        ? prev.map((svc) => (svc.id === editingId ? newService : svc))
        : [...prev, newService];

      localStorage.setItem("services", JSON.stringify(updatedList));
      return updatedList;
    });

    message.success(editingId ? "Cập nhật dịch vụ thành công!" : "Thêm dịch vụ thành công!");
    setEditingId(null);
    form.resetFields();
  };

  const handleEdit = (record: Service) => {
    form.setFieldsValue({
      name: record.name,
      price: record.price.toString(),
      duration: record.duration.toString(),
    });
    setEditingId(record.id);
  };

  const handleDelete = (id: number) => {
    setServices((prev) => {
      const updatedList = prev.filter((svc) => svc.id !== id);
      localStorage.setItem("services", JSON.stringify(updatedList));
      return updatedList;
    });
    message.success("Xóa dịch vụ thành công!");
  };

  return (
    <div>
      <h2>Quản lý dịch vụ</h2>
      <Form form={form} onFinish={handleAddOrUpdateService} layout="inline">
        <Form.Item name="name" rules={[{ required: true, message: "Nhập tên dịch vụ!" }]}>
          <Input placeholder="Tên dịch vụ" />
        </Form.Item>
        <Form.Item name="price" rules={[{ required: true, message: "Nhập giá!" }]}>
          <Input type="number" placeholder="Giá" />
        </Form.Item>
        <Form.Item name="duration" rules={[{ required: true, message: "Nhập thời gian thực hiện!" }]}>
          <Input type="number" placeholder="Thời gian (phút)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editingId ? "Cập nhật" : "Thêm dịch vụ"}
          </Button>
        </Form.Item>
      </Form>

      <Table
        dataSource={services}
        columns={[
          { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
          { title: "Giá", dataIndex: "price", key: "price" },
          { title: "Thời gian thực hiện (phút)", dataIndex: "duration", key: "duration" },
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

export default Services;
