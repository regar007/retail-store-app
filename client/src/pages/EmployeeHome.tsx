import { Stack, Typography } from "@mui/material";
import React from "react";
import PricingTable from "../components/pricing-table/PricingTable";

export const EmployeeHome: React.FC = (): JSX.Element => {
  return (
    <Stack rowGap={2} direction="column" sx={{ padding: "1%" }}>
      <Typography variant="h3">Employee Page</Typography>

      <PricingTable />
    </Stack>
  );
};
