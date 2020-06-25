import React from "react";
import ReactDOM from "react-dom";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import SplitForm from "./SplitForm";

import "./styles.css";

const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");


export default function Main(){
  return (
      <Elements stripe={stripePromise}>
        <SplitForm />
      </Elements>
  );
};

