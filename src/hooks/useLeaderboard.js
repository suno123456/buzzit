import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export function useLeaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("bestScore", "desc"), limit(10));
    return onSnapshot(q, (snap) => {
      setPlayers(snap.docs.map((d, i) => ({ rank: i + 1, ...d.data() })));
    });
  }, []);

  async function saveScore(uid, score) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    const current = snap.exists() ? (snap.data().bestScore || 0) : 0;
    await updateDoc(ref, {
      gamesPlayed: increment(1),
      ...(score > current ? { bestScore: score } : {}),
    });
  }

  return { players, saveScore };
}
