# 🔐 Identifiants de Connexion - Mode Développement

## Comptes de Test Disponibles

### 👨‍💼 Administrateur Principal
- **Email:** `admin@ecole.com`
- **Mot de passe:** `admin123`
- **Rôle:** Administrateur

### 👔 Directeur Pédagogique
- **Email:** `directeur@ecole.com`
- **Mot de passe:** `directeur123`
- **Rôle:** Directeur

### 📋 Secrétaire
- **Email:** `secretaire@ecole.com`
- **Mot de passe:** `secret123`
- **Rôle:** Secrétaire

---

## 📝 Notes

- Ces identifiants fonctionnent **uniquement en mode développement** (DEV_MODE = true)
- Les données sont stockées en mémoire et seront réinitialisées à chaque rechargement de l'application
- Pour utiliser une vraie API backend, modifiez `DEV_MODE = false` dans les fichiers services

## 🎓 Données Fictives Disponibles

### Élèves (5 élèves pré-chargés)
- Amadou Diallo (Terminale S)
- Fatou Sow (1ère L)
- Moussa Kane (2nde A)
- Marie Ndiaye (Terminale L)
- Ibrahima Ba (1ère S)

### Enseignants (5 enseignants pré-chargés)
- Dr. Pierre Ndiaye (Mathématiques)
- Mme. Awa Diop (Physique-Chimie)
- M. Jean Sarr (Français)
- Mme. Aminata Fall (Anglais)
- Dr. Ousmane Gueye (Histoire-Géographie)

## 🚀 Démarrage Rapide

1. Ouvrez votre navigateur à l'adresse: `http://localhost:5174`
2. Utilisez l'un des comptes ci-dessus pour vous connecter
3. Explorez toutes les fonctionnalités!

## 🔧 Configuration

Pour désactiver le mode développement et utiliser une vraie API:

1. Ouvrez les fichiers dans `src/services/`
2. Changez `const DEV_MODE = true;` en `const DEV_MODE = false;`
3. Configurez votre URL d'API dans le fichier `.env`

```env
VITE_API_URL=http://votre-api.com/api
```
