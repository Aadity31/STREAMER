// src/components/withAuth.js
import React from "react";
import { Redirect } from "react-router-dom";
import { getCookie } from "../utils/getCookie";

const withAuth = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const token = getCookie("jwt");

      if (!token) {
        return <Redirect to="/login" />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withAuth;
