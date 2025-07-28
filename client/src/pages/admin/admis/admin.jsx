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
import "./admin.css"

const { Title, Text } = Typography
const { Option } = Select

export default function AdminsPage() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const navigate = useNavigate()

  // Color scheme
  const primaryColor = "#6366f1"
  const secondaryColor = "#3b82f6"
  const successColor = "#3D3BF3"
  const dangerColor = "#B8001F"
  const warningColor = "#f59e0b"

  const getAvatarColor = (username) => {
    if (!username) return primaryColor
    const colors = [primaryColor, secondaryColor, successColor, "#8b5cf6", "#ec4899"]
    const charCode = username.charCodeAt(0)
    return colors[charCode % colors.length]
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const { data } = await axios.get("http://localhost:5080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const adminData = data.filter((user) => user.role === "admin") // Filter for admins
      setAdmins(adminData)
    } catch (error) {
      console.error("Error:", error.response?.data || error.message)
      message.error("Failed to load admins. Check console for details.")
      if (error.response?.status === 401) {
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete admin "${name}"?`)
    if (!confirmDelete) return

    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5080/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success(`Admin "${name}" deleted successfully`)
      fetchAdmins()
    } catch (error) {
      console.error("Error deleting admin:", error)
      toast.error("Failed to delete admin")
    } finally {
      setLoading(false)
    }
  }

  const showModal = (admin) => {
    setSelectedAdmin(admin)
    setIsModalOpen(true)
  }

  const handleAddAdmin = () => {
    setIsAddAdminModalOpen(true)
  }

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin)
    editForm.setFieldsValue({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      isBlocked: admin.isBlocked || false,
      password: ''
    })
    setIsEditAdminModalOpen(true)
  }

 const onAddAdminFinish = async (values) => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    const adminData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      role: "admin", // Explicitly set role
      isBlocked: values.isBlocked || false,
      img: values.img || 'default-user-image-url',
      gender: values.gender || 'other',
      // Add any other required fields from your schema
      userExperience: 'beginner', // Default value
      subject: 'other' // Default value
    };

    const response = await axios.post(
      "http://localhost:5080/api/users/register", 
      adminData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Admin added successfully");
    setIsAddAdminModalOpen(false);
    form.resetFields();
    fetchAdmins();
  } catch (error) {
    console.error("Error adding admin:", error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        "Failed to add admin";
    // Show more detailed error messages
    if (error.response?.data?.errors) {
      // Handle validation errors
      const validationErrors = Object.values(error.response.data.errors)
        .map(err => err.message)
        .join(', ');
      message.error(`Validation errors: ${validationErrors}`);
    } else {
      message.error(errorMessage);
    }
  } finally {
    setLoading(false);
  }
};
  const onEditAdminFinish = async (values) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      const updateData = {
        ...values,
        isBlocked: values.isBlocked // Fixed: Removed || false to ensure correct value is sent
      }
      
      if (!values.password) {
        delete updateData.password
      }

      await axios.put(`http://localhost:5080/api/users/${editingAdmin._id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      toast.success("Admin updated successfully")
      setIsEditAdminModalOpen(false)
      editForm.resetFields()
      setEditingAdmin(null)
      fetchAdmins()
    } catch (error) {
      console.error("Error updating admin:", error)
      message.error(error.response?.data?.message || "Failed to update admin")
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
      title: "Admin",
      key: "admin",
      render: (_, record) => (
        <Space size="middle">
          <Avatar
            size={56}
            style={{
              backgroundColor: getAvatarColor(record.firstName || record.username),
              fontSize: "20px",
              border: `2px solid ${getRoleColor(record.role)}90`,
              boxShadow: `0 4px 12px ${getRoleColor(record.role)}40`,
              fontWeight: "600",
            }}
          >
            {(record.firstName?.charAt(0) || record.username?.charAt(0))?.toUpperCase() || "A"}
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
            backgroundColor: `${record.isBlocked ? dangerColor : successColor}85`,
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
                    fontSize: "20px",
                  }}
                />
              }
              onClick={() => showModal(record)}
              style={{
                backgroundColor: `${secondaryColor}10`,
                width: "44px",
                height: "44px",
              }}
            />
          </Tooltip>

          <Tooltip title="Edit Admin">
            <Button
              type="text"
              shape="circle"
              icon={
                <EditOutlined
                  style={{
                    color: primaryColor,
                    fontSize: "20px",
                  }}
                />
              }
              onClick={() => handleEditAdmin(record)}
              style={{
                backgroundColor: `${primaryColor}10`,
                width: "44px",
                height: "44px",
              }}
            />
          </Tooltip>

          <Tooltip title="Delete Admin">
            <Button
              type="text"
              shape="circle"
              icon={
                <DeleteOutlined
                  style={{
                    color: dangerColor,
                    fontSize: "20px",
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

  return (
    <div className="admins-page-container">
      <Card className="admins-card">
        <div className="admins-header">
          <div>
            <Title level={2} className="admins-title">
              <TeamOutlined className="header-icon" />
              Admin Management
            </Title>
            <Text className="admins-subtitle">
              Manage and monitor all admins in the system
            </Text>
          </div>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAddAdmin}
            size="large"
            className="add-admin-button"
          >
            Add New Admin
          </Button>
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={admins}
            loading={loading}
            rowKey="_id"
            scroll={{ x: true }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              className: "custom-pagination",
            }}
            className="admins-table"
            rowClassName="table-row"
          />
        </div>
      </Card>

      {/* View Admin Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={480}
        centered
        className="admin-modal"
      >
        {selectedAdmin && (
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <Avatar
                size={140}
                style={{
                  backgroundColor: getAvatarColor(selectedAdmin.firstName || selectedAdmin.username),
                  fontSize: "56px",
                }}
                className="admin-modal-avatar"
              >
                {(selectedAdmin.firstName?.charAt(0) || selectedAdmin.username?.charAt(0))?.toUpperCase()}
              </Avatar>
              <Title level={2} className="admin-modal-name">
                {`${selectedAdmin.firstName} ${selectedAdmin.lastName}` || selectedAdmin.username}
              </Title>
              <Tag
                icon={getRoleIcon(selectedAdmin.role)}
                className="admin-modal-role"
              >
                {selectedAdmin.role}
              </Tag>
            </div>
            <div className="admin-modal-body">
              <div className="admin-info-item">
                <MailOutlined className="info-icon" />
                <div>
                  <Text className="info-label">Email Address</Text>
                  <Text strong className="info-value">
                    {selectedAdmin.email}
                  </Text>
                </div>
              </div>
              <div className="admin-info-item">
                <Tag
                  color={selectedAdmin.isBlocked ? dangerColor : successColor}
                  style={{ padding: "6px 16px", borderRadius: "20px" }}
                >
                  {selectedAdmin.isBlocked ? "Inactive" : "Active"}
                </Tag>
              </div>
              <div className="admin-info-item">
                <CalendarOutlined className="info-icon" />
                <div>
                  <Text className="info-label">Member Since</Text>
                  <Text strong className="info-value">
                    {new Date(selectedAdmin.createdAt).toLocaleDateString("en-US", {
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

      {/* Add Admin Modal */}
      <Modal
        title={
          <div className="modal-title-container">
            <UserAddOutlined className="modal-title-icon edit" />
            <div className="modal-title-text">Add New Admin</div>
          </div>
        }
        open={isAddAdminModalOpen}
        onCancel={() => {
          setIsAddAdminModalOpen(false)
          form.resetFields()
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsAddAdminModalOpen(false)
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
            Create Admin
          </Button>,
        ]}
        width={640}
        centered
        className="add-admin-modal"
      >
        <Form form={form} layout="vertical" onFinish={onAddAdminFinish} initialValues={{ isBlocked: false }}>
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
                checkedChildren="Inactive"
                unCheckedChildren="active"
                defaultChecked={true}
                style={{
                  backgroundColor: '#537D5D',
                }}
                className="status-switch"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal
        title={
          <div className="modal-title-container">
            <EditOutlined className="modal-title-icon edit" />
            <div className="modal-title-text">Edit Admin</div>
          </div>
        }
        open={isEditAdminModalOpen}
        onCancel={() => {
          setIsEditAdminModalOpen(false)
          editForm.resetFields()
          setEditingAdmin(null)
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsEditAdminModalOpen(false)
              editForm.resetFields()
              setEditingAdmin(null)
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
            Update Admin
          </Button>,
        ]}
        width={640}
        centered
        className="edit-admin-modal"
      >
        <Form form={editForm} layout="vertical" onFinish={onEditAdminFinish}>
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
                <Option value="admin">Admin</Option>
                <Option value="teacher">Teacher</Option>
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
                style={{
                  backgroundColor: editForm.getFieldValue('isBlocked') ? '#5409DA' : '#537D5D',
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