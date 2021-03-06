import Modal from 'react-modal';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from '../Button';
import { database } from '../../services/firebase';

import endRoomImg from '../../assets/images/end-room.svg'

import styles from './styles.module.scss';
import toast from 'react-hot-toast';

type Props = {
  roomId: string;
}

const ModalDeleteRoom = (props: Props) => {
  const [modalDeleteRoomIsOpen, setModalDeleteRoomIsOpen] = useState(false);
  const history = useHistory();

  const toggleStateModalDeleteRoom = () => {
    setModalDeleteRoomIsOpen(!modalDeleteRoomIsOpen);

  };

  const handleEndRoom = async () => {
    await database.ref(`/rooms/${props.roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
    toast.success("Sala encerrada", {
      style: {
        background: "#68D391",
        color: "#FFF"
      },
      iconTheme: {
        primary: "#FFF",
        secondary: "#68D391"
      }
    });
  };

  return (
    <>
      <Button onClick={toggleStateModalDeleteRoom}>Encerrar sala</Button>
      <Modal
        isOpen={modalDeleteRoomIsOpen}
        onRequestClose={toggleStateModalDeleteRoom}
        className={styles.content}
        overlayClassName={styles.overlay}
        ariaHideApp={false}
        >
        <div>
          <img src={endRoomImg} alt="Encerrar sala" />
          <strong>Encerrar sala</strong>
          <p>Tem certeza que você deseja encerrar esta sala ?</p>
          <div className={styles.buttons}>
            <Button onClick={toggleStateModalDeleteRoom}>Cancelar</Button>
            <Button onClick={handleEndRoom}>Sim, encerrar</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export { ModalDeleteRoom };
