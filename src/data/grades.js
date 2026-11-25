/* Cada grado es un "mundo" con su color, nivel de inglés y personalidad */
export const GRADES = [
  { g: 6, name: "Explorers", cefr: "A2", color: "#ffc12e", ink: "#17183b", emoji: "🧭", tag: "Measure it. Feel it. Explore it.", desc: "Units, heat, first motion and the magic of electric charges." },
  { g: 7, name: "Energizers", cefr: "A2+", color: "#10a58c", ink: "#ffffff", emoji: "⚡", tag: "Everything runs on energy.", desc: "Particles, energy forms, heat, sound and electricity." },
  { g: 8, name: "Engineers", cefr: "B1", color: "#3557ff", ink: "#ffffff", emoji: "🛠️", tag: "Vectors, waves, fluids, engines.", desc: "Kinematics with vectors, Newton, waves, fluids and thermodynamics." },
  { g: 9, name: "Launchers", cefr: "B1+", color: "#ff5a36", ink: "#ffffff", emoji: "🚀", tag: "Launch it. Spin it. Hear it.", desc: "Motion graphs, projectiles, circular motion, waves, sound and gases." },
  { g: 10, name: "Colliders", cefr: "B2", color: "#9b7bff", ink: "#ffffff", emoji: "💥", tag: "Forces, momentum and crashes.", desc: "Reference frames, Newton's laws, momentum, energy and collisions." },
  { g: 11, name: "Quantum Crew", cefr: "B2", color: "#ff6fae", ink: "#17183b", emoji: "🌌", tag: "From pendulums to photons.", desc: "Oscillations, acoustics, optics, electromagnetism and modern physics." },
];

export const gradeMeta = (g) => GRADES.find((x) => x.g === Number(g)) || GRADES[0];

export const PERIOD_LABEL = { 1: "Term 1", 2: "Term 2", 3: "Term 3", 4: "Term 4" };
