// Snake Game Module
class SnakeGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.score = 0;
        this.gameInterval = null;
        this.scoreElement = null;
        this.gameContainer = null;
        this.difficultyElement = null;
        this.gameSpeed = 100; // Default medium speed
        this.difficulty = 'medium'; // Default difficulty
        
        this.init();
    }
    
    init() {
        // Get DOM elements
        const playButton = document.getElementById('play-snake');
        const closeButton = document.getElementById('close-game');
        this.gameContainer = document.getElementById('snake-game-container');
        const gameCanvas = document.getElementById('snake-game');
        this.scoreElement = document.getElementById('score');
        this.difficultyElement = document.getElementById('difficulty-display');
        
        // Set up event listeners
        playButton?.addEventListener('click', () => {
            this.gameContainer.classList.remove('hidden');
            this.showDifficultyMenu();
        });

        closeButton?.addEventListener('click', () => {
            this.gameContainer.classList.add('hidden');
            this.stopGame();
        });
        
        // Set up keyboard controls with scrolling fix
        document.addEventListener('keydown', (e) => {
            // Prevent default behavior for all arrow keys to stop page scrolling
            if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Handle spacebar for game restart/start
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                e.stopPropagation();
                
                // Only handle spacebar if game container is visible
                if (!this.gameContainer.classList.contains('hidden')) {
                    // If we're in the difficulty menu, ignore spacebar
                    const difficultyMenu = this.gameContainer.querySelector('.difficulty-menu');
                    if (difficultyMenu) {
                        return;
                    }
                    
                    // If canvas exists, restart the current game directly
                    if (this.canvas) {
                        this.initGame(); // Restart with same difficulty
                    }
                }
            }
            
            this.changeDirection(e);
        });
    }
    
    initGame() {
        const gameCanvas = document.getElementById('snake-game');
        if (!gameCanvas) return;
        
        // Remove any existing play again button at game start
        const existingButton = this.gameContainer.querySelector('.play-again-btn');
        if (existingButton) {
            existingButton.remove();
        }
        
        // Remove any existing spacebar hint text
        const existingSpacebarText = this.gameContainer.querySelector('.spacebar-hint');
        if (existingSpacebarText) {
            existingSpacebarText.remove();
        }
        
        // Remove any existing difficulty menu
        const existingMenu = this.gameContainer.querySelector('.difficulty-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // Always create a fresh canvas or ensure it's properly set up
        if (this.canvas) {
            // Remove existing canvas if it exists
            this.canvas.remove();
            this.canvas = null;
            this.ctx = null;
        }
        
        // Create new canvas
        this.canvas = document.createElement('canvas');
        
        // Set canvas dimensions
        this.canvas.width = 500; // Fixed width for consistency
        this.canvas.height = 300; // Fixed height for consistency
        
        // Apply border styling directly to canvas
        this.canvas.style.border = '3px solid #4a6bff';
        this.canvas.style.borderRadius = '5px';
        this.canvas.style.backgroundColor = '#0a0e1a';
        this.canvas.style.boxSizing = 'border-box';
        this.canvas.style.display = 'block';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '300px';
        
        // Clear any existing content and add canvas
        gameCanvas.innerHTML = '';
        gameCanvas.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Clear canvas completely
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#0a0e1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Reset game state
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        
        this.direction = 'right';
        this.score = 0;
        this.scoreElement.textContent = `Score: ${this.score}`;
        
        // Generate first food
        this.generateFood();
        
        // Start game loop with selected difficulty speed
        this.stopGame(); // Clear any existing interval
        this.gameInterval = setInterval(() => this.gameLoop(), this.gameSpeed);
    }
    
    stopGame() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
    }
    
    gameLoop() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.fillStyle = '#0a0e1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Move snake
        this.moveSnake();
        
        // Check collision with food
        if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
            this.score++;
            this.scoreElement.textContent = `Score: ${this.score}`;
            
            // Don't remove tail piece (snake grows)
            this.generateFood();
        } else {
            // Remove tail piece
            this.snake.pop();
        }
        
        // Check collision with walls or self
        if (this.checkCollision()) {
            this.stopGame();
            this.showGameOver();
            return;
        }
        
        // Draw snake and food
        this.drawSnake();
        this.drawFood();
    }
    
    moveSnake() {
        // Create new head based on current direction
        const head = { x: this.snake[0].x, y: this.snake[0].y };
        
        switch (this.direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Add new head to beginning of snake array
        this.snake.unshift(head);
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            // Calculate grid size
            const gridSize = Math.min(this.canvas.width, this.canvas.height) / 20;
            
            // Draw segment
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#64ffda';
            } else {
                // Body with gradient
                this.ctx.fillStyle = `rgba(74, 107, 255, ${1 - index / this.snake.length})`;
            }
            
            this.ctx.fillRect(
                segment.x * gridSize, 
                segment.y * gridSize, 
                gridSize, 
                gridSize
            );
            
            // Add border
            this.ctx.strokeStyle = '#0a0e1a';
            this.ctx.strokeRect(
                segment.x * gridSize, 
                segment.y * gridSize, 
                gridSize, 
                gridSize
            );
        });
    }
    
    generateFood() {
        const gridSize = Math.min(this.canvas.width, this.canvas.height) / 20;
        const maxX = Math.floor(this.canvas.width / gridSize) - 1;
        const maxY = Math.floor(this.canvas.height / gridSize) - 1;
        
        // Generate random position for food
        this.food = {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
        
        // Make sure food doesn't spawn on snake
        for (let segment of this.snake) {
            if (segment.x === this.food.x && segment.y === this.food.y) {
                this.generateFood(); // Recursive call to find a new position
                return;
            }
        }
    }
    
    drawFood() {
        const gridSize = Math.min(this.canvas.width, this.canvas.height) / 20;
        
        // Create gradient
        const gradient = this.ctx.createRadialGradient(
            this.food.x * gridSize + gridSize / 2, 
            this.food.y * gridSize + gridSize / 2, 
            gridSize / 10,
            this.food.x * gridSize + gridSize / 2, 
            this.food.y * gridSize + gridSize / 2, 
            gridSize / 2
        );
        
        gradient.addColorStop(0, '#ff5e5e');
        gradient.addColorStop(1, '#ff0000');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * gridSize + gridSize / 2,
            this.food.y * gridSize + gridSize / 2,
            gridSize / 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
    
    changeDirection(e) {
        // Prevent reverse direction
        switch (e.key) {
            case 'ArrowUp':
                if (this.direction !== 'down') this.direction = 'up';
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') this.direction = 'down';
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') this.direction = 'left';
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') this.direction = 'right';
                break;
        }
    }
    
    checkCollision() {
        const gridSize = Math.min(this.canvas.width, this.canvas.height) / 20;
        const maxX = Math.floor(this.canvas.width / gridSize) - 1;
        const maxY = Math.floor(this.canvas.height / gridSize) - 1;
        const head = this.snake[0];
        
        // Check wall collision
        if (head.x < 0 || head.x > maxX || head.y < 0 || head.y > maxY) {
            return true;
        }
        
        // Check self collision (skip the head)
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    showGameOver() {
        // Game over display
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        // Create Play Again button
        this.createPlayAgainButton();
    }
    
    createPlayAgainButton() {
        // Remove any existing play again button
        const existingButton = this.gameContainer.querySelector('.play-again-btn');
        if (existingButton) {
            existingButton.remove();
        }
        
        // Remove any existing spacebar text
        const existingSpacebarText = this.gameContainer.querySelector('.spacebar-hint');
        if (existingSpacebarText) {
            existingSpacebarText.remove();
        }
        
        // Create new play again button
        const playAgainBtn = document.createElement('button');
        playAgainBtn.textContent = 'Play Again';
        playAgainBtn.className = 'play-again-btn';
        playAgainBtn.style.cssText = `
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            background: linear-gradient(135deg, #4a6bff, #3a54d6);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(74, 107, 255, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        // Create spacebar hint text
        const spacebarHint = document.createElement('p');
        spacebarHint.textContent = 'or press SPACEBAR';
        spacebarHint.className = 'spacebar-hint';
        spacebarHint.style.cssText = `
            position: absolute;
            top: 70%;
            left: 50%;
            transform: translateX(-50%);
            margin: 0;
            font-size: 12px;
            color: #64ffda;
            text-align: center;
            z-index: 1000;
            opacity: 0.8;
        `;
        
        // Add hover effect
        playAgainBtn.addEventListener('mouseenter', () => {
            playAgainBtn.style.transform = 'translateX(-50%) translateY(-2px)';
            playAgainBtn.style.boxShadow = '0 6px 20px rgba(74, 107, 255, 0.4)';
        });
        
        playAgainBtn.addEventListener('mouseleave', () => {
            playAgainBtn.style.transform = 'translateX(-50%)';
            playAgainBtn.style.boxShadow = '0 4px 15px rgba(74, 107, 255, 0.3)';
        });
        
        // Add click handler to restart game
        playAgainBtn.addEventListener('click', () => {
            playAgainBtn.remove();
            spacebarHint.remove();
            this.initGame(); // Restart the game directly
        });
        
        // Add button and hint to game container
        this.gameContainer.appendChild(playAgainBtn);
        this.gameContainer.appendChild(spacebarHint);
    }
    
    showDifficultyMenu() {
        // Clear any existing content
        const gameCanvas = document.getElementById('snake-game');
        if (gameCanvas) {
            gameCanvas.innerHTML = '';
        }
        
        // Remove any existing difficulty menu
        const existingMenu = this.gameContainer.querySelector('.difficulty-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // Remove any leftover play again button or spacebar hint
        const existingButton = this.gameContainer.querySelector('.play-again-btn');
        if (existingButton) {
            existingButton.remove();
        }
        
        const existingSpacebarHint = this.gameContainer.querySelector('.spacebar-hint');
        if (existingSpacebarHint) {
            existingSpacebarHint.remove();
        }
        
        // Create difficulty menu container
        const difficultyMenu = document.createElement('div');
        difficultyMenu.className = 'difficulty-menu';
        difficultyMenu.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            gap: 20px;
        `;
        
        // Create title
        const title = document.createElement('h3');
        title.textContent = 'Select Difficulty';
        title.style.cssText = `
            color: #64ffda;
            font-size: 24px;
            margin: 0 0 10px 0;
            text-align: center;
        `;
        
        // Create difficulty buttons
        const difficulties = [
            { name: 'Easy', speed: 150, description: 'Slow and steady' },
            { name: 'Medium', speed: 100, description: 'Balanced pace' },
            { name: 'Hard', speed: 60, description: 'Lightning fast!' }
        ];
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
            width: 100%;
            max-width: 300px;
        `;
        
        difficulties.forEach(diff => {
            const button = document.createElement('button');
            button.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <span style="font-size: 18px; font-weight: bold;">${diff.name}</span>
                    <span style="font-size: 12px; opacity: 0.8; margin-top: 4px;">${diff.description}</span>
                </div>
            `;
            button.style.cssText = `
                padding: 15px 20px;
                font-size: 16px;
                color: white;
                background: linear-gradient(135deg, #4a6bff, #3a54d6);
                border: none;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(74, 107, 255, 0.3);
                transition: all 0.3s ease;
                width: 100%;
            `;
            
            // Add hover effects
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 6px 20px rgba(74, 107, 255, 0.4)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 4px 15px rgba(74, 107, 255, 0.3)';
            });
            
            // Add click handler
            button.addEventListener('click', () => {
                this.setDifficulty(diff.name.toLowerCase(), diff.speed);
                difficultyMenu.remove();
                this.initGame();
            });
            
            buttonsContainer.appendChild(button);
        });
        
        // Assemble menu
        difficultyMenu.appendChild(title);
        difficultyMenu.appendChild(buttonsContainer);
        
        // Add to game container
        this.gameContainer.appendChild(difficultyMenu);
    }
    
    setDifficulty(difficulty, speed) {
        this.difficulty = difficulty;
        this.gameSpeed = speed;
        if (this.difficultyElement) {
            this.difficultyElement.textContent = `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
}); 