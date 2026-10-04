import { about, profile } from "../data/sakshi";
import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="journey">
      <div className="about-me">
        <h3 className="title">{about.heading}</h3>
        <p className="para">{about.story}</p>
      </div>
      <div className="about-vision">
        <h4>{about.vision.subheading}</h4>
        <h3>{about.vision.headline}</h3>
        <p>{about.vision.paragraph}</p>
        <span className="about-signoff">{profile.fullName}</span>
      </div>
    </div>
  );
};

export default About;
