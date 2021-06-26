import MaterialTable from "material-table";
import Axios from "axios";
import "@material-ui/icons";
const Table = () => {
  let outer = 1;
  const columns = [
    {
      title: "ID",
      field: "idTemp",
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
    Axios.put(`http://localhost:8000/edit/${newData._id}`, newData).then(
      (res) => {
        console.log("updated value");
      }
    );
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
        data={(query) =>
          new Promise((resolve, reject) => {
            // prepare your data and then call resolve like this:
            let __id = 1;
            let url = `http://localhost:8000/read?`;
            url += "size=" + query.pageSize;
            url += "&page=" + (query.page + 1);
            console.log(url);
            fetch(url)
              .then((response) => response.json())
              .then((res) => {
                console.log(res);
                const temp = res;
                for(let i=0;i<temp.length;i++){
                  console.log(temp[i].idTemp);
                  temp[i].idTemp=__id++;
                  outer++;
                }
                update(temp);
                resolve({
                  data: temp,
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
                newData.idTemp = outer++;
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
                outer--;
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
