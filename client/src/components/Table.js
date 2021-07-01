import MaterialTable from "material-table";
import Axios from "axios";
import "@material-ui/icons";
import {useState} from 'react';
const Table = () => {
  const [page,setPage] = useState(1);
  const [size,setSize] = useState(5);
  const columns = [
    {
      title: "ID",
      render:(rowData) => rowData.tableData.id+1 + ((page)*size),
      editable: "never",
    },
    {
      title: "Name",
      field: "name",
      validate: (rowData) => rowData.name !== "",
    },
    {
      title: "Gender",
      field: "gender",
      lookup: { male: "Male", female: "Female", other: "Other" },
      validate:(rowData) => rowData.gender !==""
    },
    {
      title: "Salary",
      field: "salary",
      type: "numeric",
      validate: (rowData) => rowData.salary > 0,
    },
    {
      title: "Team",
      field: "team",
      lookup: { alpha: "Alpha", beta: "Beta", gamma: "Gamma" },
      validate:(rowData) => rowData.team !==""
    },
    {
      title: "Address",
      field: "address",
      validate: (rowData) => rowData.address !== "",
    },
  ];
  //adding an employee on server
  const add = (employee) => {
    Axios.post("http://localhost:8000/insert", employee);
  };
  //updating on server
  const update = (newData) => {
    Axios.put(`http://localhost:8000/edit/${newData._id}`, newData).then(
      (res) => {
        console.log("updated value");
      }
    );
  };
  //deleting from server side
  const deleteData = (data) => {
    // console.log(data._id);
    Axios.delete(`http://localhost:8000/remove/${data._id}`);
  };
  return (
    <div>
      <MaterialTable
        title="Employees Records"
        data={(query) =>
          new Promise((resolve, reject) => {
            // prepare your data and then call resolve like this:
            // let x = 1;
            let url = `http://localhost:8000/read?`;
            url += "size=" + query.pageSize;
            url += "&page=" + (query.page + 1);
            setPage(parseInt(query.page));
            setSize(parseInt(query.pageSize));
            // console.log(url);
            fetch(url)
              .then((response) => response.json())
              .then((res) => {
                console.log(res);
                resolve({
                  data: res.filter(item => item.name.includes(query.search)),
                  page: query.page,
                  totalCount: query.pageSize + 1,
                });
              });
          })
        }
        columns={columns}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                add(newData);
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                update(newData);
                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                deleteData(oldData);
                resolve();
              }, 1000);
            }),
        }}
        options={{
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
      />
    </div>
  );
};
export default Table;
