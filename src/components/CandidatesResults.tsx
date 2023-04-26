import React from 'react';

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
}

const CandidatesResults: React.FC<Props> = ({ seatCandidates }) => {
  return (
        <div className="shade absolute top-0 left-0 bg-green-400 w-full min-h-full z-10 dark:bg-[#3333339f]">
            <div className="candidate-wrapper flex justify-center items-center flex-col py-24  overflow-hidden z-20">
                <div className="centered  w-4/6 bg-blue-400 overflow-hidden rounded-2xl">
                    {seatCandidates?.map((candidate) => (
                        <div key={candidate.id} className="candidate-votes text-white text-sm dark:bg-gray-500">
                            <h1 className='text-center pop-bold md:text-lg py-3 dark:bg-[#333333]'>{candidate.position}</h1>

                            <table  className="person px-5 w-full">
                                    <thead>
                                        <tr>
                                            <th className='py-2'>Candidate</th>
                                            <th className='py-2'>Party</th>
                                            <th className='py-2'>Votes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                            {candidate.candidates?.map((person) => (
                                <tr key={person.id} className="person bg-blue-300 px-5 w-full text-center pop-semibold">
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
  );
};

export default CandidatesResults;
