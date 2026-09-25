import React from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import LazyImage from "../../Component/LazyImage";

const TiltCard = ({ post }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  const imageUrl = post.images && post.images.length > 0 ? post.images[0] : '';

  return (
    <motion.article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className="relative h-100 w-full rounded-4xl bg-slate-900 overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-shadow"
    >
      <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110">
        <LazyImage src={imageUrl} alt={post.title} className="w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent z-10" />
      
      <div className="absolute inset-x-0 bottom-0 p-8 z-20" style={{ transform: "translateZ(50px)" }}>
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white mb-4 backdrop-blur-md border border-white/10">
          {post.category}
        </span>
        <h3 className="text-2xl font-black text-white mb-3 leading-snug drop-shadow-md line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-300 text-sm line-clamp-2 mb-6 font-medium">
          {post.briefDescription}
        </p>
      </div>
      <Link to={`/blog/${post.id}`} className="absolute inset-0 z-30"></Link>
    </motion.article>
  );
};

export default TiltCard;
