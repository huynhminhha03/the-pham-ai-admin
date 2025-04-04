import React, { Component, useEffect , useState } from 'react';
import { Table, Card, CardBody, Button } from "reactstrap";
import { adminApis, authAPI } from "helpers/api"
import user1 from "../../assets/images/users/user-1.jpg";
import { useHistory } from "react-router-dom"
 
function LatestTransactions() {
    const history = useHistory();
    const[users, setUsers] = useState([]);
        useEffect(()=>{
            const fetchUsers = async () => {
                try{
                    const response = await authAPI().get(`${adminApis.allUsers}?limit=5`);
                    setUsers(response.data.users)
                } catch(error){
                    console.error("Error get data:", error)
                }
            }
            fetchUsers()
        },[])
        const getStatusColor = (status) => {
            switch (status) {
                case true:
                    return "success";
                case false:
                    return "danger";              
            }
        };const getStatuscheck = (status) => {
            switch (status) {
                case true:
                    return "ON";
                case false:
                    return "OFF";              
            }
        };
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <h4 className="card-title mb-4">Latest Transactions</h4>

                        <div className="table-responsive">
                            <Table className="align-middle table-centered table-vertical table-nowrap">

                                <tbody>
                                    {
                                        users.map((user, key) =>
                                            <tr key={key}>
                                                <td>
                                                    <img src={user1} alt="user" className="avatar-xs rounded-circle me-2" /> {user.username}
                                                </td>
                                                <td><span class={`rounded-pill bg-${getStatusColor(user.status)} badge badge-secondary`}>{getStatuscheck(user.status)}</span></td>         
                                                <td>
                                                {user.email || "No Email"}
                                                </td>
                                                <td>
                                                    <Button color="secondary" size="sm" className="waves-effect waves-light" onClick={()=>history.push(`/edit-user/${user.id}`)}>Edit</Button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }


export default LatestTransactions;