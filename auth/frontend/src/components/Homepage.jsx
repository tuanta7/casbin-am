import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin");
  });

  return (
    <div>
      <h1>Homepage</h1>
    </div>
  );
};
Homepage.propTypes = {};

export default Homepage;
