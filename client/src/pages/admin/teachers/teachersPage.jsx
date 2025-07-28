"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Table, Space, Button, Modal, Tag, message, Avatar, Form, Input, Card, Typography, Tooltip, Select, Upload, Switch } from "antd"
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  LockOutlined,
  UserAddOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  CrownOutlined,
  BookOutlined,
  TeamOutlined,
  UploadOutlined,
  LoadingOutlined 

} from "@ant-design/icons"
import axios from "axios"
import toast from "react-hot-toast"
import uploadMediaToSupabase from "../../../utils/mediaUpload "
import "./TeachersPage.css"


const { Title, Text } = Typography
const { Option } = Select

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false)
  const [isEditTeacherModalOpen, setIsEditTeacherModalOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const navigate = useNavigate()

  // Color scheme
  const primaryColor = "#6366f1" // Purple
  const secondaryColor = "#3b82f6" // Blue
  const successColor = "#10b981" // Emerald
  const dangerColor = "#ef4444" // Red

  const getAvatarColor = (username) => {
    if (!username) return primaryColor
    const colors = [primaryColor, secondaryColor, successColor, "#8b5cf6", "#ec4899"]
    const charCode = username.charCodeAt(0)
    return colors[charCode % colors.length]
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const { data } = await axios.get("http://localhost:5080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const teacherData = data.filter((user) => user.role === "teacher")
      setTeachers(teacherData)
    } catch (error) {
      console.error("Error:", error.response?.data || error.message)
      message.error("Failed to load teachers. Check console for details.")
      if (error.response?.status === 401) {
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete teacher "${name}"?`)

    if (!confirmDelete) return

    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5080/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success(`Teacher "${name}" deleted successfully`)
      fetchTeachers()
    } catch (error) {
      console.error("Error deleting teacher:", error)
      toast.error("Failed to delete teacher")
    } finally {
      setLoading(false)
    }
  }

  const showModal = (teacher) => {
    setSelectedTeacher(teacher)
    setIsModalOpen(true)
  }

  const handleAddTeacher = () => {
    setIsAddTeacherModalOpen(true)
  }

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher)
    editForm.setFieldsValue({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      role: teacher.role,
      userExperience: teacher.userExperience,
      gender: teacher.gender,
      subject: teacher.subject,
      img: teacher.img,
      isBlocked: teacher.isBlocked || false, // Add status to form
      password: '' // Empty password field (optional to change)
    })
    setImageUrl(teacher.img || '')
    setIsEditTeacherModalOpen(true)
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options
    try {
      setUploading(true)
      const url = await uploadMediaToSupabase(file)
      onSuccess(url, file)
      setImageUrl(url)
      setUploading(false)
    } catch (error) {
      onError(error)
      setUploading(false)
      message.error('Upload failed')
    }
  }

  const onAddTeacherFinish = async (values) => {
  if (uploading) {
    message.error('Please wait for image upload to complete');
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    // Prepare the complete data object
    const teacherData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      gender: values.gender,
      role: "teacher",
      img: imageUrl,
      subject: values.subject,  // Ensure subject is included
      userExperience: values.userExperience,  // Ensure experience is included
      isBlocked: values.isBlocked || false
    };

    const response = await axios.post(
      "http://localhost:5080/api/users/register", 
      teacherData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    toast.success("Teacher added successfully");
    setIsAddTeacherModalOpen(false);
    form.resetFields();
    setImageUrl('');
    fetchTeachers();
  } catch (error) {
    console.error("Error adding teacher:", error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        "Failed to add teacher";
    message.error(errorMessage);
  } finally {
    setLoading(false);
  }
}

  const onEditTeacherFinish = async (values) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      // Prepare the data to send
      const teacherData = {
        ...values,
        img: imageUrl ,// Use the uploaded image URL
        isBlocked: values.isBlocked 
      }
       if (!values.password) {
        delete teacherData.password
      }


      await axios.put(`http://localhost:5080/api/users/${editingTeacher._id}`, teacherData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      toast.success("Teacher updated successfully")
      setIsEditTeacherModalOpen(false)
      editForm.resetFields()
      setEditingTeacher(null)
      setImageUrl('')
      fetchTeachers()
    } catch (error) {
      console.error("Error updating teacher:", error)
      message.error(error.response?.data?.message || "Failed to update teacher")
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <CrownOutlined style={{ color: primaryColor }} />
      case "teacher":
        return <BookOutlined style={{ color: secondaryColor }} />
      default:
        return <UserOutlined style={{ color: successColor }} />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return primaryColor
      case "teacher":
        return secondaryColor
      default:
        return successColor
    }
  }

  const columns = [
    {
      title: "Teacher",
      key: "teacher",
      render: (_, record) => (
        <Space size="middle">
          {record.img ? (
            <Avatar
              size={56}
              src={record.img}
              className="teacher-avatar"
              style={{
                border: `2px solid ${getRoleColor(record.role)}20`,
                boxShadow: `0 4px 12px ${getRoleColor(record.role)}20`,
              }}
            />
          ) : (
            <Avatar
              size={56}
              style={{
                backgroundColor: getAvatarColor(record.firstName || record.username),
                fontSize: "20px",
                border: `2px solid ${getRoleColor(record.role)}20`,
                boxShadow: `0 4px 12px ${getRoleColor(record.role)}20`,
                fontWeight: "600",
              }}
            >
              {(record.firstName?.charAt(0) || record.username?.charAt(0))?.toUpperCase() || "T"}
            </Avatar>
          )}
          <div>
            <Text strong style={{ fontSize: "16px", color: "#1f2937", fontWeight: "600" }}>
              {`${record.firstName} ${record.lastName}` || record.username}
            </Text>
            <div style={{ display: "flex", alignItems: "center", color: "#6b7280", marginTop: "2px" }}>
              <MailOutlined style={{ marginRight: "6px", fontSize: "13px" }} />
              <Text type="secondary" style={{ fontSize: "14px" }}>
                {record.email}
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "#6b7280", marginTop: "2px" }}>
              <BookOutlined style={{ marginRight: "6px", fontSize: "13px" }} />
              <Text type="secondary" style={{ fontSize: "14px" }}>
                {record.subject || "No subject specified"}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Tag
          color={record.isBlocked ? dangerColor : secondaryColor}
          style={{
            padding: "6px 16px",
            borderRadius: "20px",
            textTransform: "capitalize",
            backgroundColor: `${record.isBlocked ? dangerColor : secondaryColor}15`,
            color: record.isBlocked ? dangerColor : secondaryColor,
            border: `1px solid ${record.isBlocked ? dangerColor : secondaryColor}30`,
            fontWeight: "500",
            fontSize: "13px",
          }}
        >
          {record.isBlocked ? "Inactive" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Subject",
      key: "subject",
      align: "center",
      render: (_, record) => (
        <Tag
          color={record.isBlocked ? dangerColor : secondaryColor}
          style={{
            padding: "6px 16px",
            borderRadius: "20px",
            textTransform: "capitalize",
            backgroundColor: `${record.isBlocked ? dangerColor : secondaryColor}15`,
            color: record.isBlocked ? dangerColor : secondaryColor,
            border: `1px solid ${record.isBlocked ? dangerColor : secondaryColor}30`,
            fontWeight: "500",
            fontSize: "13px",
          }}
        >
          {record.subject}
        </Tag>
      ),
    },
    {
      title: "Experience",
      key: "experience",
      align: "center",
      render: (_, record) => (
        <Tag
          style={{
            padding: "6px 16px",
            borderRadius: "20px",
            textTransform: "capitalize",
            backgroundColor: `${primaryColor}15`,
            color: primaryColor,
            border: `1px solid ${primaryColor}30`,
            fontWeight: "500",
            fontSize: "13px",
          }}
        >
          {record.userExperience || "Not specified"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
       <Space size="middle"> {/* 'middle' gives a bit more spacing than 'small' */}
  <Tooltip title="View Details">
    <Button
      type="text"
      shape="circle"
      icon={
        <EyeOutlined
          style={{
            color: secondaryColor,
            fontSize: "20px", // Increased icon size
          }}
        />
      }
      onClick={() => showModal(record)}
      style={{
        backgroundColor: `${secondaryColor}10`,
        width: "44px", // Increased button size
        height: "44px",
      }}
    />
  </Tooltip>

  <Tooltip title="Edit Teacher">
    <Button
      type="text"
      shape="circle"
      icon={
        <EditOutlined
          style={{
            color: primaryColor,
            fontSize: "20px", // Increased icon size
          }}
        />
      }
      onClick={() => handleEditTeacher(record)}
      style={{
        backgroundColor: `${primaryColor}10`,
        width: "44px",
        height: "44px",
      }}
    />
  </Tooltip>

  <Tooltip title="Delete Teacher">
    <Button
      type="text"
      shape="circle"
      icon={
        <DeleteOutlined
          style={{
            color: dangerColor,
            fontSize: "20px", // Increased icon size
          }}
        />
      }
      onClick={() =>
        handleDelete(record._id, `${record.firstName} ${record.lastName}`)
      }
      style={{
        backgroundColor: `${dangerColor}10`,
        width: "44px",
        height: "44px",
      }}
    />
  </Tooltip>
 </Space>

      ),
    },
  ]

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>Upload Photo</div>
    </div>
  )

  return (
    <div className="teachers-page-container">
      <Card
        className="teachers-card"
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "none",
        }}
      >
        <div className="teachers-header">
          <div>
            <Title level={2} className="teachers-title">
              <TeamOutlined className="header-icon" />
              Teachers Management
            </Title>
            <Text className="teachers-subtitle">
              Manage and monitor all teachers in the system
            </Text>
          </div>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAddTeacher}
            size="large"
            className="add-teacher-button"
          >
            Add New Teacher
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={teachers}
          loading={loading}
          rowKey="_id"
          scroll={{ x: true }}
          locale={{ emptyText: "No teachers found" }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => <span>Total {total} teachers</span>,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>

      {/* View Teacher Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={540}
        centered
        className="teacher-modal"
      >
        {selectedTeacher && (
          <div className="teacher-modal-content">
            <div className="teacher-modal-header">
              {selectedTeacher.img ? (
                <Avatar
                  size={140}
                  src={selectedTeacher.img}
                  className="teacher-modal-avatar"
                />
              ) : (
                <Avatar
                  size={140}
                  style={{
                    backgroundColor: getAvatarColor(selectedTeacher.firstName || selectedTeacher.username),
                    fontSize: "56px",
                  }}
                  className="teacher-modal-avatar"
                >
                  {(selectedTeacher.firstName?.charAt(0) || selectedTeacher.username?.charAt(0))?.toUpperCase()}
                </Avatar>
              )}
              <Title level={2} className="teacher-modal-name">
                {`${selectedTeacher.firstName} ${selectedTeacher.lastName}` || selectedTeacher.username}
              </Title>
              <Tag
                icon={getRoleIcon(selectedTeacher.role)}
                className="teacher-modal-role"
              >
                {selectedTeacher.role}
              </Tag>
            </div>
            <div className="teacher-modal-body">
              <div className="teacher-info-item">
                <MailOutlined className="info-icon" />
                <div>
                  <Text className="info-label">Email Address</Text>
                  <Text strong className="info-value">
                    {selectedTeacher.email}
                  </Text>
                </div>
              </div>
              <div className="teacher-info-item">
                <BookOutlined className="info-icon" />
                <div>
                  <Text className="info-label">Subject</Text>
                  <Text strong className="info-value">
                    {selectedTeacher.subject || "Not specified"}
                  </Text>
                </div>
              </div>
              <div className="teacher-info-item">
                <UserOutlined className="info-icon" />
                <div>
                  <Text className="info-label">Gender</Text>
                  <Text strong className="info-value">
                    {selectedTeacher.gender || "Not specified"}
                  </Text>
                </div>
              </div>
              <div className="teacher-info-item">
                <CalendarOutlined className="info-icon" />
                <div>
                  <Text className="info-label">Experience</Text>
                  <Text strong className="info-value">
                    {selectedTeacher.userExperience || "Not specified"}
                  </Text>
                </div>
              </div>
              <div className="teacher-info-item">
                <CalendarOutlined className="info-icon" />
                <div>
                  <Text className="info-label">Member Since</Text>
                  <Text strong className="info-value">
                    {new Date(selectedTeacher.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Teacher Modal */}
      <Modal
        title={
          <div className="modal-title-container">
            <UserAddOutlined className="modal-title-icon" />
            <div className="modal-title-text">Add New Teacher</div>
          </div>
        }
        open={isAddTeacherModalOpen}
        onCancel={() => {
          setIsAddTeacherModalOpen(false)
          form.resetFields()
          setImageUrl('')
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsAddTeacherModalOpen(false)
              form.resetFields()
              setImageUrl('')
            }}
            className="modal-cancel-button"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
            className="modal-submit-button"
          >
            Create Teacher
          </Button>,
        ]}
        width={640}
        centered
        className="add-teacher-modal"
      >
        <Form form={form} layout="vertical" onFinish={onAddTeacherFinish}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="img"
                label="Profile Picture"
                valuePropName="file"
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={handleUpload}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </div>
            <div style={{ flex: 2 }}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "Please input first name!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter first name"
                  className="form-input"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please input last name!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter last name"
                  className="form-input"
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              type="email"
              placeholder="Enter email address"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
              className="form-input"
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: '24px' }}>
            <Form.Item
              name="gender"
              label="Gender"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select className="form-select" placeholder="Select Gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="userExperience"
              label="Experience Level"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Please select experience level!" }]}
            >
              <Select className="form-select" placeholder="Select Experience">
                <Option value="beginner">Beginner</Option>
                <Option value="1+ year experience">1+ year experience</Option>
                <Option value="2+ years experience">2+ years experience</Option>
                <Option value="3+ years experience">3+ years experience</Option>
                <Option value="4+ years experience">4+ years experience</Option>
                <Option value="5+ years experience">5+ years experience</Option>
                <Option value="6+ years experience">6+ years experience</Option>
                <Option value="7+ years experience">7+ years experience</Option>
                <Option value="8+ years experience">8+ years experience</Option>
                <Option value="9+ years experience">9+ years experience</Option>
                <Option value="10+ years experience">10+ years experience</Option>
                <Option value="11+ years experience">11+ years experience</Option>
                <Option value="12+ years experience">12+ years experience</Option>
                <Option value="13+ years experience">13+ years experience</Option>
                <Option value="14+ years experience">14+ years experience</Option>
                <Option value="15+ years experience">15+ years experience</Option>
                <Option value="16+ years experience">16+ years experience</Option>
                <Option value="17+ years experience">17+ years experience</Option>
                <Option value="18+ years experience">18+ years experience</Option>
                <Option value="19+ years experience">19+ years experience</Option>
                <Option value="20+ years experience">20+ years experience</Option>
                <Option value="21+ years experience">21+ years experience</Option>
                <Option value="22+ years experience">22+ years experience</Option>
                <Option value="23+ years experience">23+ years experience</Option>
                <Option value="24+ years experience">24+ years experience</Option>
                <Option value="25+ years experience">25+ years experience</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
              name="subject"
              label="Subject"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Please select subject!" }]}
            >
              <Select
                placeholder="Select subject"
                className="form-select"
                prefix={<BookOutlined />}
              >
                <Option value="sinhala">Sinhala</Option>
                <Option value="geography">Geography</Option>
                <Option value="economics">Economics</Option>
                <Option value="buddhist culture and logic">Buddhist Culture and Logic</Option>
                <Option value="physics">Physics</Option>
                <Option value="chemistry">Chemistry</Option>
                <Option value="biology">Biology</Option>
                <Option value="combined mathematics">Combined Mathematics</Option>
                <Option value="engineering & bio system technology">Engineering & Bio System Technology</Option>
                <Option value="science for technology">Science for Technology</Option>
                <Option value="ict">ICT</Option>
                <Option value="agriculture and applied sciences">Agriculture and Applied Sciences</Option>
              </Select>
            </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            initialValue="teacher"
            hidden
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

        {/* Edit Teacher Modal */}
      <Modal
        title={
          <div className="modal-title-container">
            <EditOutlined className="modal-title-icon edit" />
            <div className="modal-title-text">Edit Teacher</div>
          </div>
        }
        open={isEditTeacherModalOpen}
        onCancel={() => {
          setIsEditTeacherModalOpen(false)
          editForm.resetFields()
          setEditingTeacher(null)
          setImageUrl('')
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsEditTeacherModalOpen(false)
              editForm.resetFields()
              setEditingTeacher(null)
              setImageUrl('')
            }}
            className="modal-cancel-button"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => editForm.submit()}
            className="modal-submit-button edit"
          >
            Update Teacher
          </Button>,
        ]}
        width={640}
        centered
        className="edit-teacher-modal"
      >
        <Form form={editForm} layout="vertical" onFinish={onEditTeacherFinish}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="img"
                label="Profile Picture"
                valuePropName="file"
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={handleUpload}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </div>
            <div style={{ flex: 2 }}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "Please input first name!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter first name"
                  className="form-input"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please input last name!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter last name"
                  className="form-input"
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              type="email"
              placeholder="Enter email address"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password (Leave empty to keep current)"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
              className="form-input"
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: '24px' }}>
            <Form.Item
              name="gender"
              label="Gender"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select className="form-select" placeholder="Select Gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="userExperience"
              label="Experience Level"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Please select experience level!" }]}
            >
              <Select className="form-select" placeholder="Select Experience">               
                <Option value="beginner">Beginner</Option>
                <Option value="1+ year experience">1+ year experience</Option>
                <Option value="2+ years experience">2+ years experience</Option>
                <Option value="3+ years experience">3+ years experience</Option>
                <Option value="4+ years experience">4+ years experience</Option>
                <Option value="5+ years experience">5+ years experience</Option>
                <Option value="6+ years experience">6+ years experience</Option>
                <Option value="7+ years experience">7+ years experience</Option>
                <Option value="8+ years experience">8+ years experience</Option>
                <Option value="9+ years experience">9+ years experience</Option>
                <Option value="10+ years experience">10+ years experience</Option>
                <Option value="11+ years experience">11+ years experience</Option>
                <Option value="12+ years experience">12+ years experience</Option>
                <Option value="13+ years experience">13+ years experience</Option>
                <Option value="14+ years experience">14+ years experience</Option>
                <Option value="15+ years experience">15+ years experience</Option>
                <Option value="16+ years experience">16+ years experience</Option>
                <Option value="17+ years experience">17+ years experience</Option>
                <Option value="18+ years experience">18+ years experience</Option>
                <Option value="19+ years experience">19+ years experience</Option>
                <Option value="20+ years experience">20+ years experience</Option>
                <Option value="21+ years experience">21+ years experience</Option>
                <Option value="22+ years experience">22+ years experience</Option>
                <Option value="23+ years experience">23+ years experience</Option>
                <Option value="24+ years experience">24+ years experience</Option>
                <Option value="25+ years experience">25+ years experience</Option>           
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <Form.Item
              name="subject"
              label="Subject"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Please select subject!" }]}
            >
              <Select
                placeholder="Select subject"
                className="form-select"
                prefix={<BookOutlined />}
              >
                <Option value="sinhala">Sinhala</Option>
                <Option value="geography">Geography</Option>
                <Option value="economics">Economics</Option>
                <Option value="buddhist culture and logic">Buddhist Culture and Logic</Option>
                <Option value="physics">Physics</Option>
                <Option value="chemistry">Chemistry</Option>
                <Option value="biology">Biology</Option>
                <Option value="combined mathematics">Combined Mathematics</Option>
                <Option value="engineering & bio system technology">Engineering & Bio System Technology</Option>
                <Option value="science for technology">Science for Technology</Option>
                <Option value="ict">ICT</Option>
                <Option value="agriculture and applied sciences">Agriculture and Applied Sciences</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="isBlocked"
              label="Status"
              style={{ flex: 1 }}
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Inactive"
                unCheckedChildren="Active"
                defaultChecked={!editingTeacher?.isBlocked}
                style={{
                  backgroundColor: '#537D5D', // Green when active
                }}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
  
    </div>
  )
}