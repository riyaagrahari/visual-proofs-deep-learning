function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        🚀 Visual Proofs of Deep Learning
      </h1>

      <p style={{ fontSize: "1.2rem", color: "#cbd5e1" }}>
        Interactive experiments to understand neural networks.
      </p>

      <button
        style={{
          marginTop: "2rem",
          padding: "12px 24px",
          borderRadius: "10px",
          border: "none",
          background: "#3b82f6",
          color: "white",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Start Exploring
      </button>
    </div>
  );
}

export default App;