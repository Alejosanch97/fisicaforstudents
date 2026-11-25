import { Projectile, Race, FreeFall, Circular, Vectors } from "./motion";
import { ForceLab, Skate, Collisions, Pendulum } from "./energy";
import { Waves, Sound, Refraction, Lens, Doppler } from "./waves";
import { Thermo, Heat, Particles, Density, Gas, Units } from "./matter";
import { Charges, Circuit, Induction, Photoelectric } from "./electric";

/* family → colour on the library */
export const FAMILIES = {
  motion: { name: "Motion", color: "#ff5a36" },
  forces: { name: "Forces & Energy", color: "#9b7bff" },
  waves: { name: "Waves, Sound & Light", color: "#3557ff" },
  matter: { name: "Matter & Heat", color: "#10a58c" },
  electric: { name: "Electricity & Modern", color: "#ffc12e" },
};

export const SIMS = [
  { id: "projectile", name: "Projectile Cannon", emoji: "🎯", fam: "motion", grades: [9, 8], C: Projectile, blurb: "Angle, speed, height and planet. Hit the target and compare trajectories." },
  { id: "mru", name: "Motion Race", emoji: "🏁", fam: "motion", grades: [6, 8, 9], C: Race, blurb: "Two cars in MRU or MRUV with live position–time and velocity–time graphs." },
  { id: "freefall", name: "Free Fall Tower", emoji: "🪂", fam: "motion", grades: [6, 8, 9], C: FreeFall, blurb: "Drop or throw up on Earth vs the Moon, Mars or Jupiter." },
  { id: "circular", name: "Circular Motion", emoji: "🎡", fam: "motion", grades: [9, 10], C: Circular, blurb: "Radius, period, v and centripetal acceleration. Cut the string!" },
  { id: "vectors", name: "Vector Playground", emoji: "🏹", fam: "motion", grades: [8, 9, 10], C: Vectors, blurb: "Drag vectors, add them head-to-tail or with the parallelogram." },
  { id: "newton", name: "Force Lab", emoji: "📦", fam: "forces", grades: [6, 7, 8, 10], C: ForceLab, blurb: "Push a box with friction. Free-body diagram and F = ma live." },
  { id: "energy", name: "Energy Skate Park", emoji: "🛹", fam: "forces", grades: [7, 8, 10], C: Skate, blurb: "Kinetic, potential and thermal energy bars on a half-pipe." },
  { id: "collisions", name: "Collision Lab", emoji: "💥", fam: "forces", grades: [10], C: Collisions, blurb: "Elastic to perfectly inelastic. Momentum before = after." },
  { id: "pendulum", name: "Pendulum & Spring", emoji: "🕰️", fam: "forces", grades: [9, 10, 11], C: Pendulum, blurb: "Simple harmonic motion, damping, energy and planets." },
  { id: "waves", name: "Wave Machine", emoji: "🌊", fam: "waves", grades: [7, 8, 9, 11], C: Waves, blurb: "Transverse, longitudinal and interference with a λ ruler." },
  { id: "sound", name: "Sound Studio", emoji: "🔊", fam: "waves", grades: [7, 9, 11], C: Sound, blurb: "REAL sound: pitch, volume, timbre and beats on an oscilloscope." },
  { id: "refraction", name: "Light Bender", emoji: "🌈", fam: "waves", grades: [8, 9, 11], C: Refraction, blurb: "Snell's law and total internal reflection between media." },
  { id: "lens", name: "Lens Bench", emoji: "🔍", fam: "waves", grades: [11], C: Lens, blurb: "Converging and diverging lenses with principal rays." },
  { id: "doppler", name: "Doppler Street", emoji: "🚑", fam: "waves", grades: [11], C: Doppler, blurb: "Moving source, squeezed wavefronts and sonic booms." },
  { id: "thermo", name: "Thermometer Trio", emoji: "🌡️", fam: "matter", grades: [6, 7, 8, 9], C: Thermo, blurb: "°C, °F and K side by side with the state of water." },
  { id: "heat", name: "Heat Transfer", emoji: "🔥", fam: "matter", grades: [6, 7, 8], C: Heat, blurb: "Conduction, convection and radiation animated." },
  { id: "particles", name: "Particle Box", emoji: "🫧", fam: "matter", grades: [7, 8, 9], C: Particles, blurb: "Kinetic theory: solid, liquid, gas and the heating curve." },
  { id: "density", name: "Float or Sink", emoji: "🛟", fam: "matter", grades: [6, 8], C: Density, blurb: "Density, Archimedes and buoyant force in different liquids." },
  { id: "gas", name: "Gas Piston", emoji: "🎈", fam: "matter", grades: [8, 9], C: Gas, blurb: "Boyle, Charles and Gay-Lussac with a live pressure gauge." },
  { id: "units", name: "Unit Staircase", emoji: "📏", fam: "matter", grades: [6, 8], C: Units, blurb: "Metric prefixes as a staircase plus imperial bridges." },
  { id: "charges", name: "Charge Playground", emoji: "⚡", fam: "electric", grades: [6, 7, 11], C: Charges, blurb: "Coulomb's law with draggable charges and field lines." },
  { id: "circuit", name: "Circuit Builder", emoji: "💡", fam: "electric", grades: [6, 7, 11], C: Circuit, blurb: "Series, parallel, Ohm's law and conductor tests." },
  { id: "induction", name: "Faraday's Coil", emoji: "🧲", fam: "electric", grades: [11], C: Induction, blurb: "Move a magnet through a coil and generate electricity." },
  { id: "photoelectric", name: "Photoelectric Lab", emoji: "☀️", fam: "electric", grades: [11], C: Photoelectric, blurb: "Photons, work function and why colour beats brightness." },
];

export const getSim = (id) => SIMS.find((s) => s.id === id);
