import React from "react";

interface Election {
    id: number;
    title: string;
    status: string;
    startDate: string;
    endDate: string;
  }
  
  interface ElectionTableProps {
    election: Election[];
    handleElection?: (id: string) => void;
    action?: string;
    actionStyle?: string;
    error?: string;
  }

const ElectionTable: React.FC<ElectionTableProps>  = ({ election, handleElection, action, actionStyle, error }) => {
  
  return (
    <table className="w-full h-full text-center pt-10 text-sm overflow-x-scroll drop-shadow-md mb-3">
      <thead>
        <tr className="pop-semibold text-sm py-2 dark:text-gray-200">
          <th>Title</th>
          <th>Status</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      { error && (
        <tr>
          <td colSpan={5} className="pop-semibold text-sm tracking-widest pt-5 opacity-50 dark:text-gray-200">{error}</td>
        </tr>
      )}
      { !error && election?.map((entry, index) => (
        <tr
          key={index}
          className={` rounded-md align-middle ${
            index % 2 === 0 ? "bg-[#eaf4fc]" : "bg-white dark:bg-[#4a4a4a]"
          }`}
        >
          <td className="py-5">{entry.title}</td>
          <td className="py-5">{entry.status}</td>
          <td className="py-5">
            {new Date(entry.startDate).toLocaleDateString("en-US", {
              timeZone: "Asia/Manila",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </td>
          <td className="py-5">
            {new Date(entry.endDate).toLocaleDateString("en-US", {
              timeZone: "Asia/Manila",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </td>
          <td>
            <button
              onClick={() => handleElection && handleElection(String(entry.id))}
              className={`pop-medium text-center py-2 px-4 rounded-full ${actionStyle}`}
            >
              { action }
            </button>
          </td>
        </tr>
      ))}


        
        
      </tbody>
    </table>
  );
}

export default ElectionTable;
