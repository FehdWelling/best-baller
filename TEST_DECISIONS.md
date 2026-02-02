# Décision sur le runner de tests

Le repo ne contient pas de runner de tests. Avant d’ajouter un runner, voici deux options possibles :

## Option 1 — Jest
**Avantages**
- Écosystème mature et large base d’utilisateurs TypeScript/React Native.
- Outils intégrés pour mocks, snapshots et timers.

**Inconvénients**
- Configuration parfois plus lourde (Babel/TS + React Native).
- Temps de démarrage plus long sur projets Expo.

## Option 2 — Vitest
**Avantages**
- Démarrage rapide et exécution vite en local.
- Configuration TypeScript simple si l’outillage Vite est déjà présent.

**Inconvénients**
- Intégration React Native/Expo moins standard.
- Nécessite Vite ou des réglages spécifiques pour RN.

👉 En l’absence de validation, les tests ajoutés restent runner-agnostic (fonctions TypeScript + tables de cas).
