import React from 'react';
import {IoClose} from 'react-icons/io5'

interface Props {
  seatCandidates: {
    id: string;
    position: string;
    candidates: {
        id: string;
        fullname: string;
        party: string;
        count: number;
    }[];
    
  }[];
  handleClose: () => void;
}

const CandidatesResults: React.FC<Props> = ({ seatCandidates, handleClose }) => {
  return (
        <>
            <div className="shade fixed top-0 left-0  w-full h-screen z-10 bg-[#3333339f]">
            <div className="candidate-wrapper flex justify-center flex-col items-center h-full z-40">
                <div className="title-btn rounded-t-2xl flex justify-between items-center text-white bg-gray-400 dark:bg-[#596374] py-3 px-5 w-5/6 dark:border-b dark:border-gray-600">
                    <h2 className='px-6 pop-bold lg:text-xl '>Votes</h2>
                    <button  onClick={handleClose} className='text-gray-800 dark:text-[#b7bfcd] sticky z-50 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-xl'><IoClose size={30}/></button>
                </div>
                <div className="centered relative  w-5/6 bg-white dark:bg-[#4a4a4a] overflow-y-auto h-5/6 rounded-b-2xl">
                    {seatCandidates?.map((candidate) => (
                        <div key={candidate.id} className="candidate-votes text-[#0f0e2c] dark:text-white text-sm dark:bg-gray-500">
                            <h1 className='text-center text-white pop-bold md:text-lg py-3 bg-[#444a5e] dark:bg-zinc-700 '>{candidate.position}</h1>

                            <table  className="person px-5 w-full ">
                                        <thead className='pop-bold bg-gray-200 dark:bg-[#5c5c5c] '>
                                        <tr>
                                            <th className='py-2'>Candidate</th>
                                            <th className='py-2'>Party</th>
                                            <th className='py-2'>Votes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {candidate.candidates?.map((person) => (
                                            <tr key={person.id} className="person bg-white dark:bg-[#4a4a4a] px-5 w-full text-center pop-semibold">
                                                <td className='pop-semibold text-sm py-2'>{person.fullname}</td>
                                                <td className='pop-semibold text-sm py-2'>{person.party}</td>
                                                <td className='pop-semibold text-sm py-2'>{person.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                            </table>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </>
  );
};

export default CandidatesResults;
