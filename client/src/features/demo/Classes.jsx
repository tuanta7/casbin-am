import { useQuery } from "@tanstack/react-query";
import ClassDelete from "./ClassDelete";
import useGlobalContext from "../../hooks/useGlobalContext";

const Classes = () => {
  const { accessToken } = useGlobalContext();

  const { data } = useQuery({
    queryKey: ["classes"],
    queryFn: () =>
      fetch("http://localhost:3000/classes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res?.data?.classes),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Danh sách lớp học</h1>
      {data?.map((item) => (
        <div
          key={item.id}
          className="mb-3 flex items-center p-3 border border-neutral-500 w-1/2 rounded-lg"
        >
          <h2 className="w-44">{item.name}</h2>
          <p className="w-96">{item.schedule}</p>
          <div className="w-96 flex justify-end">
            <ClassDelete id={item.id} />
          </div>
        </div>
      ))}
    </div>
  );
};
Classes.propTypes = {};

export default Classes;
