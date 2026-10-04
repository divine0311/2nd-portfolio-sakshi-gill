import { PropsWithChildren } from "react";
import { profile } from "../data/sakshi";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>{profile.intro}</h2>
            <h1>
              {profile.firstName.toUpperCase()}
              <br />
              <span>{profile.lastName.toUpperCase()}</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>A Creative</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{profile.rotatingRoles[0]}</div>
              <div className="landing-h2-2">{profile.rotatingRoles[1]}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">
                {profile.rotatingRoles[2]}
              </div>
              <div className="landing-h2-info-1">
                {profile.rotatingRoles[0]}
              </div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
