import kalista from "./kalista.jpg";

const PROFILE = {
  name: "clark",
  handle: "@clark_jkkj",
  avatar: kalista,
};

const ALL_LINKS = [
  {
    title: "GitHub",
    url: "https://github.com/lucasweidmann",
    icon: "/icons/kali1.png",
  },
  {
    title: "YouTube",
    url: "https://youtube.com/@clark_jkkj",
    icon: "/icons/kali2.png",
  },
  {
    title: "Twitch",
    url: "https://twitch.tv/clark_jkkj",
    icon: "/icons/kali3.png",
  },
  {
    title: "Speedrun",
    url: "https://www.speedrun.com/users/clark_jkkj",
    icon: "/icons/kali4.png",
  },
];

export default function App() {
  const links = ALL_LINKS;

  return (
    <div style={styles.page}>
      <div style={styles.glow} />

      <main style={styles.card}>
        <header style={styles.header}>
          <div style={styles.avatarWrap}>
            <img src={PROFILE.avatar} style={styles.avatar} />
          </div>

          <h1 style={styles.name}>{PROFILE.name}</h1>
          <div style={styles.handle}>{PROFILE.handle}</div>
          <p style={styles.bio}>{PROFILE.bio}</p>
        </header>

        <section style={styles.links}>
          {links.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              style={styles.linkBtn}
            >
              <div style={styles.linkLeft}>
                <div style={styles.linkTitle}>{item.title}</div>
                <div style={styles.linkUrl}>{item.url}</div>
              </div>

              <img src={item.icon} style={styles.icon} />
            </a>
          ))}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(1200px 600px at 20% 10%, rgba(124,58,237,.25), transparent 60%)," +
      "radial-gradient(900px 500px at 80% 30%, rgba(59,130,246,.20), transparent 55%)," +
      "linear-gradient(180deg, #070912 0%, #04050a 100%)",
    color: "white",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  },

  glow: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(500px 260px at 50% 0%, rgba(255,255,255,.09), transparent 60%)",
  },

  card: {
    width: "min(520px, 92vw)",
    borderRadius: 22,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
    backdropFilter: "blur(10px)",
    padding: 18,
  },

  header: {
    textAlign: "center",
    padding: "4px 10px 6px",
  },

  avatarWrap: {
    width: 96,
    height: 96,
    margin: "0 auto",
    borderRadius: 999,
    padding: 3,
    background: "rgba(255,255,255,0.12)",
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    objectFit: "cover",
  },

  name: {
    margin: "12px 0 0",
    fontSize: 24,
    fontWeight: 800,
  },

  handle: {
    marginTop: 4,
    opacity: 0.75,
    fontSize: 14,
  },

  bio: {
    margin: "10px auto 0",
    maxWidth: 420,
    opacity: 0.9,
    fontSize: 14,
  },

  links: {
    display: "grid",
    gap: 10,
    marginTop: 14,
  },

  linkBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    textDecoration: "none",
    color: "white",
    padding: 14,
    borderRadius: 16,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  linkLeft: { minWidth: 0 },

  linkTitle: {
    fontWeight: 700,
    fontSize: 16,
  },

  linkUrl: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.7,
  },

  icon: {
    width: 26,
    height: 26,
    objectFit: "contain",
  },
};