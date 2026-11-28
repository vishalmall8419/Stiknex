import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
  {
    id: 1,
    title: "The Art of Visual Thinking",
    description: "Unlock your creative potential by mapping ideas spatially.",
    color: "from-violet-500 to-indigo-600",
    icon: "🎨"
  },
  {
    id: 2,
    title: "Infinite Canvas Strategies",
    description: "How to organize boundless space without losing focus.",
    color: "from-emerald-400 to-teal-500",
    icon: "🌌"
  },
  {
    id: 3,
    title: "Next-Gen Workflows",
    description: "Supercharge productivity with Stiknex's smart tools.",
    color: "from-rose-400 to-red-500",
    icon: "⚡"
  }
];

const CardDeck = () => {
  const [activeCards, setActiveCards] = useState(cards);

  const moveCardToBack = () => {
    setActiveCards((prev) => {
      const newCards = [...prev];
      const frontCard = newCards.shift();
      newCards.push(frontCard);
      return newCards;
    });
  };

  return (
    <div className="relative w-[320px] h-[420px] flex items-center justify-center perspective-[1000px]">
      <AnimatePresence mode="popLayout">
        {activeCards.map((card, index) => {
          const isFront = index === 0;
          return (
            <motion.div
              key={card.id}
              layout
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{
                scale: 1 - index * 0.05,
                y: index * 20,
                z: -index * 50,
                opacity: 1 - index * 0.2,
                rotateX: index * 5,
              }}
              exit={{ scale: 0.8, opacity: 0, y: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={isFront ? moveCardToBack : undefined}
              className={"absolute w-full h-full rounded-3xl p-8 cursor-pointer shadow-2xl flex flex-col justify-between bg-linear-to-br " + card.color}
              style={{
                transformOrigin: "top center",
                zIndex: cards.length - index,
              }}
              whileHover={isFront ? { y: -10, scale: 1.02 } : {}}
            >
              <div className="text-5xl drop-shadow-md">{card.icon}</div>
              <div>
                <h3 className="text-3xl font-black text-white mb-2 leading-tight drop-shadow-sm">{card.title}</h3>
                <p className="text-white/80 font-medium">{card.description}</p>
              </div>
              
              {isFront && (
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-bold tracking-wider animate-pulse">
                  TAP TO SWIPE
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CardDeck;
