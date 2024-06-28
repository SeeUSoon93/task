import React, { useState, useEffect } from "react";
import {
  db,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "../firebase";
import ProjectCard from "./ProjectCard";
import AddProjectModal from "./AddProjectModal";
import AddScheduleModal from "./AddScheduleModal"; // 일정 추가 모달 컴포넌트 추가
import ScheduleView from "./ScheduleView"; // 일정 보기 컴포넌트 추가
import { Tabs } from "antd";
import "./css/MainContent.css";

const { TabPane } = Tabs;

const MainContent = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const snapshot = await getDocs(projectsCollection);
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    const projectDoc = doc(db, "projects", id);
    await deleteDoc(projectDoc);
    setProjects(projects.filter((project) => project.id !== id));
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsProjectModalVisible(true);
  };

  const handleUpdate = async (updatedProject) => {
    const projectDoc = doc(db, "projects", updatedProject.id);
    const formattedProject = {
      ...updatedProject,
      period: updatedProject.period.map((date) => new Date(date)), // Date 객체로 변환
      requirements: updatedProject.requirements
        ? updatedProject.requirements.filter((req) => req.requirement)
        : [],
    };
    await updateDoc(projectDoc, formattedProject);
    setProjects(
      projects.map((project) =>
        project.id === updatedProject.id ? formattedProject : project
      )
    );
    setIsProjectModalVisible(false);
    setEditingProject(null);
  };

  const handleScheduleAdd = (project) => {
    setCurrentProject(project);
    setIsScheduleModalVisible(true);
  };

  const handleScheduleCreate = async (newSchedule) => {
    const projectDoc = doc(db, "projects", currentProject.id);
    const updatedSchedules = [...(currentProject.schedules || []), newSchedule];
    await updateDoc(projectDoc, { schedules: updatedSchedules });
    setProjects(
      projects.map((project) =>
        project.id === currentProject.id
          ? { ...project, schedules: updatedSchedules }
          : project
      )
    );
    setIsScheduleModalVisible(false);
    setCurrentProject(null);
  };

  const handleCancel = () => {
    setIsProjectModalVisible(false);
    setEditingProject(null);
    setIsScheduleModalVisible(false);
    setCurrentProject(null);
  };

  return (
    <div className="main-content">
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="사업 보기" key="1">
          <div className="project-cards-container">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onScheduleAdd={handleScheduleAdd} // 일정 추가 핸들러
                />
              ))
            ) : (
              <p>진행중인 사업이 없습니다.</p>
            )}
          </div>
        </TabPane>
        <TabPane tab="일정 보기" key="2">
          준비중입니다.
          {/* <ScheduleView projects={projects} /> */}
        </TabPane>
      </Tabs>
      <AddProjectModal
        visible={isProjectModalVisible}
        onCancel={handleCancel}
        onCreate={handleUpdate}
        initialValues={editingProject}
      />
      <AddScheduleModal
        visible={isScheduleModalVisible}
        onCancel={handleCancel}
        onCreate={handleScheduleCreate}
      />
    </div>
  );
};

export default MainContent;
