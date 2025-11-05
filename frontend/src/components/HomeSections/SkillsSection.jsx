import React from "react";
import Slider from "react-slick";
import SkillCard from "./SkillCard";
import aiImg from "../../assets/ai1.png";
import itImg from "../../assets/it.png";
import dataImg from "../../assets/data.png";
import heroImg from "../../assets/hero.png";
import "./SkillsSection.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function SkillsSection() {
  const skills = [
    { title: "Generative AI", learners: "11M+", img: aiImg },
    { title: "IT Certifications", learners: "14.4M+", img: itImg },
    { title: "Data Science", learners: "8M+", img: dataImg },
    { title: "Web Development", learners: "10M+", img: heroImg },
    { title: "Cybersecurity", learners: "7.2M+", img: itImg },
  ];

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="skills">
      <h2>Learn essential career and life skills</h2>
      <p>
        Apical Soft helps you build in-demand skills fast and advance your
        career in a changing job market.
      </p>

      <div className="skills-carousel">
        <Slider {...settings}>
          {skills.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default SkillsSection;
