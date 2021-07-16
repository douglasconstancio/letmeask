import { ReactNode } from "react";
import cx from "classnames";

import Anonymous from '../../assets/images/profile.png'

import "./styles.scss";

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
  isAnonymized?: boolean;
}

const Question = ({
  author,
  content,
  children,
  isAnswered = false,
  isHighlighted = false,
  isAnonymized = false,
}: QuestionProps) => {
  const { avatar, displayName } = isAnonymized
    ? { displayName: "Anônimo", avatar: Anonymous }
    : { displayName: author.name, avatar: author.avatar }

  return (
    <div
      className={cx(
        "question",
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered }
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={avatar} alt={displayName} />
          <span>{displayName}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
};

export { Question };
