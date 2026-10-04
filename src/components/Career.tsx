import { education } from "../data/sakshi";
import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="qualifications">
      <div className="career-container">
        <h2>
          My <span>qualifications</span>
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {education.map((entry) => (
            <div className="career-info-box" key={entry.org + entry.period}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{entry.role}</h4>
                  <h5>{entry.org}</h5>
                </div>
                <h3>{entry.period}</h3>
              </div>
              <p>{entry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
