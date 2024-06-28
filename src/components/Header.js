import React from "react";
import { Button, Input } from "antd";
import "./css/Header.css";

const AppHeader = ({ onAddProject, onSearchChange }) => {
  return (
    <div className="app-header">
      <h1 className="system-name">업무 관리 시스템</h1>
      <div className="header-right">
        <Input.Search
          placeholder="협력업체로 검색"
          className="search-input"
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button
          type="primary"
          className="add-project-button"
          onClick={onAddProject}
        >
          사업 추가
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
