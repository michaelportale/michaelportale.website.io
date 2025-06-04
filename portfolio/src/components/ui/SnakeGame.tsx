/**
 * Snake Game Component for React
 * 
 * A classic Snake game implementation using React and Canvas.
 * This implementation uses React for state management and UI rendering,
 * while using the Canvas API for the actual game graphics.
 */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

/**
 * Styled Components for the game UI
 */
// Main container for the game
const GameContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background-color: #1f2937;
  overflow: hidden;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.primary};
`;

// Canvas element where the game is drawn
const GameCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  background: #eee;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
`;

// Overlay for menus, pause screen, and game over screen
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  z-index: 10;
`;

// Button component for menu interactions
const Button = styled.button`
  cursor: pointer;
  font-size: 16px;
  padding: 8px 16px;
  margin: 10px;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
`;

// Styled components for difficulty buttons
const DifficultyButton = styled(Button)<{ isSelected: boolean }>`
  background-color: ${({ isSelected, theme }) => isSelected ? theme.primary : '#555'};
  opacity: ${({ isSelected }) => isSelected ? 1 : 0.7};
  margin: 5px;
`;

// Info bar at the bottom showing score, level, etc.
const InfoBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px; // Fixed height to match our calculations
  background: #1f2937;
  color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0;
  border-top: 2px solid ${({ theme }) => theme.primary};
  font-weight: 500;
  
  span {
    margin: 0;
    padding: 0 10px;
  }
`;

/**
 * Game State Enum
 * 
 * Defines the possible states the game can be in:
 * - MENU: Start menu, game not yet started
 * - PLAYING: Game is actively running
 * - PAUSED: Game is paused
 * - GAME_OVER: Game has ended
 */
enum GameState {
  MENU,
  PLAYING,
  PAUSED,
  GAME_OVER
}

/**
 * Difficulty Enum
 * 
 * Defines the available difficulty levels:
 * - EASY: Slow snake movement, good for beginners
 * - NORMAL: Medium snake movement
 * - HARD: Fast snake movement, for experienced players
 */
enum Difficulty {
  EASY,
  NORMAL,
  HARD
}

/**
 * Snake Segment interface - defines a segment of the snake
 */
interface SnakeSegment {
  x: number;
  y: number;
}

/**
 * Food position interface
 */
interface FoodPosition {
  x: number;
  y: number;
}

/**
 * Props interface for the SnakeGame component
 */
interface SnakeGameProps {
  onScoreChange: (score: number) => void; // Callback to report score changes
}

/**
 * SnakeGame Component
 * 
 * Main component that implements the Snake game logic and rendering.
 */
