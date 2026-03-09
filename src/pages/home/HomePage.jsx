import { useState } from "react";
import "./../../app.scss";

import Welcome from "../../components/welcome/Welcome.jsx";
import Entry from "./../../components/entry/Entry.jsx";
import Exit from "./../../components/exit/Exit.jsx";
import Lunch from "../../components/lunch/Lunch.jsx";
import Dinner from "../../components/dinner/Dinner.jsx";

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState("welcome");

  const allPages = [
    {
      name: "welcome",
      component: <Welcome setCurrentPage={setCurrentPage} key={currentPage} />,
    },
    {
      name: "entry",
      component: <Entry key={currentPage} />,
    },
    {
      name: "lunch",
      component: <Lunch key={currentPage} />,
    },
    {
      name: "dinner",
      component: <Dinner key={currentPage} />,
    },
  ];

  return (
    <div className="App">
      {allPages.map((page, index) => {
        if (page.name === currentPage) {
          return page.component;
        }
      })}
    </div>
  );
}
