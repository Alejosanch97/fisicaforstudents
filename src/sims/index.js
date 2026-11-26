import { T } from "../i18n";
import { Projectile, Race, FreeFall, Circular, Vectors } from "./motion";
import { ForceLab, Skate, Collisions, Pendulum } from "./energy";
import { Waves, Sound, Refraction, Lens, Doppler } from "./waves";
import { Thermo, Heat, Particles, Density, Gas, Units } from "./matter";
import { Charges, Circuit, Induction, Photoelectric } from "./electric";

/* family → colour on the library */
export const FAMILIES = {
  motion: {
    name: T("Motion"),
    color: "#ff5a36"
  },
  forces: {
    name: T("Forces & Energy"),
    color: "#9b7bff"
  },
  waves: {
    name: T("Waves, Sound & Light"),
    color: "#3557ff"
  },
  matter: {
    name: T("Matter & Heat"),
    color: "#10a58c"
  },
  electric: {
    name: T("Electricity & Modern"),
    color: "#ffc12e"
  }
};
export const SIMS = [{
  id: "projectile",
  name: T("Projectile Cannon"),
  emoji: "🎯",
  fam: "motion",
  grades: [9, 8],
  C: Projectile,
  blurb: T("Angle, speed, height and planet. Hit the target and compare trajectories.")
}, {
  id: "mru",
  name: T("Motion Race"),
  emoji: "🏁",
  fam: "motion",
  grades: [6, 8, 9],
  C: Race,
  blurb: T("Two cars in MRU or MRUV with live position–time and velocity–time graphs.")
}, {
  id: "freefall",
  name: T("Free Fall Tower"),
  emoji: "🪂",
  fam: "motion",
  grades: [6, 8, 9],
  C: FreeFall,
  blurb: T("Drop or throw up on Earth vs the Moon, Mars or Jupiter.")
}, {
  id: "circular",
  name: T("Circular Motion"),
  emoji: "🎡",
  fam: "motion",
  grades: [9, 10],
  C: Circular,
  blurb: T("Radius, period, v and centripetal acceleration. Cut the string!")
}, {
  id: "vectors",
  name: T("Vector Playground"),
  emoji: "🏹",
  fam: "motion",
  grades: [8, 9, 10],
  C: Vectors,
  blurb: T("Drag vectors, add them head-to-tail or with the parallelogram.")
}, {
  id: "newton",
  name: T("Force Lab"),
  emoji: "📦",
  fam: "forces",
  grades: [6, 7, 8, 10],
  C: ForceLab,
  blurb: T("Push a box with friction. Free-body diagram and F = ma live.")
}, {
  id: "energy",
  name: T("Energy Skate Park"),
  emoji: "🛹",
  fam: "forces",
  grades: [7, 8, 10],
  C: Skate,
  blurb: T("Kinetic, potential and thermal energy bars on a half-pipe.")
}, {
  id: "collisions",
  name: T("Collision Lab"),
  emoji: "💥",
  fam: "forces",
  grades: [10],
  C: Collisions,
  blurb: T("Elastic to perfectly inelastic. Momentum before = after.")
}, {
  id: "pendulum",
  name: T("Pendulum & Spring"),
  emoji: "🕰️",
  fam: "forces",
  grades: [9, 10, 11],
  C: Pendulum,
  blurb: T("Simple harmonic motion, damping, energy and planets.")
}, {
  id: "waves",
  name: T("Wave Machine"),
  emoji: "🌊",
  fam: "waves",
  grades: [7, 8, 9, 11],
  C: Waves,
  blurb: T("Transverse, longitudinal and interference with a λ ruler.")
}, {
  id: "sound",
  name: T("Sound Studio"),
  emoji: "🔊",
  fam: "waves",
  grades: [7, 9, 11],
  C: Sound,
  blurb: T("REAL sound: pitch, volume, timbre and beats on an oscilloscope.")
}, {
  id: "refraction",
  name: T("Light Bender"),
  emoji: "🌈",
  fam: "waves",
  grades: [8, 9, 11],
  C: Refraction,
  blurb: T("Snell's law and total internal reflection between media.")
}, {
  id: "lens",
  name: T("Lens Bench"),
  emoji: "🔍",
  fam: "waves",
  grades: [11],
  C: Lens,
  blurb: T("Converging and diverging lenses with principal rays.")
}, {
  id: "doppler",
  name: T("Doppler Street"),
  emoji: "🚑",
  fam: "waves",
  grades: [11],
  C: Doppler,
  blurb: T("Moving source, squeezed wavefronts and sonic booms.")
}, {
  id: "thermo",
  name: T("Thermometer Trio"),
  emoji: "🌡️",
  fam: "matter",
  grades: [6, 7, 8, 9],
  C: Thermo,
  blurb: T("°C, °F and K side by side with the state of water.")
}, {
  id: "heat",
  name: T("Heat Transfer"),
  emoji: "🔥",
  fam: "matter",
  grades: [6, 7, 8],
  C: Heat,
  blurb: T("Conduction, convection and radiation animated.")
}, {
  id: "particles",
  name: T("Particle Box"),
  emoji: "🫧",
  fam: "matter",
  grades: [7, 8, 9],
  C: Particles,
  blurb: T("Kinetic theory: solid, liquid, gas and the heating curve.")
}, {
  id: "density",
  name: T("Float or Sink"),
  emoji: "🛟",
  fam: "matter",
  grades: [6, 8],
  C: Density,
  blurb: T("Density, Archimedes and buoyant force in different liquids.")
}, {
  id: "gas",
  name: T("Gas Piston"),
  emoji: "🎈",
  fam: "matter",
  grades: [8, 9],
  C: Gas,
  blurb: T("Boyle, Charles and Gay-Lussac with a live pressure gauge.")
}, {
  id: "units",
  name: T("Unit Staircase"),
  emoji: "📏",
  fam: "matter",
  grades: [6, 8],
  C: Units,
  blurb: T("Metric prefixes as a staircase plus imperial bridges.")
}, {
  id: "charges",
  name: T("Charge Playground"),
  emoji: "⚡",
  fam: "electric",
  grades: [6, 7, 11],
  C: Charges,
  blurb: T("Coulomb's law with draggable charges and field lines.")
}, {
  id: "circuit",
  name: T("Circuit Builder"),
  emoji: "💡",
  fam: "electric",
  grades: [6, 7, 11],
  C: Circuit,
  blurb: T("Series, parallel, Ohm's law and conductor tests.")
}, {
  id: "induction",
  name: T("Faraday's Coil"),
  emoji: "🧲",
  fam: "electric",
  grades: [11],
  C: Induction,
  blurb: T("Move a magnet through a coil and generate electricity.")
}, {
  id: "photoelectric",
  name: T("Photoelectric Lab"),
  emoji: "☀️",
  fam: "electric",
  grades: [11],
  C: Photoelectric,
  blurb: T("Photons, work function and why colour beats brightness.")
}];
export const getSim = id => SIMS.find(s => s.id === id);