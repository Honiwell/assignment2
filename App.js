import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

const MinesweeperApp = () => {
    const [level, setLevel] = useState('');
    const [size, setSize] = useState(0);
    const [mines, setMines] = useState(0);
    const [timer, setTimer] = useState(0);
    const [board, setBoard] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (level) {
            initializeGame();
            startTimer();
        }
    }, [level]);

    useEffect(() => {
        if (timer === 0 && !gameOver) {
            endGame('Time is up, game over.');
        }
    }, [timer]);

    const initializeGame = () => {
        let size, mines, timer;

        switch (level) {
            case 'easy':
                size = 5;
                mines = 3;
                timer = 15;
                break;
            case 'medium':
                size = 6;
                mines = 5;
                timer = 25;
                break;
            case 'hard':
                size = 7;
                mines = 7;
                timer = 40;
                break;
            case 'ridiculous':
                size = 12;
                mines = 9;
                timer = 80;
                break;
            default:
                break;
        }

        setSize(size);
        setMines(mines);
        setTimer(timer);
        setScore(0);
        setGameOver(false);
        setBoard(generateBoard(size, mines));
    };

    const generateBoard = (size, mines) => {
        const board = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => ({ isMine: false, isRevealed: false, isFlagged: false }))
        );

        let minesPlaced = 0;
        while (minesPlaced < mines) {
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);

            if (!board[row][col].isMine) {
                board[row][col].isMine = true;
                minesPlaced++;
            }
        }

        return board;
    };

    const startTimer = () => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === 1) {
                    clearInterval(interval);
                    endGame('Time is up, game over.');
                }
                return prevTimer - 1;
            });
        }, 2000);
    };

    const endGame = (message) => {
        setGameOver(true);
        Alert.alert(
            'Game Over',
            `${message}\nYour Score: ${score}`,
            [{ text: 'Restart', onPress: handleRestart }],
            { cancelable: false }
        );
    };

    const handleTilePress = (row, col) => {
        if (gameOver || board[row][col].isRevealed || board[row][col].isFlagged) {
            return;
        }

        const newBoard = [...board];
        newBoard[row][col].isRevealed = true;

        if (newBoard[row][col].isMine) {
            endGame('You stepped on a mine, game over.');
            return;
        }

        let newScore = score + 10;
        setScore(newScore);

        const isGameWon = newScore === (size * size - mines) * 10;
        if (isGameWon) {
            endGame('Congratulations! You won the game.');
        }

        setBoard(newBoard);
    };

    const handleTileLongPress = (row, col) => {
        if (gameOver || board[row][col].isRevealed) {
            return;
        }

        const newBoard = [...board];
        newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
        setBoard(newBoard);
    };

    const handleRestart = () => {
        setLevel('');
        setSize(0);
        setMines(0);
        setTimer(0);
        setBoard([]);
        setScore(0);
        setGameOver(false);
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.introLogo}
                source={require('./mine2.png')}
            />
            <Text></Text>
            <View style={styles.introText}>
                <Text style={styles.introText}>Welcome to MINE SWEPT!</Text>
                <Text style={styles.introText}>Your objective is the clear as many tiles as you can without tapping on a mine. It is a game of pure luck!</Text>
                <Text></Text>
            </View>
          
            {!level ? (
                <View>
                    <Text style={styles.levelText}>Select a level:</Text>
                    <TouchableOpacity style={styles.levelButton} onPress={() => setLevel('easy')}>
                        <Text style={styles.levelButtonText}>Easy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.levelButton} onPress={() => setLevel('medium')}>
                        <Text style={styles.levelButtonText}>Medium</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.levelButton} onPress={() => setLevel('hard')}>
                        <Text style={styles.levelButtonText}>Hard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.levelButton} onPress={() => setLevel('ridiculous')}>
                        <Text style={styles.levelButtonText}>Ridiculous</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <View style={styles.gameInfo}>
                        <Text style={styles.scoreText}>Score: {score}</Text>
                        <Text style={styles.timerText}>Time: {timer}s</Text>
                    </View>
                    <View style={styles.board}>
                        {board.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.map((tile, colIndex) => (
                                    <TouchableOpacity
                                        key={colIndex}
                                        style={[
                                            styles.tile,
                                            !tile.isRevealed && { backgroundColor: 'gray' },
                                            tile.isRevealed && styles.revealedTile,
                                        ]}
                                        onPress={() => handleTilePress(rowIndex, colIndex)}
                                        onLongPress={() => handleTileLongPress(rowIndex, colIndex)}
                                    >
                                        {tile.isRevealed && !tile.isMine && (
                                            <Text style={styles.tileText}>10</Text>
                                        )}
                                        {tile.isRevealed && tile.isMine && (
                                            <Text style={styles.tileText}>M</Text>
                                        )}
                                        {tile.isFlagged && (
                                            <Text style={styles.flagText}>F</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                    {gameOver && (
                        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
                            <Text style={styles.restartButtonText}>Restart Game</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    introLogo: {
        //flex: 1,
        width: '100%',
        height:'33%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    introText: {
        fontSize: 14,
        backgroundColor: 'lightblue',
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        //margin: 1,
        //padding: 1,
        borderRadius: 7,
    },
    levelText: {
        fontSize: 20,
        marginBottom: 10,
    },
    levelButton: {
        margin: 10,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    levelButtonText: {
        color: 'white',
        fontSize: 16,
    },
    gameInfo: {
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 20,
        marginBottom: 10,
    },
    timerText: {
        fontSize: 16,
        marginBottom: 10,
    },
    board: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
    tile: {
        width: 50,
        height: 50,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    revealedTile: {
        backgroundColor: 'white',
    },
    tileText: {
        fontSize: 20,
    },
    flagText: {
        fontSize: 20,
        color: 'red',
    },
    restartButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    restartButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default MinesweeperApp;
