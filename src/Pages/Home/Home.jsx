import { useState } from "react";
import Card from "../../Component/Card/Card";
import Style from "./Home.module.css";
import Form from "../../Component/Form/Form";
import Navbar from "../../Component/Navbar/Navbar";
import Sidebar from "../../Component/Sidebar/Sidebar";
import PageSEO from "../../Component/SEO/PageSEO";

const Home = () => {

  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };


  const [cardData, setCardData] = useState(
    JSON.parse(localStorage.getItem("notes")) || [],
  );

  function saveFromHome(data) {
    localStorage.setItem("notes", JSON.stringify(data));
    setCardData(data);
  }

  const deleteCard = (id) => {
    const updatedNotes = cardData.filter((item) => item.id !== id);

    setCardData(updatedNotes);

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };


  const [checkeddata, setcheckeddata] = useState([]);

  function checkedDelete(id, checkbox) {
    if (checkbox.target.checked) {
      const updatedCheckedData = [...checkeddata, id];

      setcheckeddata(updatedCheckedData);
    } else {
      const updatedCheckedData = checkeddata.filter((item) => item !== id);

      setcheckeddata(updatedCheckedData);
    }
  }

  const deleteSelected = (checkeddata) => {
    const updatedNotes = cardData.filter(
      (item) => !checkeddata.includes(item.id),
    );

    setCardData(updatedNotes);

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };


  const [openForm, setOpenForm] = useState(false);

  return (
    <div
      className={
        darkMode
          ? `${Style.homebeforimage} ${Style.darkHome}`
          : Style.homebeforimage
      }
    >
      <div
        className={
          darkMode
            ? `${Style.darkBody} relative min-h-screen`
            : "relative min-h-screen bg-[#D6D6D6] opacity-95"
        }
      >
        <Navbar darkMode={darkMode} />

        <PageSEO
          title="Stiknex — Free Sticky Notes App"
          description="Create, save, and organize sticky notes instantly. No sign-up, no clutter — your notes stay private on your own device."
          path="/"
        />

        <Sidebar
          openForm={() => setOpenForm(true)}
          checkeddata={checkeddata}
          deleteSelected={deleteSelected}
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />

        <Card
          cardData={cardData}
          deleteCard={deleteCard}
          checkedDelete={checkedDelete}
          darkMode={darkMode}
        />

        {openForm && (
          <Form
            closeModal={() => setOpenForm(false)}
            saveFromHome={saveFromHome}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
