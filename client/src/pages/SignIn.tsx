import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { authenticated, login, logout, onError, UserInitialState } from "../redux-store/user.reducer";
import localStorageUtils from "../utils/localStorage.utils";
import userService from "../api/user.api";
import { LoginResponse, UserType } from "../types/type";
import { useNavigate } from "react-router-dom";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Retail Store
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const SignIn: React.FC = (): JSX.Element => {
const navigate = useNavigate();
  const dispatch = useDispatch();
  const user: UserInitialState = useSelector((state: any) => state.user)
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login({}))
    const data = new FormData(event.currentTarget);
    const cred = {
        email: data.get("email") as string,
        password: data.get("password") as string,
    }
    try{
        const tokens: LoginResponse | Error = await userService.login(cred.email, cred.password)
        if(tokens instanceof Error){
            console.log('Error in Signing ', tokens)
            dispatch(onError({}))
            return
        }
        localStorageUtils.writeLocalStorage('user', JSON.stringify({...tokens.user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken}))
        dispatch(authenticated(tokens.user))
        if(tokens.user.type === UserType.Admin){
            navigate("/admin", { replace: true });
        }else{
            navigate("/employee", { replace: true });
        }
            
    }catch(e){
        dispatch(onError({}))
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={user.fetching}              
            >
              Sign In
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
