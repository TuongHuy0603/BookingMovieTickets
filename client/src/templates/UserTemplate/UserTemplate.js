import { Fragment, useEffect } from "react";
import { Route } from "react-router";
import styleLogin from "../../pages/Login/Login.module.css";
export const UserTemplate = (props) => {
  //path, exact, Component

  const { Component, ...restProps } = props;
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Route
      {...restProps}
      render={(propsRoute) => {
        //props.location,props.history,props.match

        return (
          <Fragment>
            <div
              style={{
                background: " linear-gradient(45deg, #fc466b, #3f5efb)",
                paddingBottom: "30.7%",
                width: "100%  ",
              }}
            >
              <Component {...propsRoute} />
            </div>
          </Fragment>
        );
      }}
    />
  );
};
