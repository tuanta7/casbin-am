import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useGlobalContext from "../../hooks/useGlobalContext";

const ClassDelete = ({ id }) => {
  const { accessToken } = useGlobalContext();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () =>
      fetch(`http://localhost:3000/classes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    onSuccess: async (res) => {
      if (res.status !== 204) {
        const data = await res.json();
        if (data?.detail?.decision === false) {
          return toast.error(data.detail.error);
        }
      }
      queryClient.invalidateQueries(["classes"]);
      toast.success("Xóa thành công");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Xóa thất bại: " + error.message);
    },
  });

  return (
    <button className="btn btn-sm" onClick={() => mutate()}>
      Xóa
    </button>
  );
};

ClassDelete.propTypes = {
  id: PropTypes.number.isRequired,
};

export default ClassDelete;
