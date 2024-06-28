import React, { useState } from "react";
import { Card, Button, Checkbox } from "antd";
import AddScheduleModal from "./AddScheduleModal";
import "./css/ProjectCard.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const ProjectCard = ({
  project,
  onDelete,
  onEdit,
  onScheduleAdd,
  onCheckboxChange,
}) => {
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);

  const startDate =
    project.period[0] instanceof firebase.firestore.Timestamp
      ? project.period[0].toDate().toLocaleDateString()
      : project.period[0] instanceof Date
      ? project.period[0].toLocaleDateString()
      : project.period[0];

  const endDate =
    project.period[1] instanceof firebase.firestore.Timestamp
      ? project.period[1].toDate().toLocaleDateString()
      : project.period[1] instanceof Date
      ? project.period[1].toLocaleDateString()
      : project.period[1];

  const handleScheduleAdd = (schedule) => {
    onScheduleAdd(project.id, schedule);
    setIsScheduleModalVisible(false);
  };

  return (
    <>
      <Card className="project-card">
        <div className="card-header">
          <h2>{project.title}</h2>
        </div>
        <div className="card-body">
          <div className="project-info">
            <span className="label button-like">주관 기관</span>
            {project.agency}
          </div>
          <div className="project-info">
            <span className="label button-like">협력 업체</span>
            {project.partner}
          </div>
          {project.period && project.period[0] && project.period[1] ? (
            <div className="project-info">
              <span className="label button-like">수행 기간</span>
              {startDate} ~ {endDate}
            </div>
          ) : (
            <div className="project-info">
              <span className="label button-like">수행 기간</span>
              기간 정보 없음
            </div>
          )}
          <div className="project-info">
            <span className="label button-like">지원금</span>
            {project.support} 원
          </div>
          <div className="project-info">
            <span className="label button-like">자부담금</span>
            {project.selfFund} 원
          </div>
          <div className="project-info">
            <span className="label button-like">합계</span>
            {project.sum} 원
          </div>
          <div className="project-info">
            <span className="label button-like">결과물</span>
            {project.result}
          </div>
          <div className="project-info">
            <span className="label button-like">현재 상태</span>
            {project.status}
          </div>
          <div className="project-info">
            <span className="label button-like">필요사항</span>
            <ul className="requirement-list">
              {project.requirements && project.requirements.length > 0 ? (
                project.requirements.map((req, index) => (
                  <li key={index} className="requirement-item">
                    {req.requirement}{" "}
                    <Checkbox
                      style={{ marginLeft: "8px" }}
                      checked={req.checked}
                      onChange={(e) =>
                        onCheckboxChange(project.id, index, e.target.checked)
                      }
                    />
                  </li>
                ))
              ) : (
                <li>필요사항 없음</li>
              )}
            </ul>
          </div>
        </div>
        <div className="card-footer">
          <Button
            style={{ marginRight: "8px", borderColor: "#d9d9d9" }}
            onClick={() => onEdit(project)}
          >
            수정
          </Button>
          <Button
            style={{ marginRight: "8px", borderColor: "#d9d9d9" }}
            onClick={() => onDelete(project.id)}
          >
            삭제
          </Button>
          <Button
            style={{ borderColor: "#d9d9d9" }}
            onClick={() => setIsScheduleModalVisible(true)}
          >
            일정 추가
          </Button>
        </div>
      </Card>
      <AddScheduleModal
        visible={isScheduleModalVisible}
        onCancel={() => setIsScheduleModalVisible(false)}
        onCreate={handleScheduleAdd}
      />
    </>
  );
};

export default ProjectCard;
