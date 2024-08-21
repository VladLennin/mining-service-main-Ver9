import coinSound from "./coin.mp3"

class SoundService {
  static makeVibration(time: number[]) {
    window.navigator.vibrate(time);
  }

  static makeSound() {
    const mySound = new Audio(coinSound);
    mySound.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }
}

export default SoundService;

// {
/* <button
        onClick={() => {
          window.navigator.vibrate(200); // Вибрировать 200ms
          window.navigator.vibrate([
            100, 30, 100, 30, 100, 200, 200, 30, 200, 30, 200, 200, 100, 30,
            100, 30, 100,
          ]);
        }}
      >
        vibra
      </button> */
// }
