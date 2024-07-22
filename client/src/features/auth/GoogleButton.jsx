import { useState } from "react";
import LoadingButton from "../../components/LoadingButton";
import toast from "react-hot-toast";

const GoogleButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    fetch(
      `${import.meta.env.VITE_BE_URL}/oauth/google/authorize?` +
        new URLSearchParams({
          redirect_url: `${import.meta.env.VITE_REDIRECT_URL}`,
        }),
      {
        method: "GET",
        credentials: "include", // Session cookies will be included
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Đăng nhập bằng Google chưa hỗ trợ!");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        window.location.href = data.authorize_url;
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <button className="btn btn-primary rounded-xl w-full" onClick={handleClick}>
      <img src="/google.svg" className="h-6 w-6" />
      <LoadingButton isLoading={isLoading}>Tiếp tục với Google</LoadingButton>
    </button>
  );
};

export default GoogleButton;
