import MaterialTable from "material-table";
import { useState, useEffect } from "react";
import Axios from "axios";
import "@material-ui/icons";
let outer = 1;
const Table = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let __id = 1;
    Axios.get("http://localhost:8000/read").then((res) => {
      const temp = res.data;
      temp.map((i) => (i.id = __id++));
      outer = __id;
      setData(temp);
    });
  }, []);
  const columns = [
    {
      title: "ID",
      field: "id",
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
    Axios.put("http://localhost:8000/edit", newData).then((res) => {
      console.log("updated value");
    });
  };
  //deleting from server side
  const deleteData = (data) => {
    console.log(data._id);
    Axios.delete(`http://localhost:8000/remove/${data._id}`);
  };
  return (
    <div>
      <MaterialTable
        title="Employees Records"
        data={data}
        columns={columns}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                add(newData);
                newData.id = outer++;
                setData([...data, newData]);
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                update(newData);
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                deleteData(oldData);
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                let x = 1;
                outer--;
                dataDelete.map((i) => (i.id = x++));
                setData([...dataDelete]);
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
