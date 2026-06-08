import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user already set a name
    const saved = localStorage.getItem("buzzit_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  function login(name, emoji = "🎮") {
    const u = {
      uid: "local_" + Math.random().toString(36).slice(2, 10),
      displayName: name,
      emoji,
      photoURL: null,
      isLocal: true,
    };
    localStorage.setItem("buzzit_user", JSON.stringify(u));
    setUser(u);
  }

  function logout() {
    localStorage.removeItem("buzzit_user");
    setUser(null);
  }

  return { user, loading, login, logout };
}
