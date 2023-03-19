import { Stack, Typography } from "@mui/material";
import React from "react";
import DataTable from "../components/DataTable";


export const EmployeeHome: React.FC = (): JSX.Element => {
    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
      ];

    return (
        <Stack columnGap={2} direction='column'>
            <Typography variant="h1" >Home</Typography>
            
            <Stack columnGap={1} direction='column'>
                <Typography variant="h1" >Pricing Feed</Typography>
                {/* <DataTable rows={rows} onDelete={(row) => {}} onEdit={(row) => {}} /> */}
            </Stack>
        </Stack>
            
   
    )
}