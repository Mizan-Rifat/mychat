import React, { useEffect, useState, useContext } from "react";
import LoginForm from "./AuthChild/LoginForm";
import RegistrationForm from "./AuthChild/RegistrationForm";
import AuthHeader from "./AuthChild/AuthHeader";
import { useHistory } from "react-router-dom";
import AuthCheck from "./AuthCheck";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";
import { drawerContext } from "./App";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    position: "absolute",
    bottom: 0,
  },
}));

const theme = createMuiTheme({
  overrides: {
    MuiLinearProgress: {
      colorPrimary: {
        backgroundColor: "#676CAD",
      },
      barColorPrimary: {
        backgroundColor: "#353D5A",
      },
    },
  },
});

export default function Auth(props) {
  const classes = useStyles();
  const { user, setUser } = useContext(drawerContext);

  const history = useHistory();

  const [loading, setloading] = useState(false);
  const [resLoading, setResLoading] = useState(false);

  useEffect(() => {
    if (Object.entries(user.user).length > 0) {
      history.push("/message");
    }
  }, [user]);

  return (
    <>
      {loading ? (
        ""
      ) : (
        <div className="body">
          <div className="d-flex justify-content-center h-100">
            <div className="user_card">
              <AuthHeader />

              {props.history.location.pathname == "/register" ? (
                <>
                  <RegistrationForm
                    loading={resLoading}
                    setLoading={setResLoading}
                  />
                </>
              ) : (
                <>
                  <LoginForm
                    loading={resLoading}
                    setLoading={setResLoading}
                    user={user}
                    setUser={setUser}
                  />

                  <LoginFooter />
                </>
              )}

              {resLoading ? (
                <div className={classes.root}>
                  <ThemeProvider theme={theme}>
                    <LinearProgress />
                  </ThemeProvider>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LoginFooter() {
  return (
    <div className="mt-4">
      <div
        className="d-flex justify-content-center links"
        style={{ color: "white" }}
      >
        Don't have an account?{" "}
        <a href="/register" className="ml-2">
          Register
        </a>
      </div>
      {/* <div className="d-flex justify-content-center links">
        <a href="#">Forgot your password?</a>
      </div> */}
    </div>
  );
}

