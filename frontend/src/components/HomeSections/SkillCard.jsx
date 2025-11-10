import React from "react";
import "./SkillCard.css";

function SkillCard({ skill }) {
  return (
    <div className="skill-card">
      <img src={skill.img} alt={skill.title} className="skill-image" />
      <div className="skill-info">
        <p className="learners">👥 {skill.learners} learners</p>
        <h3>{skill.title}</h3>
      </div>
    </div>
  );
}

export default SkillCard;
