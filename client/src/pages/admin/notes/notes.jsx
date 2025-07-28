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
  Divider,
} from "antd";
import {
  BookOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LinkOutlined,
  UserOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import "./note.css";

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

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  // Color scheme
  const primaryColor = "#4f46e5"; // Indigo 600
  const secondaryColor = "#0ea5e9"; // Sky 500
  const successColor = "#10b981"; // Emerald 500
  const dangerColor = "#ef4444"; // Red 500
  const warningColor = "#f59e0b"; // Amber 500

  const handleSubjectChange = (value) => {
    // Set the subject code based on the selected subject
    form.setFieldsValue({ subjectCode: subjectCodeMap[value] || "" });
  };

  const handleEditSubjectChange = (value) => {
    // Set the subject code based on the selected subject in edit form
    editForm.setFieldsValue({ subjectCode: subjectCodeMap[value] || "" });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const endpoint =
        userRole === "teacher"
          ? `http://localhost:5080/api/notes/teacher/${userId}`
          : "http://localhost:5080/api/notes";

      const { data } = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      message.error(error.response?.data?.message || "Failed to load notes");
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const noteToDelete = notes.find((note) => note._id === id);

    if (userRole !== "admin" && (userRole === "teacher" && noteToDelete?.createdBy?._id !== userId)) {
      message.error("You can only delete your own notes");
      return;
    }

    Modal.confirm({
      title: "Delete Note",
      content: (
        <div className="delete-confirmation">
          <div className="delete-icon">
            <DeleteOutlined style={{ color: dangerColor, fontSize: "24px" }} />
          </div>
          <p>
            Are you sure you want to delete the note <strong>"{title}"</strong>?
          </p>
          <p className="delete-warning">This action cannot be undone.</p>
        </div>
      ),
      okText: "Delete",
      okButtonProps: {
        danger: true,
        icon: <DeleteOutlined />,
      },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:5080/api/notes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          toast.success(`Note "${title}" deleted successfully`);
          fetchNotes();
        } catch (error) {
          console.error("Error deleting note:", error);
          toast.error(error.response?.data?.message || "Failed to delete note");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const showModal = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleAddNote = () => {
    setIsAddNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    if (userRole !== "admin" && (userRole === "teacher" && note.createdBy?._id !== userId)) {
      message.error("You can only edit your own notes");
      return;
    }

    setEditingNote(note);
    editForm.setFieldsValue({
      subject: note.subject,
      subjectCode: subjectCodeMap[note.subject] || "", // Auto-fill subject code
      title: note.title,
      caption: note.caption,
      classroomLink: note.classroomLink,
    });
    setIsEditNoteModalOpen(true);
  };

  const onAddNoteFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        "http://localhost:5080/api/notes",
        {
          ...values,
          createdBy: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Note added successfully");
        setIsAddNoteModalOpen(false);
        form.resetFields();
        fetchNotes();
      }
    } catch (error) {
      console.error("Error adding note:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add note. Please check all fields and try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onEditNoteFinish = async (values) => {
    try {
      console.log("Submitting edit with values:", values); // Debug log
      console.log("Editing note ID:", editingNote._id); // Debug log

      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const updateData = {
        ...values,
      };

      const response = await axios.put(
        `http://localhost:5080/api/notes/${editingNote._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response.data); // Debug log
      toast.success("Note updated successfully");
      setIsEditNoteModalOpen(false);
      editForm.resetFields();
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
      console.error("Full error response:", error.response); // Debug log
      message.error(error.response?.data?.message || "Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Subject",
      key: "subject",
      render: (_, record) => (
        <div className="note-title-cell">
          <BookOutlined className="note-icon" />
          <Text strong>{record.subject}</Text>
        </div>
      ),
    },
    {
      title: "Title",
      key: "title",
      render: (_, record) => (
        <div className="note-title-cell">
          <BookOutlined className="note-icon" />
          <Text strong>{record.title}</Text>
        </div>
      ),
    },
    {
      title: "Caption",
      key: "caption",
      render: (_, record) => (
        <Text className="note-caption">
          {record.caption.length > 60 ? `${record.caption.substring(0, 60)}...` : record.caption}
        </Text>
      ),
    },
    {
      title: "Subject Code",
      key: "subjectCode",
      render: (_, record) => <Tag className="subject-tag">{record.subjectCode}</Tag>,
    },
    {
      title: "Author",
      key: "createdBy",
      render: (_, record) => (
        <div className="author-cell">
          <div className="author-avatar">{record.createdBy?.firstName?.charAt(0) || "U"}</div>
          <Text>
            {record.createdBy?.firstName} {record.createdBy?.lastName}
          </Text>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => {
        const canEditDelete =
          userRole === "admin" || (userRole === "teacher" && record.createdBy?._id === userId);

        return (
          <Space size="middle">
            <Tooltip title="View Details">
              <Button
                type="text"
                shape="circle"
                icon={<EyeOutlined style={{ color: secondaryColor }} />}
                onClick={() => showModal(record)}
                className="action-button view"
              />
            </Tooltip>

            {canEditDelete && (
              <>
                <Tooltip title="Edit Note">
                  <Button
                    type="text"
                    shape="circle"
                    icon={<EditOutlined style={{ color: warningColor }} />}
                    onClick={() => handleEditNote(record)}
                    className="action-button edit"
                  />
                </Tooltip>

                <Tooltip title="Delete Note">
                  <Button
                    type="text"
                    shape="circle"
                    icon={<DeleteOutlined style={{ color: dangerColor }} />}
                    onClick={() => handleDelete(record._id, record.title)}
                    className="action-button delete"
                  />
                </Tooltip>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="notes-page-container">
      <div className="notes-dashboard">
        <Card className="notes-card" bordered={false}>
          <div className="notes-header">
            <div className="header-left">
              <div className="header-title-container">
                <BookOutlined className="header-icon" style={{ color: primaryColor }} />
                <div className="header-text">
                  <Title level={2} className="notes-title">
                    {userRole === "teacher" ? "My Notes" : "Notes Management"}
                  </Title>
                  <Text className="notes-subtitle" type="secondary">
                    {userRole === "teacher" ? "Manage your teaching notes" : "Manage all notes in the system"}
                  </Text>
                </div>
              </div>
            </div>

            {["admin", "teacher"].includes(userRole) && (
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={handleAddNote}
                size="large"
                className="add-note-button"
                style={{ backgroundColor: primaryColor }}
              >
                Add New Note
              </Button>
            )}
          </div>

          <div className="table-container">
            <Table
              columns={columns}
              dataSource={notes}
              loading={loading}
              rowKey="_id"
              scroll={{ x: true }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total) => `Total ${total} notes`,
              }}
              className="notes-table"
            />
          </div>
        </Card>
      </div>

      {/* Note Details Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={520}
        centered
        className="note-modal"
        closeIcon={<div className="modal-close-icon">×</div>}
      >
        {selectedNote && (
          <div className="note-modal-content">
            <div className="note-modal-header">
              <div className="note-modal-icon" style={{ backgroundColor: primaryColor }}>
                <BookOutlined style={{ color: "white" }} />
              </div>
              <Title level={2} className="note-modal-title">
                {selectedNote.title}
              </Title>
80              <Tag className="subject-tag-modal">{selectedNote.subjectCode}</Tag>
            </div>

            <div className="note-modal-body">
              <div className="note-info-section">
                <h3 className="section-title">Note Details</h3>

                <div className="note-info-item">
                  <Text className="info-label">Caption</Text>
                  <Text className="info-value">{selectedNote.caption}</Text>
                </div>

                {selectedNote.classroomLink && (
                  <div className="note-info-item">
                    <Text className="info-label">Classroom Link</Text>
                    <a
                      href={selectedNote.classroomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-value link"
                    >
                      <LinkOutlined /> {selectedNote.classroomLink}
                    </a>
                  </div>
                )}
              </div>

              <Divider className="modal-divider" />

              <div className="note-info-section">
                <h3 className="section-title">Author Information</h3>

                <div className="note-info-item">
                  <div className="author-info">
                    <div className="author-avatar-modal">
                      {selectedNote.createdBy?.firstName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <Text strong className="author-name">
                        {selectedNote.createdBy?.firstName} {selectedNote.createdBy?.lastName}
                      </Text>
                      <Text className="author-role">({selectedNote.createdBy?.role})</Text>
                    </div>
                  </div>
                </div>

                <div className="note-info-item">
                  <Text className="info-label">Created At</Text>
                  <Text className="info-value">{new Date(selectedNote.createdAt).toLocaleString()}</Text>
                </div>
              </div>

              {(userRole === "admin" || (userRole === "teacher" && selectedNote.createdBy?._id === userId)) && (
                <div className="modal-actions admin">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      setIsModalOpen(false);
                      handleEditNote(selectedNote);
                    }}
                    className="modal-action-button edit"
                  >
                    Edit Note
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setIsModalOpen(false);
                      handleDelete(selectedNote._id, selectedNote.title);
                    }}
                    className="modal-action-button delete"
                  >
                    Delete Note
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Note Modal */}
      <Modal
        title={null}
        open={isAddNoteModalOpen}
        onCancel={() => {
          setIsAddNoteModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={640}
        centered
        className="add-note-modal"
        closeIcon={<div className="modal-close-icon">×</div>}
      >
        <div className="modal-custom-header">
          <div className="modal-icon-container" style={{ backgroundColor: primaryColor }}>
            <BookOutlined style={{ color: "white" }} />
          </div>
          <div className="modal-title">Add New Note</div>
          <div className="modal-subtitle">Create a new teaching note</div>
        </div>

        <div className="modal-body">
          <Form form={form} layout="vertical" onFinish={onAddNoteFinish}>
            <div className="form-section">
              <div className="section-title">Note Information</div>
              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: "Please select subject!" }]}
              >
                <Select
                  placeholder="Select note subject"
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

              <Form.Item             
                name="subjectCode"
                label="Subject Code"
                rules={[{ required: true, message: "Please select a subject to auto-fill the code!" }]}
              >
                <Input
                  prefix={<CodeOutlined />}
                  placeholder="Auto-filled subject code"
                  className="form-input"
                  readOnly
                />
              </Form.Item>

              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please input title!" }]}
              >
                <Input placeholder="Enter note title" className="form-input" />
              </Form.Item>

              <Form.Item
                name="caption"
                label="Caption"
                rules={[{ required: true, message: "Please input caption!" }]}
              >
                <Input.TextArea
                  placeholder="Enter note caption"
                  className="form-input"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>
            </div>

            <div className="form-section">
              <div className="section-title">Additional Details</div>
              <Form.Item name="classroomLink" label="Classroom Link">
                <Input
                  prefix={<LinkOutlined />}
                  placeholder="Enter classroom link (optional)"
                  className="form-input"
                />
              </Form.Item>
            </div>

            <div className="form-actions">
              <Button
                onClick={() => {
                  setIsAddNoteModalOpen(false);
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
                style={{ backgroundColor: primaryColor }}
              >
                Create Note
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Edit Note Modal */}
      <Modal
        title={null}
        open={isEditNoteModalOpen}
        onCancel={() => {
          setIsEditNoteModalOpen(false);
          editForm.resetFields();
          setEditingNote(null);
        }}
        footer={null}
        width={640}
        centered
        className="edit-note-modal"
        closeIcon={<div className="modal-close-icon">×</div>}
      >
        <div className="modal-custom-header edit">
          <div className="modal-icon-container edit" style={{ backgroundColor: warningColor }}>
            <EditOutlined style={{ color: "white" }} />
          </div>
          <div className="modal-title">Edit Note</div>
          <div className="modal-subtitle">Update note information</div>
        </div>

        <div className="modal-body">
          <Form form={editForm} layout="vertical" onFinish={onEditNoteFinish}>
            <div className="form-section">
              <div className="section-title">Note Information</div>
              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: "Please select subject!" }]}
              >
                <Select
                  placeholder="Select note subject"
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

              <Form.Item
                name="subjectCode"
                label="Subject Code"
                rules={[{ required: true, message: "Please select a subject to auto-fill the code!" }]}
              >
              <Input prefix={<CodeOutlined />} placeholder="Auto-filled subject code" className="form-input" readOnly />
              </Form.Item>

              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please input title!" }]}
              >
                <Input placeholder="Enter note title" className="form-input" />
              </Form.Item>

              <Form.Item
                name="caption"
                label="Caption"
                rules={[{ required: true, message: "Please input caption!" }]}
              >
                <Input.TextArea
                  placeholder="Enter note caption"
                  className="form-input"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>
            </div>

            <div className="form-section">
              <div className="section-title">Additional Details</div>
              <Form.Item name="classroomLink" label="Classroom Link">
                <Input
                  prefix={<LinkOutlined />}
                  placeholder="Enter classroom link (optional)"
                  className="form-input"
                />
              </Form.Item>
            </div>

            <div className="form-actions">
              <Button
                onClick={() => {
                  setIsEditNoteModalOpen(false);
                  editForm.resetFields();
                  setEditingNote(null);
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
                style={{ backgroundColor: warningColor }}
              >
                Update Note
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}