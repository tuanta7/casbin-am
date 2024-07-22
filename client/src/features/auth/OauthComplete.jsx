import ReactJson from "@vahagn13/react-json-view";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useGlobalContext from "../../hooks/useGlobalContext";

const OauthComplete = () => {
  const queryClient = useQueryClient();
  const { setAccessToken } = useGlobalContext();
  const { isPending, error, data } = useQuery({
    queryKey: ["oauth"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BE_URL}/oauth/google/token`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.status == "success") {
            toast.success("Đăng nhập thành công");
          }
          setAccessToken(resJson.data.access_token);
          queryClient.invalidateQueries(["userinfo"]);
          return resJson;
        }),
  });

  if (isPending) return "Loading...";
  if (error) return "Có lỗi xảy ra: " + error.message;

  return (
    <div>
      <h2>Đăng nhập thành công</h2>
      <p>Dữ liệu trả về: </p>
      <p className="max-w-96 break-words mt-3">
        <ReactJson src={data} indentWidth={2} />
      </p>
    </div>
  );
};

export default OauthComplete;
