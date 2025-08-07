import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

interface BackButtonProps {
  route: string | number;
}

const BackButton = ({ route }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof route === "number") {
      navigate(route); 
    } else {
      navigate(route); 
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="absolute top-6 left-4 w-8 h-8 rounded-full border border-[var(--retro-border)] bg-[var(--retro-border)/0.3] hover:bg-[var(--retro-border)/0.8] flex items-center justify-center text-[var(--retro-cyan)] hover:text-[var(--retro-white)] hover:shadow-md transition"
      >
        <IoIosArrowBack />
      </button>
    </div>
  );
};

export default BackButton;
