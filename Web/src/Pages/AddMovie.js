import React from "react";
import { Form, Input, Button, Select, DatePicker, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const AddMovie = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form values:", values);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Thêm Phim Mới</h2>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            label="Tên phim"
            name="name"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Vui lòng nhập tên phim!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Thời lượng"
            name="durationFormatted"
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            label="Độ tuổi"
            name="ageLimit"
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Đánh giá"
            name="rating"
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            label="Ngôn ngữ"
            name="languages"
            style={{ flex: 1 }}
            >
            <Select
                mode="multiple"
                allowClear
                placeholder="Chọn ngôn ngữ"
                defaultValue={["Vietnamese"]}>
                <Option value="Vietnamese">Tiếng Việt</Option>
                <Option value="English">Tiếng Anh</Option>
                <Option value="Korean">Tiếng Hàn</Option>
                <Option value="Japanese">Tiếng Nhật</Option>
                <Option value="Chinese">Tiếng Trung</Option>
                <Option value="French">Tiếng Pháp</Option>
            </Select>
            </Form.Item>

          <Form.Item
            label="Phụ đề"
            name="subtitle"
            style={{ flex: 1 }}
          >
            <Input defaultValue="Vietnamese" />
          </Form.Item>
        </div>

        <Form.Item label="Cốt truyện" name="description">
          <TextArea rows={3} />
        </Form.Item>

        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            label="Thể Loại"
            name="genres"
            style={{ flex: 1 }}
          >
            <Select
              mode="multiple"
              placeholder="Chọn thể loại"
              allowClear
              defaultValue={["Hành Động", "Kinh Dị"]}
            >
              <Option value="Hành Động">Hành Động</Option>
              <Option value="Kinh Dị">Kinh Dị</Option>
              <Option value="Anime">Anime</Option>
              <Option value="Hoạt Hình">Hoạt Hình</Option>
              <Option value="Tình Cảm">Tình Cảm</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Định dạng phim"
            name="format"
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            label="Nhà sản xuất"
            name="producers"
            style={{ flex: 1 }}
          >
            <Select
              mode="multiple"
              placeholder="Chọn nhà sản xuất"
              allowClear
              defaultValue={["Ngô Phì", "Châu Tinh Trì"]}
            >
              <Option value="Ngô Phì">Ngô Phì</Option>
              <Option value="Châu Tinh Trì">Châu Tinh Trì</Option>
              <Option value="Pat Boonmitpat">Pat Boonmitpat</Option>
              <Option value="Putthipong">Putthipong Assaratanakul</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Diễn viên"
            name="actors"
            style={{ flex: 1 }}
          >
            <Select
              mode="multiple"
              placeholder="Chọn diễn viên"
              allowClear
              defaultValue={["Lê Phong", "Lee Hyun Wook"]}
            >
              <Option value="Lê Phong">Lê Phong</Option>
              <Option value="Gang Dong Won">Gang Dong Won</Option>
              <Option value="Lee Jong Suk">Lee Jong Suk</Option>
              <Option value="Lee Hyun Wook">Lee Hyun Wook</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="Ngày phát hành" name="releaseDate">
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>

        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item label="Hình ảnh" name="image" valuePropName="file">
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn tệp</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Trailer" name="trailer" valuePropName="file">
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn tệp</Button>
            </Upload>
          </Form.Item>
        </div>

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Thêm phim
          </Button>
          <Button type="default">Quay lại</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddMovie;
