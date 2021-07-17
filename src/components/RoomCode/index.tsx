import toast from 'react-hot-toast';
import copyImg from '../../assets/images/copy.svg';

import styles from './styles.module.scss';

type RoomCodeProps = {
  code: string;
  isDark: boolean;
}

const RoomCode = ({ code, isDark }: RoomCodeProps) => {
  const copyRoomCodeToClipboard = () => {
    navigator.clipboard.writeText(code)

    toast.success("Código copiado ", {
      style: {
        background: isDark ? "#aa1bec" : "#E559F9",
        color: "#FFF"
      },
      iconTheme: {
        primary: isDark ? "#aa1bec" : "#E559F9",
        secondary: "#FFF"
      },
      icon: "✍🏼"
    });
  }

  return (
    <button onClick={copyRoomCodeToClipboard} className={styles.roomCode}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>Sala #{code}</span>
    </button>
  )
}

export { RoomCode };
