import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { UserInitialState } from "../../redux-store/user.reducer";
import { Stack } from "@mui/system";
import { Button, TextField, Typography } from "@mui/material";
import ConfirmationDialog from "../confirmation/ConfirmationDialog";
import recordsService from "../../api/records.api";
import { PricingPage, SearchOptions } from "../../types/type";
import { PricingRecord } from "../../redux-store/records.reducer";
import { NotificationManager } from "react-notifications";
import "./PricingTable.scss";
import useDebouncedSearch from "../../hooks/debauncing";

type PricingTableProps = {};

const editableFields: string[] = ["price", "sku", "productName"];

const PricingTable: React.FC<PricingTableProps> = () => {
  const loggedInUser: UserInitialState = useSelector(
    (state: any) => state.user
  );
  const [data, setData] = React.useState<PricingRecord[]>([]);
  const [editedRows, setEditedRows] = React.useState<PricingRecord[]>([]);
  const [showUpdateConfirmation, setShowUpdateConfirmation] =
    React.useState<boolean>(false);

  const { searchOptions, setSearchOptions } = useDebouncedSearch(
    {},
    React.useCallback((searchOptions: SearchOptions) => {
      return recordsService
        .getRecords(
          loggedInUser.user?.id!,
          loggedInUser.user?.storeId,
          searchOptions
        )
        .then((response) => {
          if (response instanceof Error) {
            throw response;
          }
          setData(response.nodes);
        })
        .catch((e) => {
          return e;
        });
    }, [])
  );

  const handleFileUpload = async (e: any) => {
    e.preventDefault();

    const file: File = e.target.files[0];
    recordsService
      .createRecords(loggedInUser.user?.id!, file)
      .then((response: boolean | Error) => {
        console.log("handleFileUpload response ", response);
        NotificationManager.success(
          "Records uploaded successfully",
          "Upload Success",
          5000
        );
        getRecords();
      })
      .catch((e) => {
        NotificationManager.error(`Upload failed: ${e}`, "Upload Error", 5000);
        console.log("handleFileUpload e ", e);
      });
  };

  const handleSearch = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    console.log("search ", field, value);
    let searchParams = searchOptions;
    if (field === "productName") {
      searchParams = {
        ...searchParams,
        productName: value,
      };
    }
    if (field === "price") {
      searchParams = {
        ...searchParams,
        price: value,
      };
    }
    if (field === "sku") {
      searchParams = {
        ...searchOptions,
        sku: value,
      };
    }
    setSearchOptions(searchParams);
  };

  function generateColumns(keys: any) {
    const cols: GridColDef[] = [];
    for (let key in keys) {
      cols.push({
        field: key,
        headerName: key,
        description: key,
        sortable: true,
        width: 160,
        hideSortIcons: true,
        disableColumnMenu: true,
        editable: editableFields.includes(key),
        renderHeader: function (params) {
          return (
            <div
              className={`${
                editableFields.includes(key) ? "editable-fields" : ""
              }`}
            >
              {editableFields.includes(key) ? (
                <TextField
                  id="outlined-basic"
                  label={key}
                  variant="standard"
                  onChange={(e) => handleSearch(e, key)}
                />
              ) : (
                key
              )}
            </div>
          );
        },
      });
    }
    return cols;
  }

  function generateRows(rows: PricingRecord[]) {
    const processedRows = [];
    for (let row of rows) {
      let edited = editedRows.filter((r) => r.id === row.id);
      if (edited.length) {
        row = edited[0];
      }
      processedRows.push({
        ...row,
      });
    }
    return processedRows;
  }

  const updateRecords = async (userId?: string) => {
    recordsService
      .updatedRecords(userId || "", editedRows)
      .then((resonse) => {
        if (resonse) {
          NotificationManager.success(
            "Records updated successfully",
            "Update Success",
            5000
          );
          getRecords(loggedInUser.user?.id);
        }
      })
      .catch((e) => {
        NotificationManager.error(
          `Failed to updated records: ${e}`,
          "Update Failed",
          5000
        );
        console.log("update error", e);
      })
      .finally(() => {
        setShowUpdateConfirmation(false);
        setEditedRows([]);
      });
  };

  const getRecords = async (userId?: string) => {
    const recordsPage: PricingPage | Error = await recordsService.getRecords(
      userId || ""
    );
    if (recordsPage instanceof Error) {
      console.log("could not get records ", recordsPage);
      return;
    }
    setData(recordsPage.nodes);
  };

  React.useEffect(() => {
    getRecords(loggedInUser.user?.id);
  }, [loggedInUser.user?.id]);

  function computeMutation(
    newRow: GridValidRowModel,
    oldRow: GridValidRowModel
  ) {
    console.log("computeMutation ", oldRow, newRow);
    if (newRow.productName?.trim() === "") {
      return null;
    }
    return JSON.stringify(oldRow) !== JSON.stringify(newRow);
  }

  const processRowUpdate = React.useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) =>
      new Promise<GridRowModel>((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          let alreadyEdited: boolean = false;
          const rows: PricingRecord[] = editedRows.map((row) => {
            if (newRow.id === row.id) {
              alreadyEdited = true;
              return { ...newRow };
            }
            return { ...row };
          });
          if (!alreadyEdited) {
            rows.push(newRow);
          }
          setEditedRows([...rows]);
          resolve(newRow);
        } else {
          resolve(oldRow); // Nothing was changed
        }
      }),
    [editedRows]
  );

  console.log("edited rows ", editedRows);

  return (
    <div style={{ width: "100%" }}>
      <ConfirmationDialog
        isOpen={showUpdateConfirmation}
        message={"Are you sure you want to update records?"}
        onYes={() => updateRecords(loggedInUser.user?.id)}
        onCancel={() => setShowUpdateConfirmation(null)}
      />
      <Stack rowGap={1} direction="column" sx={{ paddingY: "5%" }}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography variant="h6">Pricing Feed</Typography>
          <Stack direction={"row"} columnGap={2}>
            {editedRows.length > 0 && (
              <Button
                variant="contained"
                onClick={() => setShowUpdateConfirmation(true)}
              >
                Update Records
              </Button>
            )}
            <Button variant="contained" component="label">
              Upload Records
              <input
                hidden
                name="file"
                accept={".csv"}
                multiple={false}
                type="file"
                onChange={handleFileUpload}
                onClick={(event: any) => (event.target.value = null)}
              />
            </Button>
          </Stack>
        </Stack>
        {data.length > 0 && (
          <DataGrid
            rows={generateRows(data)}
            columns={generateColumns(data[0])}
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
            // disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
          />
        )}
      </Stack>
    </div>
  );
};

export default PricingTable;
