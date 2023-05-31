import { useState } from 'react';
import {BsPlus, BsShieldFillExclamation} from 'react-icons/bs'
import CreateElection from './CreateElection';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RiDeleteBin5Fill, RiEditBoxFill } from 'react-icons/ri';
import { Modal } from 'antd';

interface DataType {
  id: string;
  org_name: string;
  logo_url: string;
  startDate: string;
  endDate: string;
}

export default function OrganizationTab() {
  const [renderCreate, setRenderCreate] = useState(false)

  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()



  const fetchData = async (endpoints: string) => {
    try {
      const response = await axiosPrivate.get(`/${endpoints}`);
      return response.data
    } catch (error: any) {
      if (error.response) {
        if(error.response.status === 403){
          navigate('/login', {state: {from: location}, replace: true});
        }
        return [error.response.data ];
      }
      //Dead Server Return
      return [{error: error.message }];
    }
  }
  
  //Organizations Query
  const fetchOrganizations = async () => {
    return await fetchData('organization');
  };
  const organizationsQuery = useQuery(
    {queryKey: ['organizations'], queryFn: fetchOrganizations},
  ) 
  
  const d: DataType[] = organizationsQuery.data?.map((item: any) => ({
    key: item.id,
    org_name: item.org_name,
    logo_url: item.logo_url,
    startDate: new Date(item.startDate).toLocaleDateString("en-US", {
      timeZone: "Asia/Manila",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    endDate: new Date(item.endDate).toLocaleDateString("en-US", {
      timeZone: "Asia/Manila",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }))

  async function handleDeleteOrganization(id: string) {
    try {
      const response = await axiosPrivate.delete(`organization/${id}`);
      console.log(response.data.message);
    } catch (error) {
      console.log('Oops, an error occurred:', error);
    }
  }

  const closeCreateForm = () => {
    setRenderCreate(false)
  }

  const deleteIt = (id: string, name: string) => {
    Modal.confirm({
      title: 'Do you want to delete this Organization?',
      content: `Deleting organization: ${name}`,
      className: 'text-gray-700',
      onOk() {
        return new Promise((resolve, reject) => {
          // setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          handleDeleteOrganization(id)
            .then(resolve)
            .catch(reject);
        }).catch(() => console.log('Oops, an error occurred!'));
      },
      onCancel() {},
    });
  }



  return (
    <div className='Election bg-white dark:bg-[#303030] rounded-b-lg shadow-md'>
      {/* CREATE BUTTON */}
      <div className="top flex pb-4 justify-end px-3">
        <button onClick={()=> setRenderCreate(true)} className='flex justify-center items-center py-1 md:py-2 pr-3 pl-1 text-white pop-medium bg-[#3961ee] rounded-2xl'>
          <BsPlus size={30} />
          <h3 className='text-sm md:text-md'>Create Organization</h3>
        </button>
      </div>
      {/* CREATE BUTTON */}

      {renderCreate && (<CreateElection title='Create Election' handleClose={closeCreateForm}/>)}

      {/* ALL ORGANIZATIONS */}
      <div className="container w-full mx-auto p-4 overflow-x-auto">
        <div className="grid items-center md:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {organizationsQuery.data?.map((org:DataType) =>(
            <div key={org.id} className="card p-2 shadow-md rounded-2xl dark:bg-[#2a2a2a]">
              <div className="img-container w-full rounded-lg overflow-hidden">
                <img className='bg-cover' src={org.logo_url || "https://shorturl.at/uIRY1"} alt="" />
              </div>
              <h3 className='pop-semibold text-[#303030] dark:text-gray-200 text-center pt-3 pb-1'>{org.org_name}</h3>
              <div className="dates flex text-xs justify-between text-gray-500 pop-regular">
                <p className="">
                  {new Date(org.startDate).toLocaleDateString("en-US", {
                    timeZone: "Asia/Manila",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-right">
                  {new Date(org.endDate).toLocaleDateString("en-US", {
                    timeZone: "Asia/Manila",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="actions flex justify-between py-2">
                <button
                  onClick={(e) => deleteIt(org.id, org.org_name)}
                  className={`pop-medium text-center align-middle p-2 rounded-xl text-white bg-red-400 shadow-sm shadow-red-400 focus:outline-none`}
                >
                  <RiDeleteBin5Fill />
                </button>
                <button
                  onClick={() =>console.log("Edited")}
                  className={`pop-medium text-center align-middle p-2 rounded-xl text-white bg-blue-400 shadow-sm shadow-blue-400 focus:outline-none`}
                >
                  <RiEditBoxFill />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* ALL ORGANIZATIONS */}
    </div>
  )
}




