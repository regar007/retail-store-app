import { Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import userService from "../api/user.api";
import DataTable from "../components/UsersTable";
import UserDialog from "../components/user-dialog/UserDialog";
import { User, UserInitialState } from "../redux-store/user.reducer";
import { UserPage } from "../types/type";

export const AdminHome: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState<boolean>(false);

  const [data, setData] = React.useState<User[]>([]);

  const loggedInUser: UserInitialState = useSelector(
    (state: any) => state.user
  );

  const getUsers = async () => {
    const usersPage: UserPage | Error = await userService.getUsers(
      loggedInUser.user?.id || ""
    );
    if (usersPage instanceof Error) {
      console.log("could not get users ", usersPage);
      return;
    }
    console.log("useEffect ", usersPage);
    setData(usersPage.nodes);
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  console.log("admin home  ", user, openUserDialog);

  return (
    <Stack rowGap={2} direction="column" sx={{ padding: "1%" }}>
      <Typography variant="h3">Admin Page</Typography>

      <Stack rowGap={1} direction="column" sx={{ paddingY: "1%" }}>
        <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography variant="h6">Users</Typography>
        <Button onClick={() => {
          setUser(null)
          setOpenUserDialog(true)
        }} variant="contained" >Add User</Button>
        </Stack>
        {data.length && (
          <DataTable
            rows={data}
            onDelete={(row) => {
              userService.delete(loggedInUser.user?.id!, row.id!).then((success) => {
                NotificationManager.success('User deleted successfully', "Delete Success", 5000);
                getUsers()
              })
              .catch(error => {
                NotificationManager.error(error.response?.data, "Delete Error", 5000);
              })
            }}
            onEdit={(row) => {
              setOpenUserDialog(true);
              setUser(row);
            }}
          />
        )}
        {openUserDialog && (
          <UserDialog
            user={user}
            isOpen={openUserDialog}
            creatorId={loggedInUser.user?.id!}
            onSave={(user) => {
              setOpenUserDialog(false)
              getUsers()
            }}
            onClose={() => setOpenUserDialog(false)}
          />
        )}
      </Stack>
    </Stack>
  );
};
