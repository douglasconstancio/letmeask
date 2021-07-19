import useTheme from "../../hooks/useTheme";

import { FaMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";

import styles from './styles.module.scss';
import { Tooltip } from "@material-ui/core";

const ButtonToggleTheme = () => {
  const { toggleDarkMode, isDark } = useTheme();

  return (
    <Tooltip title={ isDark ? "Tema dark" : "Tema light"}>
      <button className={styles.toggleTheme} type="button" onClick={toggleDarkMode}>
        {isDark ? <FaMoon size={20} /> : <FiSun size={20} />}
      </button>
    </Tooltip>
  );
};

export { ButtonToggleTheme };
