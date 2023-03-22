import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { User } from "../../redux-store/user.reducer";
import { useForm } from "react-hook-form";
import "./UserDialog.scss";
import { Stack } from "@mui/material";
import userService from "../../api/user.api";
import {
  NotificationManager,
} from "react-notifications";
import { AxiosError } from "axios";

type UserDialogProps = {
  user: User | null;

  isOpen: boolean;

  creatorId: string;

  onSave: (user: User) => void;

  onClose: () => void
};

const UserDialog: React.FC<UserDialogProps> = ({
  user,
  isOpen,
  creatorId,
  onSave,
  onClose
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [saving, setSaving] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: user || {}
  });

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  const handleClose = () => {
    onClose();
  };

  const saveUser = async (data: any) => {
    console.log("data", data);
    setSaving(true);
    if(user){
      // update
      userService
      .update(data, creatorId)
      .then((user: User) => {
        console.log("updatedUser ", user);
        NotificationManager.success('User saved successfully', "User Saved", 5000);
        onSave(user);
      })
      .catch((error: any) => {
        console.log("error ", error);
        NotificationManager.error(error.response?.data, "User Error", 5000);
      }).finally(() => {
        setSaving(false);
      }) 
    }else{
      // create
      userService
      .create(data, creatorId)
      .then((user: User) => {
        console.log("savedUser ", user);
        NotificationManager.success('User saved successfully', "User Saved", 5000);
        onSave(user);
      })
      .catch((error: any) => {
        console.log("error ", error);
        NotificationManager.error(error.response?.data, "User Error", 5000);
      }).finally(() => {
        setSaving(false);
      })      
    }

   
  };

  console.log("UserDialog ", isOpen);
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {!user ? `Create User` : `Update User`}
        </DialogTitle>
        <DialogContent>
          <form className="user-form" onSubmit={handleSubmit(saveUser)}>
            <Stack direction={"row"} columnGap={2}>
              <div>
                <label htmlFor="name">Name</label>
                <input {...register("name")} />
              </div>
              <div>
                <label htmlFor="designation">Designation</label>
                <input {...register("designation")} />
              </div>
            </Stack>
            <Stack direction={"row"} columnGap={2}>
              <div>
                <label htmlFor="contactNumber">Contact Number</label>
                <input {...register("contactNumber", { pattern: /\d+/ })} />
              </div>
              <div>
                <label htmlFor="storeId">Store Id*</label>
                <input {...register("storeId", { required: true })} />
                {errors.storeId && <p>Store Id is required.</p>}
              </div>
            </Stack>
            <Stack direction={"row"} columnGap={2}>
              <div>
                <label htmlFor="email">Email*</label>
                <input type={"email"} {...register("email")} required />
                {errors.email && <p>Email Id is required.</p>}
              </div>
              <div>
                <label htmlFor="passowrd">Password*</label>
                <input type={"password"} {...register("password")} />
                {errors.password && <p>Please enter Password.</p>}
              </div>
            </Stack>
            <input
              disabled={saving}
              value={"Save"}
              type="submit"
              style={{ cursor: "pointer" }}
            />
          </form>
        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClose} autoFocus>
            Save
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
};

export default UserDialog;
