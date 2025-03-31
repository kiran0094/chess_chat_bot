import Suggestion_button from "./promt_suggestion_button";

const Prompt_suggestion = ({
  onpromptclick,
}: {
  onpromptclick: (prompt: string) => void;
}) => {
  const prompts = [
    "Do you know the origins of chess? It has evolved over centuries from an ancient Indian game called Chaturanga.",
    "Which chess world champion do you admire the most? Players like Magnus Carlsen, Garry Kasparov, and Bobby Fischer have shaped modern chess.",
    "Are you familiar with the three phases of a chess game? (Opening, Middlegame, and Endgame) Which one do you find the most challenging?",
    "Would you like to learn about famous chess openings? Openings like the Sicilian Defense, King's Indian, and Ruy-Lopez are widely used in competitive play.",
  ];
  return (
    <div>
      {prompts.map((prompt, index) => (
        <Suggestion_button
          text={prompt}
          key={`suggestion-${index}`}
          onClick={() => onpromptclick(prompt)}
        />
      ))}
    </div>
  );
};

export default Prompt_suggestion;