import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, UserRound } from "lucide-react";

interface ConsultantsCardProps {
  name?: string;
  specialty?: string;
  position?: string;
  user_image?: string;
  id?: number;
}

const ConsultantsCard: React.FC<ConsultantsCardProps> = ({
  name = "Consultant",
  specialty = "Specialty not available",
  position = "",
  user_image = "/default-user.png",
  id = 0,
}) => {
  return (
    <motion.article
      className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-xl hover:shadow-[#092957]/10"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#eaf4fb] via-[#f5f9fc] to-[#dceef5] sm:h-56">
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-[18px] border-white/40" />
        <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-t-full bg-white/60" />
        <img
          className="relative z-10 h-full w-full object-contain object-bottom px-5 pt-4 transition-transform duration-700 ease-out group-hover:scale-105"
          src={user_image}
          alt={`${name}, ${specialty}`}
          loading="lazy"
          onError={(event) => { event.currentTarget.src = "/default-user.png"; }}
        />
        <span className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#087eaa] shadow-sm backdrop-blur">
          <UserRound size={12} /> Consultant
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-xl font-semibold leading-snug text-[#092957] transition-colors group-hover:text-[#087eaa]">{name}</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{specialty}</p>
        {position && <p className="mt-2 text-xs leading-5 text-slate-500">{position}</p>}
        <div className="mt-auto pt-6">
          <Link
            to={`/consultant/${id}`}
            aria-label={`View ${name}'s profile`}
            className="inline-flex w-full items-center justify-between rounded-xl bg-[#092957] px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#087eaa] focus:outline-none focus:ring-4 focus:ring-cyan-200"
          >
            View profile <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
      <div className="h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-[#092957] to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
    </motion.article>
  );
};

export default ConsultantsCard;
