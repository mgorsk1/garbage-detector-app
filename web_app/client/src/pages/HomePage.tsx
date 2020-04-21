import React, { useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import { Page } from "../App.styles";
import HomeButton from "../components/HomeButton";
import Notification from "../components/Notification";
import { Category } from "../constants";
import Dashboard from "../icons/Dashboard";
import { Clock, Time, Day, Meridiem, Modal } from "./HomePage.styles";

interface Props {
  category: Category;
  on: boolean;
}

const formatTwoDigits = num => ("0" + num).slice(-2);

const HomePage = ({category, on}: Props) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hours = formatTwoDigits(time.getHours())
  const minutes = formatTwoDigits(time.getMinutes())

  return (
    <Page>
      <Clock hidden={on}>
        <Time>
          {hours}:{minutes}
          <Meridiem>{Number(hours) > 12 ? 'PM' : 'AM'}</Meridiem>
        </Time>
        <Day>{time.toDateString()}</Day>
      </Clock>
      <Transition in={on} timeout={500}>
        {(state) => (
          <Modal state={state}>
            <Notification category={category} state={state} />
          </Modal>
        )}
      </Transition>
      <HomeButton invert={on} to="/analyse" text="Dashboard" icon={<Dashboard/>}/>
    </Page>
  );
};

export default HomePage;
