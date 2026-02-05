# BestBaller

Application mobile pour progresser au basket (tir, passe, dribble) avec des exercices locaux et un suivi de sessions en mémoire.

## Démarrage rapide (Expo Router)

### Configuration des variables d’environnement (Supabase)

Copiez le fichier d’exemple et renseignez vos clés Supabase :

```bash
cp .env.example .env
```

Variables attendues :

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Redémarrez Metro après modification des variables d’environnement.

```bash
yarn
```

```bash
npx expo start
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

## Sync cloud sessions

- Les sessions restent persistées localement (offline-first).
- Si un utilisateur est connecté, les sessions sont synchronisées avec Supabase (`public.sessions`) en arrière-plan.

## Notes

- Les statistiques sont calculées localement.
