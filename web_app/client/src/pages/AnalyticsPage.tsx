import React from "react";
import { Page } from "../App.styles";
import HomeButton from "../components/HomeButton";
import Home from "../icons/Home";

const AnalyticsPage = () => {
  return (
    <Page>
      User analytics here
      <HomeButton to="/" text="Home" icon={<Home/>}/>
    </Page>
  );
};

export default AnalyticsPage;