const SnakeGame: React.FC<Partial<SnakeGameProps>> = ({ onScoreChange = () => {} }) => {
  /**
   * React State Hooks
   * 
   * These manage the UI state of the game.
   */
  // Current game state (menu, playing, paused, game over)
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  // Current score
  const [score, setScore] = useState(0);
  // Current level (increases every 5 points)
  const [level, setLevel] = useState(1);
  // High score (persisted in localStorage)
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore') || '0');
  });
  
  // Store snake segments in React state to persist between renders
  const [snake, setSnake] = useState<SnakeSegment[]>([]);
  // Store food position in React state
  const [food, setFood] = useState<FoodPosition>({ x: 0, y: 0 });
  // Direction of snake movement
  const [snakeDir, setSnakeDir] = useState<string>('RIGHT');
  // Game difficulty level
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);
  // Direction buffer to prevent multiple direction changes between movement updates
  const directionBufferRef = useRef<string>('');

  /**
   * React Refs
   * 
   * These provide direct access to DOM elements.
   */
  const canvasRef = useRef<HTMLCanvasElement>(null); // Canvas element
  const scoreDisplayRef = useRef<HTMLSpanElement>(null); // Score display
  const levelDisplayRef = useRef<HTMLSpanElement>(null); // Level display
  const finalScoreRef = useRef<HTMLParagraphElement>(null); // Final score on game over
  const highScoreDisplayRef = useRef<HTMLParagraphElement>(null); // High score on game over
  
  // Ref to hold the animation frame ID - using the correct type for requestAnimationFrame
  const frameIdRef = useRef<number>(0);
  // Ref for last frame time to control game speed
  const lastFrameTimeRef = useRef<number>(0);
  // Ref for tile size and grid dimensions
  const gameDimensionsRef = useRef<{ tilesX: number; tilesY: number; tileSize: number }>({ tilesX: 0, tilesY: 0, tileSize: 0 });
  
  /**
   * Draw Grid Function
   */
  const drawGrid = (ctx: CanvasRenderingContext2D, playableHeight: number) => {
    const { tileSize, tilesX, tilesY } = gameDimensionsRef.current;
    
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.5;
    
    // Draw vertical grid lines
    for (let i = 0; i <= tilesX; i++) {
      ctx.beginPath();
      ctx.moveTo(i * tileSize, 0);
      ctx.lineTo(i * tileSize, playableHeight);
      ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let j = 0; j <= tilesY; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * tileSize);
      ctx.lineTo(ctx.canvas.width, j * tileSize);
      ctx.stroke();
    }
  };
  
  /**
   * Draw Function - Simple and reliable
   */
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { tileSize, tilesX, tilesY } = gameDimensionsRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate the playable area (excluding info bar)
    const playableHeight = tilesY * tileSize;
    
    // Draw a background for the info bar area
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, playableHeight, canvas.width, canvas.height - playableHeight);
    
    // Draw grid only in the playable area
    drawGrid(ctx, playableHeight);
    
    // Skip if not in a gameplay state
    if (gameState !== GameState.PLAYING && gameState !== GameState.PAUSED) return;
    
    // Draw snake - head
    if (snake.length > 0) {
      // Head
      ctx.fillStyle = '#00AA00';
      ctx.fillRect(
        snake[0].x * tileSize,
        snake[0].y * tileSize,
        tileSize,
        tileSize
      );
      
      // Body
      ctx.fillStyle = '#008000';
      for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(
          snake[i].x * tileSize,
          snake[i].y * tileSize,
          tileSize,
          tileSize
        );
      }
    }
    
    // Draw food
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(
      food.x * tileSize,
      food.y * tileSize,
      tileSize,
      tileSize
    );
  };
  
  /**
   * Initialize game
   */
  const initializeGame = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Calculate the info bar height and adjust playable area
    const infoBarHeight = 40; // Approximate height of the info bar
    const playableHeight = canvas.height - infoBarHeight;
    
    // Calculate grid dimensions
    const tileSize = 20;
    const tilesX = Math.floor(canvas.width / tileSize);
    const tilesY = Math.floor(playableHeight / tileSize);
    
    // Store dimensions in ref
    gameDimensionsRef.current = { tileSize, tilesX, tilesY };
    
    // Initialize snake in the center
    const startX = Math.floor(tilesX / 2);
    const startY = Math.floor(tilesY / 2);
    
    const newSnake: SnakeSegment[] = [];
    for (let i = 0; i < 3; i++) {
      newSnake.push({ x: startX - i, y: startY });
    }
    
    // Set snake in state
    setSnake(newSnake);
    setSnakeDir('RIGHT');
    
    // Place initial food in a random position
    const x = Math.floor(Math.random() * (tilesX - 2)) + 1;
    const y = Math.floor(Math.random() * (tilesY - 2)) + 1;
    setFood({ x, y });
    
    // Force an initial draw to ensure everything is visible
    setTimeout(() => draw(), 50);
  };
  
  /**
   * Game Control Functions
   * 
   * Functions to start, restart, and pause the game.
   */
  // Start a new game
  const handleStartGame = () => {
    console.log("Starting game...");
    setScore(0);
    setLevel(1);
    setGameState(GameState.PLAYING);
    setSnakeDir('RIGHT'); // Reset direction to RIGHT
    directionBufferRef.current = ''; // Clear any buffered direction
    initializeGame();
    
    // Focus the game container to ensure keyboard controls work
    const container = document.querySelector('[tabindex="0"]') as HTMLElement;
    if (container) {
      container.focus();
    }
  };
  
  // Restart after game over
  const handleRestartGame = () => {
    console.log("Restarting game...");
    setScore(0);
    setLevel(1);
    setGameState(GameState.PLAYING);
    setSnakeDir('RIGHT'); // Reset direction to RIGHT
    directionBufferRef.current = ''; // Clear any buffered direction
    initializeGame();
    
    // Focus the game container to ensure keyboard controls work
    const container = document.querySelector('[tabindex="0"]') as HTMLElement;
    if (container) {
      container.focus();
    }
  };
  
  // Toggle pause state
  const handlePauseGame = () => {
    if (gameState === GameState.PLAYING) {
      console.log("Pausing game");
      setGameState(GameState.PAUSED);
      // Cancel animation frame when pausing
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    } else if (gameState === GameState.PAUSED) {
      console.log("Resuming game");
      setGameState(GameState.PLAYING);
      // Reset the timer when resuming to prevent jumps
      lastFrameTimeRef.current = 0;
    }
  };
  
  /**
   * Keyboard Event Handler for Game Controls
   * 
   * This handles global keyboard events for starting, pausing, etc.
   * (Movement keys are handled separately within the game loop)
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Always prevent default for arrow keys to stop page scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Handle pause with 'P' key
      if (e.key === 'p' || e.key === 'P') {
        if (gameState === GameState.PLAYING || gameState === GameState.PAUSED) {
          handlePauseGame();
        }
      }
      
      // Start game with any arrow key when on menu
      if (gameState === GameState.MENU && e.key.startsWith('Arrow')) {
        handleStartGame();
      }
      
      // Handle direction changes
      if (gameState === GameState.PLAYING) {
        switch (e.key) {
          case 'ArrowUp':
            if (snakeDir !== 'DOWN') directionBufferRef.current = 'UP';
            break;
          case 'ArrowDown':
            if (snakeDir !== 'UP') directionBufferRef.current = 'DOWN';
            break;
          case 'ArrowLeft':
            if (snakeDir !== 'RIGHT') directionBufferRef.current = 'LEFT';
            break;
          case 'ArrowRight':
            if (snakeDir !== 'LEFT') directionBufferRef.current = 'RIGHT';
            break;
        }
      }
    };
    
    // Add and remove event listener
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [gameState, snakeDir]);
  
  /**
   * High Score Update Effect
   * 
   * Updates the high score when game ends and saves to localStorage.
   */
  useEffect(() => {
    if (gameState === GameState.GAME_OVER && score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [gameState, score, highScore]);
  
  /**
   * Game Loop Effect - Simplified for reliability
   */
  useEffect(() => {
    // Only run the game loop when playing
    if (gameState !== GameState.PLAYING) return;
    
    console.log("Starting game loop with", snake.length, "snake segments");
    
    // Calculate movement speed based on difficulty and level
    let baseSpeed, speedIncrement, minSpeed;
    switch (difficulty) {
      case Difficulty.EASY:
        baseSpeed = 140; // Faster
        speedIncrement = 4;
        minSpeed = 80;
        break;
      case Difficulty.HARD:
        baseSpeed = 40; // Super fast
        speedIncrement = 2;
        minSpeed = 20;
        break;
      case Difficulty.NORMAL:
      default:
        baseSpeed = 80; // Quite fast
        speedIncrement = 3;
        minSpeed = 40;
        break;
    }
    
    // Calculate speed with a dramatic difference between difficulties
    const speed = Math.max(baseSpeed - (level - 1) * speedIncrement, minSpeed);
    console.log(`Starting game with difficulty: ${Difficulty[difficulty]}, Speed: ${speed}ms between moves`);
    
    // Reset the last frame time to ensure fresh timing
    lastFrameTimeRef.current = 0;
    
    // Set up animation frame for rendering and game updates
    const renderLoop = (timestamp: number) => {
      // First frame initialization
      if (lastFrameTimeRef.current === 0) {
        lastFrameTimeRef.current = timestamp;
      }
      
      // Calculate delta time since last frame
      const deltaTime = timestamp - lastFrameTimeRef.current;
      
      // Draw current game state (every frame)
      draw();
      
      // Only update game logic when enough time has passed (based on difficulty)
      if (deltaTime > speed) {
        // Reset timer
        lastFrameTimeRef.current = timestamp;
        
        // Only update if the game is still playing
        if (gameState !== GameState.PLAYING) {
          frameIdRef.current = requestAnimationFrame(renderLoop);
          return;
        }
        
        // Create new head position based on current direction
        if (snake.length === 0) {
          frameIdRef.current = requestAnimationFrame(renderLoop);
          return;
        }
        
        // Apply buffered direction change if any
        if (directionBufferRef.current) {
          setSnakeDir(directionBufferRef.current);
          directionBufferRef.current = '';
        }
        
        const head = { ...snake[0] };
        
        // Move head based on direction
        switch (snakeDir) {
          case 'LEFT': head.x--; break;
          case 'RIGHT': head.x++; break;
          case 'UP': head.y--; break;
          case 'DOWN': head.y++; break;
        }
        
        // Check for collisions
        const { tilesX, tilesY } = gameDimensionsRef.current;
        
        // Wall collision with more detailed logging
        if (head.x < 0 || head.x >= tilesX || head.y < 0 || head.y >= tilesY) {
          console.log(`Wall collision at position (${head.x}, ${head.y}), grid size: ${tilesX}x${tilesY}`);
          setGameState(GameState.GAME_OVER);
          return;
        }
        
        // Self collision - check entire body except tail for more reliable detection
        for (let i = 1; i < snake.length - 1; i++) {
          if (snake[i].x === head.x && snake[i].y === head.y) {
            console.log(`Self collision at segment ${i} of ${snake.length}, position (${head.x}, ${head.y})`);
            setGameState(GameState.GAME_OVER);
            return;
          }
        }
        
        // Create new snake array
        const newSnake = [head, ...snake.slice(0)];
        
        // Check if food is eaten
        const ateFood = head.x === food.x && head.y === food.y;
        
        if (!ateFood) {
          // Remove tail if no food eaten
          newSnake.pop();
        } else {
          // Food collected - keep tail and increase score
          setScore(prevScore => prevScore + 1);
          
          // Place new food in random position
          let newFoodX = 0, newFoodY = 0;
          let validPosition = false;
          
          while (!validPosition) {
            newFoodX = Math.floor(Math.random() * (tilesX - 2)) + 1;
            newFoodY = Math.floor(Math.random() * (tilesY - 2)) + 1;
            
            validPosition = true;
            
            // Make sure food doesn't appear on snake
            for (const segment of newSnake) {
              if (segment.x === newFoodX && segment.y === newFoodY) {
                validPosition = false;
                break;
              }
            }
          }
          
          setFood({ x: newFoodX, y: newFoodY });
        }
        
        // Update snake position
        setSnake(newSnake);
      }
      
      // Request next frame
      frameIdRef.current = requestAnimationFrame(renderLoop);
    };
    
    // Start render loop
    frameIdRef.current = requestAnimationFrame(renderLoop);
    
    // Clean up animation frame on unmount
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = 0;
      }
    };
  }, [gameState, level, snake, snakeDir, food, difficulty]);
  
  /**
   * Level Update Effect
   */
  useEffect(() => {
    // Update level based on score every time score changes
    const newLevel = Math.floor(score / 5) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [score, level]);
  
  /**
   * Draw Effect - Ensure the game is drawn when not playing too
   */
  useEffect(() => {
    // Draw current state whenever these values change
    draw();
  }, [gameState]);
  
  /**
   * Component Render Method
   * 
   * Renders the game UI based on current game state.
   */
  return (
    <GameContainer 
      onKeyDown={(e) => {
        // Prevent arrow key scrolling
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      tabIndex={0} // Makes the div focusable so it can receive keyboard events
    >
      {/* Game canvas (always rendered) */}
      <GameCanvas ref={canvasRef} />
      
      {/* Start Menu - shown when game state is MENU */}
      {gameState === GameState.MENU && (
        <Overlay>
          <h2>Snake Game</h2>
          <p>Use arrow keys to control the snake.</p>
          <p>Collect food to grow and earn points.</p>
          <div style={{ marginBottom: '15px' }}>
            <p>Select Difficulty:</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <DifficultyButton
                onClick={() => setDifficulty(Difficulty.EASY)}
                isSelected={difficulty === Difficulty.EASY}
              >
                Easy
              </DifficultyButton>
              <DifficultyButton
                onClick={() => setDifficulty(Difficulty.NORMAL)}
                isSelected={difficulty === Difficulty.NORMAL}
              >
                Normal
              </DifficultyButton>
              <DifficultyButton
                onClick={() => setDifficulty(Difficulty.HARD)}
                isSelected={difficulty === Difficulty.HARD}
              >
                Hard
              </DifficultyButton>
            </div>
          </div>
          <Button onClick={handleStartGame}>
            Start Game
          </Button>
        </Overlay>
      )}
      
      {/* Pause Screen - shown when game state is PAUSED */}
      {gameState === GameState.PAUSED && (
        <Overlay>
          <h2>Game Paused</h2>
          <p>Press "P" again to resume.</p>
        </Overlay>
      )}
      
      {/* Game Over Screen - shown when game state is GAME_OVER */}
      {gameState === GameState.GAME_OVER && (
        <Overlay>
          <h2>Game Over</h2>
          <p ref={finalScoreRef}>Your Score: {score}</p>
          <p ref={highScoreDisplayRef}>High Score: {highScore}</p>
          <Button onClick={handleRestartGame}>
            Restart
          </Button>
        </Overlay>
      )}
      
      {/* Info Bar - shown when playing or paused */}
      {(gameState === GameState.PLAYING || gameState === GameState.PAUSED) && (
        <InfoBar>
          <span ref={scoreDisplayRef}>Score: {score}</span>
          <span ref={levelDisplayRef}>Level: {level}</span>
          <span>
            Difficulty: {Difficulty[difficulty]}
          </span>
          <span>Press "P" to Pause</span>
        </InfoBar>
      )}
    </GameContainer>
  );
};

export default SnakeGame; 