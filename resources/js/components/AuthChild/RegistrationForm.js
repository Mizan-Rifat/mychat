import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import ErrorIcon from "@material-ui/icons/Error";
import { scryRenderedComponentsWithType } from "react-dom/test-utils";


const useStyles = makeStyles((theme) => ({
  formDisable: {
    pointerEvents: "none",
    opacity: "0.5",
    // background: "rgba(255, 255, 255, 0.6)",
  },
  errorIcon: {
    position: "absolute",
    right: "5px",
    top: "7px",
    color: "red",
    zIndex: 10,
  },
  success:{
    color:'white',
    fontSize:'16px',
    textAlign:'center'
  }
}));

export default function RegistrationForm({ loading, setLoading }) {
  const classes = useStyles();

  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    errors: [],
  });

  const history = useHistory();

  const [isSuccess, setIsSuccess] = useState(false)

  const [fields, setFields] = useState([
    {
      name: "name",
      placeholder: "User Name",
      type: "text",
    },
    {
      name: "email",
      placeholder: "Email",
      type: "email",
    },
    {
      name: "password",
      placeholder: "Password",
      type: "password",
    },
    {
      name: "password_confirmation",
      placeholder: "Confirm Password",
      type: "password",
    },
  ]);

  const handleFieldChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value,
    });
  };
  const hasError = (field) => {
    return !!registrationData.errors[field];
  };

  const renderError = (field) =>
    registrationData.errors.hasOwnProperty(field) ? (
      <small
        style={{
        //   marginLeft: "50px",
          color: "chocolate",
        }}
      >
        {registrationData.errors[field][0]}
      </small>
    ) : (
      ""
    );

  const registerUser = (e) => {
    // setResLoading(true)
    e.preventDefault();

    setLoading(true);

    axios
      .get(`/airlock/csrf-cookie`)
      .then((response) => {
        axios
          .post(`/register`, {
            name: registrationData.name,
            email: registrationData.email,
            password: registrationData.password,
            password_confirmation: registrationData.password_confirmation,
          })
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              setLoading(false);
              setIsSuccess(true)
              console.log(response)
            //   history.push("/chat");
            }
          })
          .catch((error) => {
            // setResLoading(false)
            console.log(error.response.status);

            if (error.response.status == 422) {
              setRegistrationData({
                ...registrationData,
                errors: error.response.data.errors,
              });
            }
            setLoading(false);
          });
      });
  };

  return (

      isSuccess ? 

      <div className={classes.success}>
        <p>Registration Successfull</p>
        <a href="/message" className="ml-2">
          Start Chating Now..
        </a>
      </div>

      :

    <>

    <div className="d-flex justify-content-center form_container">


      <form onSubmit={registerUser} className={clsx({ [classes.formDisable] : loading })}>
        {fields.map((field, index) => (
          <>
          <div
            className={clsx('position-relative',{
              "mb-3": !hasError(field.name),
            })}
          >
            <input
              type={field.type}
              name={field.name}
              className={`form-control input_user ${
                hasError(field.name) ? "invalid" : ""
              }`}
              placeholder={field.placeholder}
              value={registrationData[field.name]}
              onChange={handleFieldChange}
            />

            <ErrorIcon
                className={clsx(classes.errorIcon, {
                    "d-none": !hasError(field.name),
                })}
            />

          </div>
          {renderError(field.name) }
          </>
        ))}

       

        <div className="d-flex justify-content-center mt-3 login_container">
          <button
            type="submit"
            disabled={loading}
            name="button"
            className="btn login_btn"
          >
            Register
          </button>
        </div>
      </form>
    </div>

    {
        !isSuccess &&
     
    <div className="mt-4">
      <div
        className="d-flex justify-content-center links"
        style={{ color: "white" }}
      >
        Already have an account?
        <a href="/login" className="ml-2">
          Login
        </a>
      </div>
    </div>
}
    </>
  );
}
