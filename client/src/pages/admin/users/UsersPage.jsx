"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Table, Space, Button, Modal, Tag, message, Avatar, Form, Input, Card, Typography, Tooltip, Select, Switch } from "antd"
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
} from "@ant-design/icons"
import axios from "axios"
import toast from "react-hot-toast"
import "./student.css"

const { Title, Text } = Typography
const { Option } = Select

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const navigate = useNavigate()

  // Color scheme
  const primaryColor = "#6366f1"
  const secondaryColor = "#3b82f6"
  const successColor = "#3D3BF3"
  const dangerColor = "#C5172E"
  const warningColor = "#f59e0b"
  const bluColor = "#3b82f6"

  const getAvatarColor = (username) => {
    if (!username) return primaryColor
    const colors = [primaryColor, secondaryColor, successColor, "#8b5cf6", "#ec4899"]
    const charCode = username.charCodeAt(0)
    return colors[charCode % colors.length]
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const { data } = await axios.get("http://localhost:5080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const studentData = data.filter((user) => user.role === "student")
      setStudents(studentData)
    } catch (error) {
      console.error("Error:", error.response?.data || error.message)
      message.error("Failed to load students. Check console for details.")
      if (error.response?.status === 401) {
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete student "${name}"?`)
    if (!confirmDelete) return

    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5080/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success(`Student "${name}" deleted successfully`)
      fetchStudents()
    } catch (error) {
      console.error("Error deleting student:", error)
      toast.error("Failed to delete student")
    } finally {
      setLoading(false)
    }
  }

  const showModal = (student) => {
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  const handleAddStudent = () => {
    setIsAddStudentModalOpen(true)
  }

  const handleEditStudent = (student) => {
    setEditingStudent(student)
    editForm.setFieldsValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      role: student.role,
      isBlocked: student.isBlocked || false,
      password: ''
    })
    setIsEditStudentModalOpen(true)
  }

  const onAddStudentFinish = async (values) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      await axios.post("http://localhost:5080/api/users/register", {
        ...values,
        isBlocked: values.isBlocked || false
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      toast.success("Student added successfully")
      setIsAddStudentModalOpen(false)
      form.resetFields()
      fetchStudents()
    } catch (error) {
      console.error("Error adding student:", error)
      message.error(error.response?.data?.message || "Failed to add student")
    } finally {
      setLoading(false)
    }
  }

  const onEditStudentFinish = async (values) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      const updateData = {
        ...values,
        isBlocked: values.isBlocked || false
      }
      
      if (!values.password) {
        delete updateData.password
      }

      await axios.put(`http://localhost:5080/api/users/${editingStudent._id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      toast.success("Student updated successfully")
      setIsEditStudentModalOpen(false)
      editForm.resetFields()
      setEditingStudent(null)
      fetchStudents()
    } catch (error) {
      console.error("Error updating student:", error)
      message.error(error.response?.data?.message || "Failed to update student")
    } finally {
      setLoading(false)
    }
  }
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return <CrownOutlined style={{ color: primaryColor }} />
      case "teacher": return <BookOutlined style={{ color: secondaryColor }} />
      default: return <UserOutlined style={{ color: successColor }} />
    }
  }
  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return primaryColor
      case "teacher": return secondaryColor
      default: return successColor
    }
  }
  const columns = [
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <Space size="middle">
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
            {(record.firstName?.charAt(0) || record.username?.charAt(0))?.toUpperCase() || "S"}
          </Avatar>
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
          color={record.isBlocked ? dangerColor : successColor}
          style={{
            padding: "6px 16px",
            borderRadius: "20px",
            backgroundColor: `${record.isBlocked ? dangerColor : successColor}99`,
            border: `1px solid ${record.isBlocked ? dangerColor : successColor}40`,
            fontWeight: "500",
          
          }}
        >
          {record.isBlocked ? "Inactive" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Role",
      key: "role",
      align: "center",
      render: (_, record) => (
        <Tag
          icon={getRoleIcon(record.role)}
          style={{
            padding: "6px 16px",
            borderRadius: "20px",
            backgroundColor: `${getRoleColor(record.role)}15`,
            color: getRoleColor(record.role),
            border: `1px solid ${getRoleColor(record.role)}30`,
            fontWeight: "500",
          }}
        >
          {record.role}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
      <Space size="small">
  <Tooltip title="View Details">
    <Button
      type="text"
      shape="circle"
      icon={
        <EyeOutlined
          style={{
            color: secondaryColor,
            fontSize: "20px", // increased icon size
          }}
        />
      }
      onClick={() => showModal(record)}
      style={{
        backgroundColor: `${secondaryColor}10`,
        width: "44px", // increased size
        height: "44px",
      }}
    />
  </Tooltip>

  <Tooltip title="Edit Student">
    <Button
      type="text"
      shape="circle"
      icon={
        <EditOutlined
          style={{
            color: primaryColor,
            fontSize: "20px", // increased icon size
          }}
        />
      }
      onClick={() => handleEditStudent(record)}
      style={{
        backgroundColor: `${primaryColor}10`,
        width: "44px", // increased size
        height: "44px",
      }}
    />
  </Tooltip>

  <Tooltip title="Delete Student">
    <Button
      type="text"
      shape="circle"
      icon={
        <DeleteOutlined
          style={{
            color: dangerColor,
            fontSize: "20px", // increased icon size
          }}
        />
      }
      onClick={() =>
        handleDelete(record._id, `${record.firstName} ${record.lastName}`)
      }
      style={{
        backgroundColor: `${dangerColor}10`,
        width: "44px", // increased size
        height: "44px",
      }}
    />
   </Tooltip>
  </Space>

      ),
    },
  ]

  return (
    <div className="students-page-container">
      <Card className="students-card">
        <div className="students-header">
          <div>
            <Title level={2} className="students-title">
              <TeamOutlined className="header-icon" />
              Student Management
            </Title>
            <Text className="students-subtitle">
              Manage and monitor all students in the system
            </Text>
          </div>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAddStudent}
            size="large"
            className="add-student-button"
          >
            Add New Student
          </Button>
        </div>

       
          <div className="table-container">
            <Table
              columns={columns}
              dataSource={students}
              loading={loading}
              rowKey="_id"
              scroll={{ x: true }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                className: "custom-pagination",
              }}
              className="students-table"
              rowClassName="table-row"
            />
          </div>
      </Card>

      {/* View Student Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={480}
        centered
        className="student-modal"
      >
        {selectedStudent && (
          <div className="student-modal-content">
            <div className="student-modal-header">
              <Avatar
                size={140}
                style={{
                  backgroundColor: getAvatarColor(selectedStudent.firstName || selectedStudent.username),
                  fontSize: "56px",
                }}
                className="student-modal-avatar"
              >
                {(selectedStudent.firstName?.charAt(0) || selectedStudent.username?.charAt(0))?.toUpperCase()}
              </Avatar>
              <Title level={2} className="student-modal-name">
                {`${selectedStudent.firstName} ${selectedStudent.lastName}` || selectedStudent.username}
              </Title>
              <Tag
                icon={getRoleIcon(selectedStudent.role)}
                className="student-modal-role"
              >
                {selectedStudent.role}
              </Tag>
            </div>
            <div className="student-modal-body">
              <div className="student-info-item">
                <MailOutlined className="info-icon" />
                <div>
                  <Text className="info-label">Email Address</Text>
                  <Text strong className="info-value">
                    {selectedStudent.email}
                  </Text>
                </div>
              </div>
              <div className="student-info-item">
                <Tag
                  color={selectedStudent.isBlocked ? dangerColor : successColor}
                  style={{ padding: "6px 16px", borderRadius: "20px" }}
                >
                  {selectedStudent.isBlocked ? "Inactive" : "Active"}
                </Tag>
              </div>
              <div className="student-info-item">
                <CalendarOutlined className="info-icon" />
                <div>
                  <Text className="info-label">Member Since</Text>
                  <Text strong className="info-value">
                    {new Date(selectedStudent.createdAt).toLocaleDateString("en-US", {
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

      {/* Add Student Modal */}
      <Modal
        title={
          <div className="modal-title-container">
            <UserAddOutlined className="modal-title-icon edit" />
            <div className="modal-title-text">Add New Student</div>
          </div>
        }
        open={isAddStudentModalOpen}
        onCancel={() => {
          setIsAddStudentModalOpen(false)
          form.resetFields()
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsAddStudentModalOpen(false)
              form.resetFields()
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
            Create Student
          </Button>,
        ]}
        width={640}
        centered
        className="add-student-modal"
      >
        <Form form={form} layout="vertical" onFinish={onAddStudentFinish} initialValues={{ isBlocked: false }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please input first name!" }]}
              style={{ flex: 1 }}
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
              style={{ flex: 1 }}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter last name"
                className="form-input"
              />
            </Form.Item>
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
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role!" }]}
              style={{ flex: 1 }}
            >
              <Select className="form-select" placeholder="Select Role">
                <Option value="student">Student</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="isBlocked"
              label="Status"
              valuePropName="checked"
              style={{ flex: 1 }}
            >
              <Switch
                checkedChildren="Inactive"
                unCheckedChildren="active"
                defaultChecked={true}
                style={{
                  backgroundColor: '#001A6E', // Green when active
                }}
                className="status-switch"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        title={
          <div className="modal-title-container">
            <EditOutlined className="modal-title-icon edit" />
            <div className="modal-title-text">Edit Student</div>
          </div>
        }
        open={isEditStudentModalOpen}
        onCancel={() => {
          setIsEditStudentModalOpen(false)
          editForm.resetFields()
          setEditingStudent(null)
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsEditStudentModalOpen(false)
              editForm.resetFields()
              setEditingStudent(null)
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
            Update Student
          </Button>,
        ]}
        width={640}
        centered
        className="edit-student-modal"
      >
        <Form form={editForm} layout="vertical" onFinish={onEditStudentFinish}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please input first name!" }]}
              style={{ flex: 1 }}
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
              style={{ flex: 1 }}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter last name"
                className="form-input"
              />
            </Form.Item>
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
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role!" }]}
              style={{ flex: 1 }}
            >
              <Select className="form-select" placeholder="Select Role">
                <Option value="student">Student</Option>
                <Option value="teacher">Teacher</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="isBlocked"
              label="Status"
              valuePropName="checked"
              style={{ flex: 1 }}
            >
              <Switch
                checkedChildren="Inctive"
                unCheckedChildren="active"
                style={{
                 backgroundColor: editForm.getFieldValue('isBlocked') ? '#5409DA' : '#537D5D', // Inactive = red, Active = green
                }}
                className="status-switch"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

