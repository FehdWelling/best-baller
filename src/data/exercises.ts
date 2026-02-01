import { Exercise } from '../models/types';

export const exercises: Exercise[] = [
  {
    id: 'tir-sortie-dribble',
    name: 'Tir en sortie de dribble',
    description:
      'Départ en dribble, une ou deux accélérations, arrêt contrôlé puis tir. Alterne axe, 45° et 0°.',
    objective: 'Améliorer la coordination tir après dribble et le contrôle du stop.',
    fundamental: 'tir',
    type: 'reps',
    recommended: {
      repsOptions: [10, 20, 50],
      restRecommendedSec: 45,
    },
    coachingPoints: [
      'Garde les épaules carrées au panier.',
      'Arrêt sur deux appuis équilibré.',
    ],
    exampleSession: '2 séries de 20 tirs, alternance axe/45°/0°.',
  },
  {
    id: 'tir-arrete-axe',
    name: 'Tir arrêté axe mi-distance',
    description: 'Tir sur place face au panier, mi-distance, sans dribble.',
    objective: 'Stabilité du geste et précision axe panier.',
    fundamental: 'tir',
    type: 'reps',
    recommended: {
      repsOptions: [10, 20, 50],
      restRecommendedSec: 30,
    },
  },
  {
    id: 'tir-arrete-45',
    name: 'Tir arrêté 45° mi-distance',
    description: 'Tir sur place depuis l’aile à 45°, mi-distance.',
    objective: 'Alignement épaules/hanche et fluidité du tir.',
    fundamental: 'tir',
    type: 'reps',
    recommended: {
      repsOptions: [10, 20, 50],
      restRecommendedSec: 30,
    },
  },
  {
    id: 'tir-arrete-0',
    name: 'Tir arrêté 0° mi-distance',
    description: 'Tir sur place depuis la ligne de fond (0°), mi-distance.',
    objective: 'Gestion de l’angle difficile et vitesse de déclenchement.',
    fundamental: 'tir',
    type: 'reps',
    recommended: {
      repsOptions: [10, 20, 50],
      restRecommendedSec: 30,
    },
  },
  {
    id: 'passe-mur-alternee',
    name: 'Passe murale alternée',
    description: 'Enchaîne passes poitrine et passes à terre contre un mur.',
    objective: 'Précision et rythme des passes.',
    fundamental: 'passe',
    type: 'timer',
    recommended: {
      durationOptionsSec: [60],
      restRecommendedSec: 30,
      readyCountdownSec: 3,
    },
  },
  {
    id: 'passe-mur-droit-apres-dribble',
    name: 'Passe murale main droite après dribble',
    description:
      'Dribble main droite puis passe contre un mur. Compte les passes réussies.',
    objective: 'Coordination dribble/passe et vitesse d’exécution.',
    fundamental: 'passe',
    type: 'timer',
    recommended: {
      durationOptionsSec: [30, 60],
      restRecommendedSec: 30,
      readyCountdownSec: 3,
    },
  },
  {
    id: 'passe-mur-gauche-apres-dribble',
    name: 'Passe murale main gauche après dribble',
    description:
      'Dribble main gauche puis passe contre un mur. Compte les passes réussies.',
    objective: 'Coordination main faible et précision des passes.',
    fundamental: 'passe',
    type: 'timer',
    recommended: {
      durationOptionsSec: [30, 60],
      restRecommendedSec: 30,
      readyCountdownSec: 3,
    },
  },
  {
    id: 'dribble-bas-alterne',
    name: 'Dribble bas alterné',
    description: 'Dribble bas en alternance main droite/main gauche.',
    objective: 'Contrôle du ballon et rythme bas.',
    fundamental: 'dribble',
    type: 'timer',
    recommended: {
      durationOptionsSec: [45],
      restRecommendedSec: 30,
      readyCountdownSec: 3,
    },
  },
  {
    id: 'dribble-place-droit',
    name: 'Dribbler sur place main droite (bas/moyen/haut)',
    description:
      'Dribble sur place main droite en variant la hauteur. Compte les dribbles.',
    objective: 'Sensibilité et endurance du dribble main forte.',
    fundamental: 'dribble',
    type: 'timer',
    recommended: {
      durationOptionsSec: [30, 60],
      restRecommendedSec: 30,
      readyCountdownSec: 3,
    },
  },
  {
    id: 'dribble-place-gauche',
    name: 'Dribbler sur place main gauche (bas/moyen/haut)',
    description:
      'Dribble sur place main gauche en variant la hauteur. Compte les dribbles.',
    objective: 'Confiance et contrôle main faible.',
    fundamental: 'dribble',
    type: 'timer',
    recommended: {
      durationOptionsSec: [30, 60],
      restRecommendedSec: 30,
      readyCountdownSec: 3,
    },
  },
];
