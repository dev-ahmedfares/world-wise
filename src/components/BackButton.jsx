import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
    const nav = useNavigate()
  return (
    <Button
      onclick={(e) => {
        e.preventDefault();
        nav(-1);
      }}
      type={"back"}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
