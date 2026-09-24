import Style from "./Card.module.css";
import useGsapReveal from "../../hooks/useGsapReveal";

const Card = ({
  cardData,
  deleteCard,
  checkedDelete,
  darkMode,
}) => {
  const cardsRef = useGsapReveal();

  if (cardData.length === 0) {
    return (
      <div className={`${Style.parent} flex justify-center items-center`}>
       <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight bubblegum-sans-regular text-[#1813132e]">
          No Data Found
        </h1>
      </div>
    );
  }

  const darkPriorityMap = {
    whiteCard: Style.darkWhiteCard,
    greenCard: Style.darkGreenCard,
    orangeCard: Style.darkOrangeCard,
    redCard: Style.darkRedCard,
  };

  return (
    <div className={Style.parent} ref={cardsRef}>
      {cardData.map((singleCardData) => (
        <div
          key={singleCardData.id}
          className={`
            ${Style.card}
            ${darkMode ? Style.darkCard : Style[singleCardData.prio]}
            ${darkMode ? darkPriorityMap[singleCardData.prio] : ""}
          `}
        >
          <h1 className="text-2xl font-extrabold bubblegum-sans-regular">
            {singleCardData.title}
          </h1>

          <p className="caveat-card">
            {singleCardData.des}
          </p>

          <button
            className="rounded-full absolute top-2 right-5 text-gray-600 border px-2 font-bold"
            onClick={() => deleteCard(singleCardData.id)}
          >
            ×
          </button>

          <input
            type="checkbox"
            className="rounded-full absolute top-2 left-5 border px-2 font-bold"
            onChange={(e) =>
              checkedDelete(singleCardData.id, e)
            }
          />
        </div>
      ))}
    </div>
  );
};

export default Card;