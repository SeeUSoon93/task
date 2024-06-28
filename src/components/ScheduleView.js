import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Checkbox, Row, Col } from "antd";

const localizer = momentLocalizer(moment);

const ScheduleView = ({ projects }) => {
  const [events, setEvents] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    let eventsList = [];

    projects.forEach((project) => {
      if (project.schedules) {
        project.schedules.forEach((schedule) => {
          eventsList.push({
            title: project.title,
            start: new Date(schedule.period[0]),
            end: new Date(schedule.period[1]),
            content: schedule.content,
            requirements: schedule.requirements || [],
          });
        });
      }
    });

    setEvents(eventsList);
  }, [projects]);

  const handleEventClick = (event) => {
    setSelectedSchedule(event);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedSchedule(null);
  };

  return (
    <div className="schedule-view">
      <h2>일정 보기</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
      />
      <Modal
        title="일정 상세 정보"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedSchedule && (
          <>
            <p>사업명: {selectedSchedule.title}</p>
            <p>
              기간: {moment(selectedSchedule.start).format("YYYY-MM-DD")} ~{" "}
              {moment(selectedSchedule.end).format("YYYY-MM-DD")}
            </p>
            <p>내용: {selectedSchedule.content}</p>
            <div className="requirement-list">
              {selectedSchedule.requirements.map((req, index) => (
                <Row key={index} className="requirement-item">
                  <Col flex="auto">{req.requirement}</Col>
                  <Col>
                    <Checkbox />
                  </Col>
                </Row>
              ))}
            </div>
            <div className="modal-footer">
              <Button type="primary" style={{ marginRight: "8px" }}>
                수정
              </Button>
              <Button type="danger">삭제</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ScheduleView;
