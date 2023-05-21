import axios from 'axios';
import { useEffect, useState } from 'react';
import {BsPlus} from 'react-icons/bs'
import Pagination from './Pagination';
import Table from './Table';
import CreateElection from './CreateElection';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ElectionTab() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [renderCreate, setRenderCreate] = useState(false)

  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchData = async (endpoints: string) => {
      try {
    
        const response = await axiosPrivate.get(`/${endpoints}`);
        return response.data
      } catch (error: any) {
        //console.log(error.response.data.error.message)
        
    
        if (error.response) {
          // ✅ log status code here
          //Live Server Return
          //console.log(error.response.status);
          if(error.response.status === 403){
            navigate('/login', {state: {from: location}, replace: true});
          }
          return [error.response.data ];
        }
    
        //Dead Server Return
        return [{error: error.message }];
      }
    }
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
    const response = await axiosPrivate.delete(`${import.meta.env.VITE_API_URL}election/${id}`, config)
    //console.log(response.data.message);  
  }

  const closeCreateForm = () => {
    setRenderCreate(false)
  }

  
  return (
    <div className='Election bg-white rounded-b-lg shadow-md'>
      {/* CREATE BUTTON */}
      <div className="top flex pb-4 justify-end px-3">
        <button onClick={()=> setRenderCreate(true)} className='flex justify-center items-center py-1 md:py-2 pr-3 pl-1 text-white pop-medium bg-[#3961ee] rounded-2xl'>
          <BsPlus size={30} />
          <h3 className='text-sm md:text-md'>Create Election</h3>
        </button>
      </div>
      {/* CREATE BUTTON */}

      {renderCreate && (<CreateElection title='Create Election' handleClose={closeCreateForm}/>)}

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



