import React, {useState, useEffet} from "react";
import PersonIcon from "@material-ui/icons/Person";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/styles";
import axios from "axios";
import clsx from "clsx";
import ErrorIcon from "@material-ui/icons/Error";
import { loginUser } from "../Redux/Ducks/SessionUserDuck";
import { useSelector,useDispatch } from "react-redux";

const useStyles = makeStyles(theme => ({
  inputGroupText: {
    background: "#c0392b !important",
    color: "white!important",
    border: "0!important",
    borderRadius: "0.25rem 0 0 0.25rem!important",
  },
  errorIcon: {
    position: "absolute",
    right: "5px",
    top: "7px",
    color: "red",
    zIndex: 10,
  },
  formDisable: {
    pointerEvents: "none",
    opacity: "0.5",
    // background: "rgba(255, 255, 255, 0.6)",
  },
}));

export default function LoginForm() {
  const classes = useStyles();

  const {sessionUser,loading} = useSelector(state => state.sessionUser)
  const dispatch = useDispatch();

  const initState = {
    email: "",
    password: "",
    remember: false,
    errors: {},
  };

  const [loginData, setLoginData] = useState(initState);

  // const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleFieldChange = e => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const hasError = field => {
    return !!loginData.errors[field];
  };

  const renderError = field =>
    loginData.errors.hasOwnProperty(field) ? (
      <small
        style={{
          marginLeft: "50px",
          color: "chocolate",
        }}
      >
        {loginData.errors[field][0]}
      </small>
    ) : (
      ""
    );

  const login = e => {
    e.preventDefault();
    dispatch(loginUser(loginData))
  };

  return (
    
    <div className="d-flex justify-content-center form_container">
      <form onSubmit={login} className={clsx({[classes.formDisable]: loading})}>
        <div
          className={clsx("input-group position-relative", {
            "mb-3": !hasError("email"),
          })}
        >
          <div className="input-group-append">
            <span className="input-group-text input-group-text2">
              <PersonIcon />
            </span>
          </div>

          <input
            type="text"
            name="email"
            className="form-control input_user"
            placeholder="Email"
            value={loginData.email}
            onChange={handleFieldChange}
          />

          <ErrorIcon
            className={clsx(classes.errorIcon, {
              "d-none": !hasError("email"),
            })}
          />
        </div>

        {renderError("email")}

        <div
          className={clsx("input-group position-relative", {
            "mb-3": !hasError("password"),
          })}
        >
          <div className="input-group-append">
            <span className="input-group-text input-group-text2">
              <VpnKeyIcon />
            </span>
          </div>
          <input
            type="password"
            name="password"
            className="form-control input_pass"
            placeholder="password"
            value={loginData.password}
            onChange={handleFieldChange}
          />
          <ErrorIcon
            className={clsx(classes.errorIcon, {
              "d-none": !hasError("password"),
            })}
          />
        </div>
        {renderError("password")}
        <div className="form-group">
          <div
            className="custom-control custom-checkbox"
            style={{
              color: "white",
            }}
          >
            <input
              type="checkbox"
              className="custom-control-input"
              id="customControlInline"
              onChange={e =>
                setLoginData({
                  ...loginData,
                  remember: e.target.checked,
                })
              }
            />
            <label
              className="custom-control-label"
              htmlFor="customControlInline"
            >
              Remember me
            </label>
          </div>
        </div>
        <LoginButton label="Login" />
      </form>
    </div>
  );
}

function LoginButton({label}) {
  return (
    <div className="d-flex justify-content-center mt-3 login_container">
      <button type="submit" name="button" className="btn login_btn">
        {label}
      </button>
    </div>
  );
}
