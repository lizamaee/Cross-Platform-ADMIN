import { Tooltip } from "antd";
import React, { ReactNode } from "react";

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
    handleParticipants?: (id: string) => void;
    icon1?: ReactNode;
    icon2?: ReactNode;
    action?: string;
    actionStyle?: string;
    error?: string;
    electionType?: string;
  }

const ElectionTable: React.FC<ElectionTableProps>  = ({ election, handleParticipants, handleElection, action, icon1, icon2, actionStyle, error, electionType }) => {

  if(!election?.length){
    return (
    <div className="no election">
      <h1 className="text-center text-sm md:text-base font-semibold dark:text-gray-400">No {electionType} election.</h1>
    </div>
    )
  }else{
    return (
      <table className="w-full h-full text-center pt-10 text-sm drop-shadow-md">
        <thead>
          <tr className="sm:pop-semibold border-t-2 border-neutral-200 dark:border-neutral-700 text-sm dark:text-gray-200">
            <th className="py-3 text-xs sm:text-sm">Title</th>
            <th className="py-3 text-xs sm:text-sm">Status</th>
            <th className="py-3 text-xs sm:text-sm">Start</th>
            <th className="py-3 text-xs sm:text-sm">End</th>
            <th className="py-3 text-xs sm:text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
        { error && (
          <tr>
            <td colSpan={5} className="pop-semibold text-sm tracking-widest py-5 opacity-50 dark:text-gray-200">{error}</td>
          </tr>
        )}
        { !error && election?.map((entry, index) => (
          <tr
            key={index}
            className={` rounded-md align-middle dark:text-gray-200 ${
              index % 2 === 0 ? "bg-[#eaf4fc] dark:bg-[#2B2B2B]" : "bg-white dark:bg-[#333333]"
            }`}
          >
            <td className="py-5 text-xs sm:text-sm">{entry.title}</td>
            <td className="py-5 text-xs sm:text-sm">{entry.status}</td>
            <td className="py-5 text-xs sm:text-sm">
              {new Date(entry.startDate).toLocaleDateString("en-US", {
                timeZone: "Asia/Manila",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </td>
            <td className="py-5 text-xs sm:text-sm">
              {new Date(entry.endDate).toLocaleDateString("en-US", {
                timeZone: "Asia/Manila",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </td>
            <td>
              
              {electionType === "upcoming" && (
                <button
                onClick={() => handleElection && handleElection(String(entry.id))}
                className={`pop-medium text-center py-2 text-xs sm:text-sm px-4 rounded-full ${actionStyle}`}
                >
                  { action }
                </button>
              )}

              {electionType === "ongoing" && (
                <div className="action-icon flex items-center justify-center gap-1">
                  <Tooltip title='Participants' color='#676767'>
                    <button
                      onClick={() => handleParticipants && handleParticipants(String(entry.id))}
                      className={`pop-medium text-center py-1 text-xs sm:text-sm px-1 rounded-full bg-[#676767] dark:bg-zinc-700 hover:bg-zinc-600 `}
                      >
                      { icon1 }
                    </button>
                  </Tooltip>
                  <Tooltip title='View' color='#115e59'>
                    <button
                      onClick={() => handleElection && handleElection(String(entry.id))}
                      className={`pop-medium text-center py-1 text-xs sm:text-sm px-1  ${actionStyle}`}
                      >
                      { icon2 }
                    </button>
                  </Tooltip>
                 
                </div>
                
              )}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    )
  }
  
  
}

export default ElectionTable;
