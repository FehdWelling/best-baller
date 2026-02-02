# BestBaller

Application mobile pour progresser au basket (tir, passe, dribble) avec des exercices locaux et un suivi de sessions en mémoire.

## Démarrage rapide (Expo Router)

```bash
yarn
```

```bash
yarn ios
```

Ou, au choix :

```bash
yarn start
```

## Structure

- `app/` : routes Expo Router (navigation par fichiers).
- `src/` : logique agnostique (hooks, modèles, services, composants UI, utils).

## Notes

- Les sessions sont stockées en mémoire (aucune persistance).
- Les statistiques sont calculées localement.
