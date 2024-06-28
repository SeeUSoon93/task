import React, { useState } from "react";
import { db, doc, deleteDoc, updateDoc } from "../firebase";
import ProjectCard from "./ProjectCard";
import AddScheduleModal from "./AddScheduleModal";
import ScheduleView from "./ScheduleView";
import { Tabs } from "antd";
import "./css/MainContent.css";

const { TabPane } = Tabs;

const MainContent = ({ projects, onEditProject, setProjects }) => {
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const handleDelete = async (id) => {
    const projectDoc = doc(db, "projects", id);
    await deleteDoc(projectDoc);
    setProjects(projects.filter((project) => project.id !== id));
  };

  const handleEdit = (project) => {
    onEditProject(project);
  };

  const handleScheduleAdd = (projectId, schedule) => {
    const project = projects.find((proj) => proj.id === projectId);
    const updatedSchedules = [...(project.schedules || []), schedule];
    const updatedProject = { ...project, schedules: updatedSchedules };

    const projectDoc = doc(db, "projects", projectId);
    updateDoc(projectDoc, { schedules: updatedSchedules });

    setProjects(
      projects.map((proj) => (proj.id === projectId ? updatedProject : proj))
    );
  };

  const handleCheckboxChange = async (projectId, index, checked) => {
    const project = projects.find((proj) => proj.id === projectId);
    const updatedRequirements = [...project.requirements];
    updatedRequirements[index].checked = checked;

    const projectDoc = doc(db, "projects", projectId);
    await updateDoc(projectDoc, { requirements: updatedRequirements });

    const updatedProject = { ...project, requirements: updatedRequirements };
    setProjects(
      projects.map((proj) => (proj.id === projectId ? updatedProject : proj))
    );
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
                  onScheduleAdd={handleScheduleAdd}
                  onCheckboxChange={handleCheckboxChange}
                />
              ))
            ) : (
              <p>진행중인 사업이 없습니다.</p>
            )}
          </div>
        </TabPane>
        <TabPane tab="일정 보기" key="2">
          <ScheduleView projects={projects} />
        </TabPane>
      </Tabs>
      <AddScheduleModal
        visible={isScheduleModalVisible}
        onCancel={handleCancel}
        onCreate={handleScheduleCreate}
      />
    </div>
  );
};

export default MainContent;
