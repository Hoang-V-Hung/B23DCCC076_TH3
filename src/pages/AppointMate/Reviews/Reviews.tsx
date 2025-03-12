import React, { useState, useEffect } from "react";
import { Table, Form, Input, Button, Rate, message, Select } from "antd";

interface Review {
  id: number;
  customerName: string;
  employeeName: string;
  rating: number;
  comment: string;
}

interface Employee {
  id: number;
  name: string;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form] = Form.useForm();

  // Load dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const storedReviews = localStorage.getItem("reviews");
    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews));
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
        localStorage.removeItem("reviews");
      }
    }

    const storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
      try {
        setEmployees(JSON.parse(storedEmployees));
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
        localStorage.removeItem("employees");
      }
    }
  }, []);

  // Cập nhật localStorage khi reviews thay đổi
  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleAddReview = (values: any) => {
    if (!values.customerName || !values.employeeName || !values.rating) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      customerName: values.customerName.trim(),
      employeeName: values.employeeName,
      rating: values.rating,
      comment: values.comment ? values.comment.trim() : "Không có nhận xét",
    };

    setReviews((prev) => {
      const updatedReviews = [...prev, newReview];
      localStorage.setItem("reviews", JSON.stringify(updatedReviews)); // Lưu vào localStorage ngay lập tức
      return updatedReviews;
    });

    message.success("Đánh giá đã được thêm!");
    form.resetFields();
  };

  return (
    <div>
      <h2>Đánh giá dịch vụ</h2>
      <Form form={form} onFinish={handleAddReview} layout="inline">
        <Form.Item
          name="customerName"
          rules={[{ required: true, message: "Nhập tên khách hàng!" }]}
        >
          <Input placeholder="Tên khách hàng" />
        </Form.Item>
        <Form.Item
          name="employeeName"
          rules={[{ required: true, message: "Chọn nhân viên!" }]}
        >
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
        <Form.Item
          name="rating"
          rules={[{ required: true, message: "Chọn đánh giá!" }]}
        >
          <Rate  />
        </Form.Item>
        <Form.Item name="comment">
          <Input placeholder="Nhận xét" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi đánh giá
          </Button>
        </Form.Item>
      </Form>

      <Table
        dataSource={reviews}
        columns={[
          { title: "Khách hàng", dataIndex: "customerName", key: "customerName" },
          {
            title: "Nhân viên",
            dataIndex: "employeeName",
            key: "employeeName",
            render: (name) =>
              employees.some((emp) => emp.name === name) ? (
                name
              ) : (
                <i>Nhân viên không tồn tại</i>
              ),
          },
          {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            render: (rating: number) => <Rate disabled defaultValue={rating} />,
          },
          { title: "Nhận xét", dataIndex: "comment", key: "comment" },
        ]}
        rowKey="id"
      />
    </div>
  );
};

export default Reviews;
