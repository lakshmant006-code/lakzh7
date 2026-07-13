import { useEffect, useRef, useState, useCallback } from "react";

const CELL_SIZE = 8;
const INITIAL_SNAKE = [
  { x: 96, y: 68 },
  { x: 88, y: 68 },
  { x: 80, y: 68 },
];
const GAME_SPEED = 150;
// Matches inner screen shadow/bezel so death bounds align with visible frame edges.
const PLAYFIELD_INSET = { top: 2, right: 2, bottom: 0, left: 0 };

function measurePlayfield(el) {
  const { clientWidth, clientHeight } = el;

  return {
    left: PLAYFIELD_INSET.left,
    top: PLAYFIELD_INSET.top,
    width: clientWidth - PLAYFIELD_INSET.left - PLAYFIELD_INSET.right,
    height: clientHeight - PLAYFIELD_INSET.top - PLAYFIELD_INSET.bottom,
  };
}

export default function SnakeGame({
  direction,
  onDirectionChange,
  onStartGame,
}) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 144, y: 96 });
  const [currentDirection, setCurrentDirection] = useState("RIGHT");
  const [gameState, setGameState] = useState("idle");
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef(null);
  const screenRef = useRef(null);
  const [boundaries, setBoundaries] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const generateFood = useCallback(
    (snakeBody) => {
      if (boundaries.width === 0 || boundaries.height === 0) {
        return { x: 144, y: 96 };
      }

      let newFood;

      do {
        newFood = {
          x:
            boundaries.left +
            Math.floor(Math.random() * (boundaries.width / CELL_SIZE)) *
              CELL_SIZE,
          y:
            boundaries.top +
            Math.floor(Math.random() * (boundaries.height / CELL_SIZE)) *
              CELL_SIZE,
        };
      } while (
        snakeBody.some(
          (segment) => segment.x === newFood.x && segment.y === newFood.y,
        )
      );
      return newFood;
    },
    [boundaries],
  );

  const startGame = useCallback(() => {
    if (boundaries.width === 0 || boundaries.height === 0) return;

    const centerX =
      boundaries.left +
      Math.floor(boundaries.width / 2 / CELL_SIZE) * CELL_SIZE;
    const centerY =
      boundaries.top +
      Math.floor(boundaries.height / 2 / CELL_SIZE) * CELL_SIZE;

    const initialSnake = [
      { x: centerX, y: centerY },
      { x: centerX - CELL_SIZE, y: centerY },
      { x: centerX - CELL_SIZE * 2, y: centerY },
    ];

    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setCurrentDirection("RIGHT");
    setGameState("playing");
    setScore(0);
    onDirectionChange("RIGHT");
  }, [onDirectionChange, boundaries, generateFood]);

  useEffect(() => {
    onStartGame(startGame);
  }, [onStartGame, startGame]);

  useEffect(() => {
    if (!screenRef.current) return;

    const measureBoundaries = () => {
      if (!screenRef.current) return;
      setBoundaries(measurePlayfield(screenRef.current));
    };

    measureBoundaries();
    window.addEventListener("resize", measureBoundaries);

    return () => {
      window.removeEventListener("resize", measureBoundaries);
    };
  }, []);

  const moveSnake = useCallback(() => {
    if (
      gameState !== "playing" ||
      boundaries.width === 0 ||
      boundaries.height === 0
    )
      return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      let newHead;

      switch (currentDirection) {
        case "UP":
          newHead = { x: head.x, y: head.y - CELL_SIZE };
          break;
        case "DOWN":
          newHead = { x: head.x, y: head.y + CELL_SIZE };
          break;
        case "LEFT":
          newHead = { x: head.x - CELL_SIZE, y: head.y };
          break;
        case "RIGHT":
          newHead = { x: head.x + CELL_SIZE, y: head.y };
          break;
      }

      const playRight = boundaries.left + boundaries.width;
      const playBottom = boundaries.top + boundaries.height;

      if (
        newHead.x < boundaries.left ||
        newHead.x + CELL_SIZE > playRight ||
        newHead.y < boundaries.top ||
        newHead.y + CELL_SIZE > playBottom ||
        prevSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y,
        )
      ) {
        setGameState("game_over");
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 1);
        setFood(generateFood(newSnake));
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [currentDirection, food, gameState, boundaries, generateFood]);

  useEffect(() => {
    if (direction) {
      const opposites = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      };

      if (opposites[direction] !== currentDirection) {
        setCurrentDirection(direction);
      }
    }
  }, [direction, currentDirection]);

  useEffect(() => {
    if (gameState !== "playing") {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [moveSnake, gameState]);

  return (
    <div className="absolute inset-[14px] flex items-center justify-center">
      <div
        ref={screenRef}
        className="relative overflow-hidden bg-[#1b1b1b] w-full h-full"
      >
        {gameState === "playing" && (
          <div className="absolute top-1 left-1 text-[#4a934a] text-[10px] gameboy-pixel-text z-10">
            {score}
          </div>
        )}

        {gameState === "playing" &&
          snake.map((segment, index) => (
            <div
              key={index}
              className="absolute bg-[#4a934a]"
              style={{
                width: CELL_SIZE - 1,
                height: CELL_SIZE - 1,
                left: segment.x,
                top: segment.y,
              }}
            />
          ))}

        {gameState === "playing" && (
          <div
            className="absolute"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: food.x,
              top: food.y,
            }}
          >
            <svg
              viewBox="0 0 8 8"
              className="w-full h-full"
              shapeRendering="crispEdges"
            >
              <path
                d="M 4 0 L 6 2 L 8 4 L 6 6 L 4 8 L 2 6 L 0 4 L 2 2 Z"
                fill="#f05555"
              />
            </svg>
          </div>
        )}

        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1b1b1b]">
            <div className="text-[#4a934a] text-[10px] gameboy-pixel-text">
              Press START
            </div>
          </div>
        )}

        {gameState === "game_over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1b1b1b]/90">
            <div className="text-[#e84949] text-[12px] gameboy-pixel-text mb-2">
              GAME OVER
            </div>
            <div className="text-[#4a934a] text-[10px] gameboy-pixel-text mb-2">
              Score: {score}
            </div>
            <div className="text-[#858585] text-[8px] gameboy-pixel-text">
              Press START
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
