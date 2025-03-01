# 🎲 Provably Fair Dice Game

A simple **Provably Fair Dice Game** built using **React (Next.js) for the frontend** and **Node.js (Express) for the backend**. This game allows players to bet an amount, roll a dice (1-6), and win or lose based on the result. The fairness of the game is ensured using **SHA-256 hashing**.

## 🚀 Features

### **Game Mechanics**

- Players start with a **\$1000 credit balance**.
- Input field to place a **bet amount**.
- Click **"Roll Dice"** to generate a **random number (1-6)**.
- If the roll is **4, 5, or 6 → Player wins (2x payout)**.
- If the roll is **1, 2, or 3 → Player loses (bet is deducted)**.
- Display current balance and update dynamically.

### **Technical Stack**

- **Frontend**: React (Next.js), Tailwind CSS (for dark-themed UI)
- **Backend**: Node.js (Express.js), SHA-256 hashing for provable fairness
- **Web3 Integration (Bonus)**: Ethers.js to simulate a crypto wallet balance (if enabled)
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: localStorage (fallback for balance storage)

---

## 🛠️ Installation & Setup

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/yourusername/provably-fair-dice.git
cd provably-fair-dice
```

### **2️⃣ Install Dependencies**

#### Frontend

```sh
cd client
npm install  # or yarn install
```

#### Backend

```sh
cd server
npm install  # or yarn install
```

### **3️⃣ Start the Development Servers**

#### Run the Backend (Server)

```sh
cd server
npm run dev  # Runs on PORT 5000
```

#### Run the Frontend (Client)

```sh
cd client
npm run dev  # Runs on PORT 3000
```

---

## 🔗 API Endpoints

### **🎲 Roll Dice (POST /roll-dice)**

**Description**: Generates a random dice roll and applies the betting logic.

```json
{
  "bet": 100
}
```

**Response:**

```json
{
  "roll": 4,
  "result": "win",
  "payout": 200,
  "newBalance": 1100,
  "hash": "f7c3bc1d808e04732adf679965ccc34ca7ae3441"
}
```

---

## 🔐 Provably Fair Hashing (SHA-256)

The fairness of the game is ensured by using **SHA-256 hashing** to generate a deterministic but unpredictable outcome for each roll. Players can verify the fairness using the provided **hash**.

---

## 🌐 Web3 Integration (Bonus Feature)

- Uses **Ethers.js** to simulate a crypto wallet balance.
- Falls back to **localStorage** if no blockchain wallet is connected.
- Auto-updates balance based on betting outcomes.

---

## 📜 License

This project is open-source and available under the **MIT License**.

---

## 👨‍💻 Author

- **Gaurav Soni**
- **GitHub**: [Gaurav-Soni24](https://github.com/Gaurav-Soni24/)

Feel free to contribute and enhance this project! 🚀

