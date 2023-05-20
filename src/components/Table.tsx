import { RiDeleteBin5Fill, RiEditBoxFill } from "react-icons/ri";

type TableProps = {
  data: {
    id: number;
    title: string;
    status: string;
    startDate: string;
    endDate: string;
  }[];
  handleElectionDelete: (id: string) => void;
};

export default function Table({ data, handleElectionDelete }: TableProps) {
  return (
    <table className="w-full table-auto text-center ">
      <thead>
        <tr>
          <th className="px-4 border-b py-2">Title</th>
          <th className="px-4 border-b py-2">Status</th>
          <th className="px-4 border-b py-2">Start Date</th>
          <th className="px-4 border-b py-2">End Date</th>
          <th className="px-4 border-b py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr className="" key={index}>
            <td className=" px-4 py-2">{item.title}</td>
            <td className=" px-4 py-2">{item.status}</td>
            <td className=" px-4 py-2">
              {new Date(item.startDate).toLocaleDateString("en-US", {
                timeZone: "Asia/Manila",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </td>
            <td className=" px-4 py-2">
              {new Date(item.endDate).toLocaleDateString("en-US", {
                timeZone: "Asia/Manila",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </td>

            <td className="py-4 px-2 flex gap-1 justify-center items-center">
              <button
                onClick={() =>
                  handleElectionDelete && handleElectionDelete(String(item.id))
                }
                className={`pop-medium text-center align-middle py-2 px-4 rounded-full text-white bg-red-400`}
              >
                <RiDeleteBin5Fill />
              </button>
              <button
                onClick={() =>
                  handleElectionDelete && handleElectionDelete(String(item.id))
                }
                className={`pop-medium text-center align-middle py-2 px-4 rounded-full text-white bg-green-400`}
              >
                <RiEditBoxFill />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
