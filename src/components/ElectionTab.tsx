import axios from 'axios';
import { useEffect, useState } from 'react';
import {BsPlus} from 'react-icons/bs'
import Pagination from './Pagination';
import Table from './Table';
import { fetchData } from '../api/home';

export default function ElectionTab() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);

  useEffect(() => {
    const fetchElections = async () => {
      const response = await fetchData('election')
      //console.log(response);
      setData(response);
    };
    fetchElections();
  }, []);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber:number) => setCurrentPage(pageNumber);

  async function handleDeleteElection (id: string) {
    const token = localStorage.getItem("adminToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}election/${id}`, config)
    //console.log(response.data.message);  
  }
  
  return (
    <div className='Election bg-white rounded-b-lg shadow-md'>
      {/* CREATE BUTTON */}
      <div className="top flex pb-4 justify-end px-3">
        <button className='flex justify-center items-center py-2 pr-3 pl-1 text-white pop-medium bg-[#3961ee] rounded-2xl'>
          <BsPlus size={30} />
          <h3>Create Election</h3>
        </button>
      </div>
      {/* CREATE BUTTON */}

      {/* ALL ELECTIONS */}
      <div className="container mx-auto px-4 overflow-x-auto">
      <Table data={currentData}  handleElectionDelete={handleDeleteElection} />
      </div>
      <Pagination
        dataPerPage={dataPerPage}
        totalData={data.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      {/* ALL ELECTIONS */}
    </div>
  )
}



