import cx from "classnames";
import { useHistory, useParams } from "react-router-dom";
import { Tooltip } from "@material-ui/core";

import { RoomCode } from "../../components/RoomCode";
import { Question } from "../../components/Question";
import { ModalDeleteRoom } from "../../components/ModalDeleteRoom";
import { ModalRemoveQuestion } from "../../components/ModalRemoveQuestion";
import { ButtonToggleTheme } from "../../components/ButtonToggleTheme";

import useRoom from "../../hooks/useRoom";
import useTheme from "../../hooks/useTheme";
import { database } from "../../services/firebase";

import logoImg from "../../assets/images/logo.svg";
import logoDarkImg from "../../assets/images/logo-dark.svg";
import perguntasImg from "../../assets/images/perguntas.svg";
import likeImg from "../../assets/images/like.svg";

import styles from "./styles.module.scss";
import toast, {Toaster} from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

type RoomParams = {
  id: string;
};

const AdminRoom = () => {
  const params = useParams<RoomParams>();
  const history = useHistory();
  const roomId = params.id;
  const { user } = useAuth();

  const { questions, title } = useRoom(roomId);
  const { isDark } = useTheme();

  const moveToHome = () => history.push("/");

  const renderCancelToast = () =>
    toast.success("Cancelando ação...", {
      style: {
        background: isDark ? "#8a0e24" : "#E73F5D",
        color: "#FFF"
      },
      iconTheme: {
        primary: isDark ? "#8a0e24" : "#E73F5D",
        secondary: "#FFF"
      },
    });

  const handleCheckQuestionAsAnswered = async (
    questionId: string,
    isAnswered: boolean
  ) => {
    if (isAnswered) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: false,
      });

      renderCancelToast()

    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
        isHighlighted: false,
      });

      toast.success("Pergunta foi respondida", {
        style: {
          background: "#68D391",
          color: "#FFF"
        },
        iconTheme: {
          primary: "#FFF",
          secondary: "#68D391"
        }
      });
    }
  };

  const handleHighlightQuestion = async (
    questionId: string,
    isHighlighted: boolean
  ) => {
    if (isHighlighted) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: false,
      });

      renderCancelToast()
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
      });

      toast.success("Respondendo pergunta...", {
        style: {
          background: "#4d96eb",
          color: "#FFF"
        },
        iconTheme: {
          primary: "#FFF",
          secondary: "#FFF",
        },
        icon: "💬"
      });
    }
  };

  return (
    <div className={styles.pageRoom}>
      <header>
        <div className={styles.content}>
          <Toaster />
          <img
            src={isDark ? logoDarkImg : logoImg}
            alt="QuestionMe"
            onClick={moveToHome}
          />
          <div className={styles.buttons}>
            <div>
              <RoomCode code={roomId} isDark={isDark}/>
              <ModalDeleteRoom roomId={roomId} />
            </div>
            <ButtonToggleTheme />
          </div>
        </div>
      </header>
      <main>
        <div className={styles.roomTitle}>
          <h1>Sala {title}</h1>
          <span>
            {questions.length}{" "}
            {questions.length > 1 ? "perguntas" : "pergunta"}
          </span>
        </div>
        {questions.length === 0 && (
          <div className={styles.nothingQuestions}>
            <img src={perguntasImg} alt="Nenhuma pergunta" />
            <strong>Nenhuma pergunta por aqui...</strong>
            <p>
              Envie o código desta sala para seus amigos e comece a respoder
              perguntas!
            </p>
          </div>
        )}
        <div className={styles.questionList}>
          {questions
            .sort((b, a) => a.likeCount - b.likeCount)
            .sort((a, b) => Number(a.isAnswered) - Number(b.isAnswered))
            .sort((b, a) => Number(a.isHighlighted) - Number(b.isHighlighted))
            .map((question) => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                  isAnonymized={question.isAnonymized}
                >
                  {!question.isAnswered && (
                    <Tooltip title="Curtidas">
                      <button
                        type="button"
                        disabled={!user}
                        className={styles.standard}
                        aria-label="Curtidas"
                      >
                        {question.likeCount > 0 && (
                          <span>{question.likeCount}</span>
                        )}
                        <img src={likeImg} alt="Curtidas" />
                      </button>
                    </Tooltip>
                  )}
                  <Tooltip title="Responder">
                    <button
                      type="button"
                      className={cx("question-buttons", {
                        active: question.isAnswered,
                      })}
                      onClick={() =>
                        handleCheckQuestionAsAnswered(
                          question.id,
                          question.isAnswered
                        )
                      }
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12.0003"
                          cy="11.9998"
                          r="9.00375"
                          stroke="#737380"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193"
                          stroke="#737380"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </Tooltip>

                  {!question.isAnswered && (
                    <Tooltip title="Dar destaque">
                      <button
                        type="button"
                        className={question.isHighlighted ? "active" : ""}
                        onClick={() =>
                          handleHighlightQuestion(
                            question.id,
                            question.isHighlighted
                          )
                        }
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z"
                            stroke="#737380"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  )}
                  <ModalRemoveQuestion
                    questionId={question.id}
                    roomId={roomId}
                  />
                </Question>
              );
            })}
        </div>
      </main>
    </div>
  );
};

export { AdminRoom };
