import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "./getCookie";

const withAuth = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const token = getCookie("token");
      console.log("Token from cookie:", token); // Debugging log

      if (!token) {
        return <Navigate to="/login" />;
      }

      // Additional logic to check if token is valid and user has necessary permissions

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withAuth;
