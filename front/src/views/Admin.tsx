import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Perfume } from '../types';
import AdminPortal from '../components/admin/AdminPortal';

interface AdminProps {
  perfumes: Perfume[];
  setPerfumes: React.Dispatch<React.SetStateAction<Perfume[]>>;
  colors: Record<string, string>;
  setColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  logo: string | null;
  setLogo: (logo: string | null) => void;
  isDarkMode: boolean;
}

export default function Admin({
  perfumes,
  setPerfumes,
  colors,
  setColors,
  logo,
  setLogo,
  isDarkMode
}: AdminProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      key="catalog-admin"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="flex-1 flex flex-col min-h-0"
    >
      <AdminPortal
        perfumes={perfumes}
        setPerfumes={setPerfumes}
        colors={colors}
        setColors={setColors}
        logo={logo}
        setLogo={setLogo}
        onClose={() => navigate('/view/grid')}
        isDarkMode={isDarkMode}
      />
    </motion.div>
  );
}
