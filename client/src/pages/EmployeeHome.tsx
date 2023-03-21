import { Button, Stack, Typography } from "@mui/material";
import { AxiosResponse } from "axios";
import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import recordsService from "../api/records.api";
import userService from "../api/user.api";
import PricingTable from "../components/pricing-table/PricingTable";
import UserDialog from "../components/user-dialog/UserDialog";
import { User, UserInitialState } from "../redux-store/user.reducer";

export const EmployeeHome: React.FC = (): JSX.Element => {
  return (
    <Stack rowGap={2} direction="column" sx={{ padding: "5%" }}>
      <Typography variant="h3">Home</Typography>

      <PricingTable />
    </Stack>
  );
};
