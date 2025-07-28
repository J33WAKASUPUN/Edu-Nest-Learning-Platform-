import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Space,
  Button,
  Modal,
  Tag,
  message,
  Form,
  Input,
  Card,
  Typography,
  Tooltip,
  Select,
  DatePicker,
  TimePicker,
  Divider,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  EyeOutlined,
  UserSwitchOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  TeamOutlined,
  SearchOutlined,
  FilterOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import "./sessions.css";

const { Title, Text } = Typography;
const { Option } = Select;

const SUBJECTS = [
  "Sinhala",
  "Geography",
  "Economics",
  "Biology",
  "Buddhist Culture and Logic",
  "Physics",
  "Chemistry",
  "Combined Mathematics",
  "Engineering & Bio System Technology",
  "Science for Technology",
  "ICT",
  "Agriculture and Applied Sciences",
];

// Subject code mapping
const subjectCodeMap = {
  Sinhala: "ARTSI-0001",
  Geography: "ARTGE-0002",
  Economics: "ARTEC-0003",
  "Buddhist Culture and Logic": "ARTBCL-0004",
  Physics: "SCIPHY-0001",
  Chemistry: "SCICHE-0002",
  Biology: "SCIBIO-0003",
  "Combined Mathematics": "SCICM-0004",
  "Engineering & Bio System Technology": "TECHENG-0001",
  "Science for Technology": "TECHSFT-0002",
  ICT: "TECHICT-0003",
  "Agriculture and Applied Sciences": "TECHAAS-0004",
};

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  console.log(token);
  console.table({ ...localStorage });

  console.log("User ID:", userId);
  console.log("User Role:", userRole);

  // Color scheme
  const primaryColor = "#4f46e5"; // Indigo 600
  const secondaryColor = "#0ea5e9"; // Sky 500
  const successColor = "#10b981"; // Emerald 500
  const dangerColor = "#ef4444"; // Red 500
  const warningColor = "#f59e0b"; // Amber 500
  const neutralColor = "#6b7280"; // Gray 500

  const handleSubjectChange = (value) => {
    // Set the subject code based on the selected subject
    form.setFieldsValue({ code: subjectCodeMap[value] || "" });
  };

  const handleEditSubjectChange = (value) => {
    // Set the subject code based on the selected subject in edit form
    editForm.setFieldsValue({ code: subjectCodeMap[value] || "" });
  };

  useEffect(() => {
    // Redirect if user is not teacher or admin
    if (!["teacher", "admin"].includes(userRole)) {
      navigate("/unauthorized");
      return;
    }
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const endpoint =
        userRole === "teacher"
          ? `http://localhost:5080/api/sessions/teacher/me`
          : "http://localhost:5080/api/sessions";

      const { data } = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      message.error(error.response?.data?.message || "Failed to load sessions");
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, subject) => {
    Modal.confirm({
      title: "Delete Session",
      content: (
        <div className="delete-confirmation">
          <div className="delete-icon">
            <DeleteOutlined />
          </div>
          <p>
            Are you sure you want to delete the session <strong>"{subject}"</strong>?
          </p>
          <p className="delete-warning">This action cannot be undone.</p>
        </div>
      ),
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:5080/api/sessions/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          toast.success(`Session "${subject}" deleted successfully`);
          fetchSessions();
        } catch (error) {
          console.error("Error deleting session:", error);
          toast.error(error.response?.data?.message || "Failed to delete session");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const showModal = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleAddSession = () => {
    setIsAddSessionModalOpen(true);
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    editForm.setFieldsValue({
      subject: session.subject,
      code: subjectCodeMap[session.subject] || "", // Auto-fill subject code
      description: session.description,
      date: session.date ? dayjs(session.date) : null,
      startTime: session.startTime ? dayjs(session.startTime, "HH:mm") : null,
      endTime: session.endTime ? dayjs(session.endTime, "HH:mm") : null,
      maxStudents: session.maxStudents,
      link: session.link,
      isCancelled: session.isCancelled ? "true" : "false",
    });
    setIsEditSessionModalOpen(true);
  };

  const onAddSessionFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        "http://localhost:5080/api/sessions",
        {
          ...values,
          date: values.date ? values.date.format("YYYY-MM-DD") : undefined,
          startTime: values.startTime ? values.startTime.format("HH:mm") : undefined,
          endTime: values.endTime ? values.endTime.format("HH:mm") : undefined,
          isCancelled: values.isCancelled === "true",
          teacher: userId, // Automatically assign the current teacher
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Session added successfully");
        setIsAddSessionModalOpen(false);
        form.resetFields();
        fetchSessions();
      }
    } catch (error) {
      console.error("Error adding session:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add session. Please check all fields and try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onEditSessionFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const updateData = {
        ...values,
        date: values.date ? values.date.format("YYYY-MM-DD") : undefined,
        startTime: values.startTime ? values.startTime.format("HH:mm") : undefined,
        endTime: values.endTime ? values.endTime.format("HH:mm") : undefined,
        isCancelled: values.isCancelled === "true",
      };

      await axios.put(
        `http://localhost:5080/api/sessions/${editingSession._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Session updated successfully");
      setIsEditSessionModalOpen(false);
      editForm.resetFields();
      setEditingSession(null);
      fetchSessions();
    } catch (error) {
      console.error("Error updating session:", error);
      message.error(error.response?.data?.message || "Failed to update session");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeWithAMPM = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "P.M." : "A.M.";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const columns = [
    {
      title: "Subject",
      key: "subject",
      render: (_, record) => (
        <div className="subject-cell">
          <div className="subject-icon">
            <BookOutlined />
          </div>
          <div className="subject-info">
            <Text strong className="subject-name">
              {record.subject}
            </Text>
            <Text className="subject-description">
              {record.description.length > 60
                ? `${record.description.substring(0, 60)}...`
                : record.description}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Schedule",
      key: "schedule",
      render: (_, record) => (
        <div className="schedule-cell">
          <div className="schedule-date">
            <CalendarOutlined className="schedule-icon" />
            <Text>{record.date ? dayjs(record.date).format("ddd, MMM D, YYYY") : "N/A"}</Text>
          </div>
          <div className="schedule-time">
            <ClockCircleOutlined className="schedule-icon" />
            <Text>
              {formatTimeWithAMPM(record.startTime)} - {formatTimeWithAMPM(record.endTime)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Subject Code",
      key: "code",
      render: (_, record) => (
        <div className="link-cell">
          <div className="link-avatar">{record.code}</div>
        </div>
      ),
    },
    {
      title: "Capacity",
      key: "capacity",
      align: "center",
      render: (_, record) => {
        const enrolled = record.enrolledStudents?.length || 0;
        const max = record.maxStudents || 0;
        const percentage = max > 0 ? (enrolled / max) * 100 : 0;
        let statusColor = successColor;

        if (percentage >= 90) statusColor = dangerColor;
        else if (percentage >= 70) statusColor = warningColor;

        return (
          <div className="capacity-cell">
            <div className="capacity-text">
              <Text strong>{enrolled}</Text>
              <Text type="secondary">/</Text>
              <Text>{max}</Text>
            </div>
            <div className="capacity-bar-container">
              <div
                className="capacity-bar-fill"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: statusColor,
                }}
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Tag className={`status-tag ${record.isCancelled ? "cancelled" : "active"}`}>
          {record.isCancelled ? "Cancelled" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="action-buttons">
          <Tooltip title="View Details">
            <Button
              type="text"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => showModal(record)}
              className="action-button view"
            />
          </Tooltip>
          <Tooltip title="Edit Session">
            <Button
              type="text"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditSession(record)}
              className="action-button edit"
            />
          </Tooltip>
          <Tooltip title="Delete Session">
            <Button
              type="text"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id, record.subject)}
              className="action-button delete"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const renderAddSessionModal = () => (
    <Modal
      title={null}
      open={isAddSessionModalOpen}
      onCancel={() => {
        setIsAddSessionModalOpen(false);
        form.resetFields();
      }}
      footer={null}
      width={640}
      centered
      className="add-session-modal"
      closeIcon={<div className="modal-close-icon">×</div>}
    >
      <div className="modal-custom-header">
        <div className="modal-icon-container">
          <BookOutlined className="modal-icon" />
        </div>
        <div className="modal-title">Add New Session</div>
        <div className="modal-subtitle">Create a new learning session</div>
      </div>

      <div className="modal-body">
        <Form form={form} layout="vertical" onFinish={onAddSessionFinish} initialValues={{ isCancelled: "false" }}>
          <div className="form-section">
            <div className="section-title">Session Information</div>
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: "Please select subject!" }]}
            >
              <Select
                placeholder="Select session subject"
                className="form-select"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                onChange={handleSubjectChange}
              >
                {SUBJECTS.map((subject) => (
                  <Option key={subject} value={subject}>
                    {subject}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="code" label="Subject Code">
              <Input
                prefix={<CodeOutlined />}
                placeholder="Auto-filled subject code"
                className="form-input"
                readOnly
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <Input.TextArea
                placeholder="Enter session description"
                className="form-input"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
          </div>

          <div className="form-section">
            <div className="section-title">Schedule</div>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select date!" }]}
            >
              <DatePicker
                className="form-input"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current < dayjs().startOf("day")}
              />
            </Form.Item>

            <div className="form-row">
              <Form.Item
                name="startTime"
                label="Start Time"
                rules={[{ required: true, message: "Please select start time!" }]}
                className="form-item"
              >
                <TimePicker
                  className="form-input"
                  style={{ width: "100%" }}
                  format="h:mm A"
                  use12Hours
                />
              </Form.Item>

              <Form.Item
                name="endTime"
                label="End Time"
                rules={[{ required: true, message: "Please select end time!" }]}
                className="form-item"
              >
                <TimePicker
                  className="form-input"
                  style={{ width: "100%" }}
                  format="h:mm A"
                  use12Hours
                />
              </Form.Item>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">Additional Details</div>
            <div className="form-row">
              <Form.Item
                name="maxStudents"
                label="Max Students"
                rules={[{ required: true, message: "Please input maximum students!" }]}
                className="form-item"
              >
                <Input
                  type="number"
                  placeholder="Enter max students"
                  className="form-input"
                  min={1}
                />
              </Form.Item>
            </div>

            <Form.Item name="link" label="Session Link">
              <Input
                prefix={<LinkOutlined />}
                placeholder="Enter session link (optional)"
                className="form-input"
              />
            </Form.Item>
          </div>

          <div className="form-actions">
            <Button
              onClick={() => {
                setIsAddSessionModalOpen(false);
                form.resetFields();
              }}
              className="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
              className="submit-button"
            >
              Create Session
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );

  const renderEditSessionModal = () => (
    <Modal
      title={null}
      open={isEditSessionModalOpen}
      onCancel={() => {
        setIsEditSessionModalOpen(false);
        editForm.resetFields();
        setEditingSession(null);
      }}
      footer={null}
      width={640}
      centered
      className="edit-session-modal"
      closeIcon={<div className="modal-close-icon">×</div>}
    >
      <div className="modal-custom-header edit">
        <div className="modal-icon-container edit">
          <EditOutlined className="modal-icon" />
        </div>
        <div className="modal-title">Edit Session</div>
        <div className="modal-subtitle">Update session information</div>
      </div>

      <div className="modal-body">
        <Form form={editForm} layout="vertical" onFinish={onEditSessionFinish}>
          <div className="form-section">
            <div className="section-title">Session Information</div>
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: "Please select subject!" }]}
            >
              <Select
                placeholder="Select session subject"
                className="form-select"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                onChange={handleEditSubjectChange}
              >
                {SUBJECTS.map((subject) => (
                  <Option key={subject} value={subject}>
                    {subject}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="code" label="Subject Code">
              <Input
                prefix={<CodeOutlined />}
                placeholder="Auto-filled subject code"
                className="form-input"
                readOnly
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <Input.TextArea
                placeholder="Enter session description"
                className="form-input"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
          </div>

          <div className="form-section">
            <div className="section-title">Schedule</div>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select date!" }]}
            >
              <DatePicker
                className="form-input"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current < dayjs().startOf("day")}
              />
            </Form.Item>

            <div className="form-row">
              <Form.Item
                name="startTime"
                label="Start Time"
                rules={[{ required: true, message: "Please select start time!" }]}
                className="form-item"
              >
                <TimePicker
                  className="form-input"
                  style={{ width: "100%" }}
                  format="h:mm A"
                  use12Hours
                />
              </Form.Item>

              <Form.Item
                name="endTime"
                label="End Time"
                rules={[{ required: true, message: "Please select end time!" }]}
                className="form-item"
              >
                <TimePicker
                  className="form-input"
                  style={{ width: "100%" }}
                  format="h:mm A"
                  use12Hours
                />
              </Form.Item>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">Additional Details</div>
            <div className="form-row">
              <Form.Item
                name="maxStudents"
                label="Max Students"
                rules={[{ required: true, message: "Please input maximum students!" }]}
                className="form-item"
              >
                <Input
                  type="number"
                  placeholder="Enter max students"
                  className="form-input"
                  min={1}
                />
              </Form.Item>

              <Form.Item
                name="isCancelled"
                label="Status"
                rules={[{ required: true, message: "Please select status!" }]}
                className="form-item"
              >
                <Select className="form-select">
                  <Option value="false">Active</Option>
                  <Option value="true">Cancelled</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item name="link" label="Session Link">
              <Input
                prefix={<LinkOutlined />}
                placeholder="Enter session link (optional)"
                className="form-input"
              />
            </Form.Item>
          </div>

          <div className="form-actions">
            <Button
              onClick={() => {
                setIsEditSessionModalOpen(false);
                editForm.resetFields();
                setEditingSession(null);
              }}
              className="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={() => editForm.submit()}
              className="submit-button edit"
            >
              Update Session
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );

  return (
    <div className="sessions-page-container">
      <div className="sessions-dashboard">
        <Card className="sessions-card">
          <div className="sessions-header">
            <div className="header-left">
              <div className="header-title-container">
                <BookOutlined className="header-icon" />
                <div className="header-text">
                  <Title level={2} className="sessions-title">
                    {userRole === "teacher" ? "My Teaching Sessions" : "Sessions Management"}
                  </Title>
                  <Text className="sessions-subtitle">
                    {userRole === "teacher" ? "Manage your teaching sessions" : "Manage all sessions in the system"}
                  </Text>
                </div>
              </div>

              <div className="header-search">
                <Input prefix={<SearchOutlined />} placeholder="Search sessions..." className="search-input" />
                <Button icon={<FilterOutlined />} className="filter-button">
                  Filter
                </Button>
              </div>
            </div>

            {userRole !== "student" && (
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={handleAddSession}
                size="large"
                className="add-session-button"
              >
                Add New Session
              </Button>
            )}
          </div>

          <div className="table-container">
            <Table
              columns={columns}
              dataSource={sessions}
              loading={loading}
              rowKey="_id"
              scroll={{ x: true }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                className: "custom-pagination",
              }}
              className="sessions-table"
              rowClassName={(record) => `table-row ${record.isCancelled ? "cancelled-row" : ""}`}
            />
          </div>
        </Card>
      </div>

      {/* Session Details Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={520}
        centered
        className="session-modal"
        closeIcon={<div className="modal-close-icon">×</div>}
      >
        {selectedSession && (
          <div className="session-modal-content">
            <div className="session-modal-header">
              <div className="session-modal-subject-icon">
                <BookOutlined />
              </div>
              <Title level={2} className="session-modal-title">
                {selectedSession.subject}
              </Title>
              <Tag className={`session-status-tag ${selectedSession.isCancelled ? "cancelled" : "active"}`}>
                {selectedSession.isCancelled ? "Cancelled" : "Active"}
              </Tag>
            </div>

            <div className="session-modal-body">
              <div className="session-info-section">
                <h3 className="section-title">Session Details</h3>

                <div className="session-info-item">
                  <div className="info-icon">
                    <CalendarOutlined />
                  </div>
                  <div className="info-content">
                    <Text className="info-label">Date</Text>
                    <Text strong className="info-value">
                      {selectedSession.date ? dayjs(selectedSession.date).format("dddd, MMMM D, YYYY") : "N/A"}
                    </Text>
                  </div>
                </div>

                <div className="session-info-item">
                  <div className="info-icon">
                    <ClockCircleOutlined />
                  </div>
                  <div className="info-content">
                    <Text className="info-label">Time</Text>
                    <Text strong className="info-value">
                      {formatTimeWithAMPM(selectedSession.startTime)} -{" "}
                      {formatTimeWithAMPM(selectedSession.endTime)}
                    </Text>
                  </div>
                </div>

                <div className="session-info-item description">
                  <div className="info-icon">
                    <BookOutlined />
                  </div>
                  <div className="info-content">
                    <Text className="info-label">Description</Text>
                    <Text className="info-value description-text">{selectedSession.description}</Text>
                  </div>
                </div>

                {selectedSession.link && (
                  <div className="session-info-item">
                    <div className="info-icon">
                      <LinkOutlined />
                    </div>
                    <div className="info-content">
                      <Text className="info-label">Session Link</Text>
                      <a
                        href={selectedSession.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-value link"
                      >
                        {selectedSession.link}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <Divider className="modal-divider" />

              <div className="session-info-section">
                <h3 className="section-title">Participants</h3>

                <div className="session-info-item">
                  <div className="info-icon">
                    <UserSwitchOutlined />
                  </div>
                  <div className="info-content">
                    <Text className="info-label">Teacher</Text>
                    <Text strong className="info-value">
                      {selectedSession.teacher?.firstName} {selectedSession.teacher?.lastName}
                    </Text>
                  </div>
                </div>

                <div className="session-info-item">
                  <div className="info-icon">
                    <TeamOutlined />
                  </div>
                  <div className="info-content">
                    <Text className="info-label">Students Enrolled</Text>
                    <div className="capacity-indicator">
                      <Text strong className="info-value">
                        {selectedSession.enrolledStudents?.length || 0}/{selectedSession.maxStudents || "N/A"}
                      </Text>
                      <div className="capacity-bar-container modal">
                        <div
                          className="capacity-bar-fill"
                          style={{
                            width: `${
                              selectedSession.maxStudents
                                ? (selectedSession.enrolledStudents?.length / selectedSession.maxStudents) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {(userRole === "admin" || (userRole === "teacher" && selectedSession.teacher?._id === userId)) && (
                <div className="modal-actions admin">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      setIsModalOpen(false);
                      handleEditSession(selectedSession);
                    }}
                    className="modal-action-button edit"
                  >
                    Edit Session
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setIsModalOpen(false);
                      handleDelete(selectedSession._id, selectedSession.subject);
                    }}
                    className="modal-action-button delete"
                  >
                    Delete Session
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Session Modal */}
      {renderAddSessionModal()}

      {/* Edit Session Modal */}
      {renderEditSessionModal()}
    </div>
  );
}