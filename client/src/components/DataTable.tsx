import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import userService from "../api/user.api";
import { useSelector } from "react-redux";
import { User, UserInitialState } from "../redux-store/user.reducer";
import { Stack } from "@mui/system";
import { Button } from "@mui/material";
import ConfirmationDialog from "./confirmation/ConfirmationDialog";

type DataTableProps = {
  rows: any;
  onEdit: (row: User) => void;
  onDelete: (row: User) => void;
};
const DataTable: React.FC<DataTableProps> = ({ rows, onEdit, onDelete }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    React.useState<User | null>(null);
  function renderActions(row: User) {
    return (
      <Stack key={row.id} rowGap={2} direction="row">
        <Button
          onClick={(e) => {
            e.preventDefault();
            onEdit(row);
          }}
        >
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setShowDeleteConfirmation(row)
          }}
        >
          Delete
        </Button>
      </Stack>
    );
  }

  function generateColumns(keys: any) {
    const cols: GridColDef[] = [];
    for (let key in keys) {
      cols.push({
        field: key,
        headerName: key,
        description: key,
        sortable: true,
        width: 160,
      });
    }
    cols.push({
      field: "Action",
      headerName: "Action",
      description: "Action",
      sortable: true,
      width: 160,
      renderCell: (params) => {
        return renderActions(params.row);
      },
    });
    return cols;
  }

  function generateRows(rows: User[]) {
    const processedRows = [];
    for (let row of rows) {
      processedRows.push({
        ...row,
        Action: null,
      });
    }
    return processedRows;
  }

  console.log('showDeleteConfirmation ', showDeleteConfirmation)

  return (
    <div style={{ width: "100%" }}>
      <ConfirmationDialog
        isOpen={showDeleteConfirmation !== null}
        message={"Are you sure you want to delete user?"}
        onYes={() => onDelete(showDeleteConfirmation!)}
        onCancel={() => setShowDeleteConfirmation(null)}
      />
      <DataGrid
        rows={generateRows(rows)}
        columns={generateColumns(rows[0])}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        // pageSize={10}
        // rowsPerPageOptions={[5]}
        // checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default DataTable;
