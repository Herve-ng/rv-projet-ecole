# École Manager - Système de Gestion Scolaire

Application web moderne de gestion d'école construite avec React, Vite et Tailwind CSS.

## Fonctionnalités

- **Authentification** - Système de connexion sécurisé
- **Dashboard** - Vue d'ensemble avec statistiques et activités récentes
- **Gestion des Élèves** - CRUD complet pour gérer les élèves
- **Gestion des Enseignants** - CRUD complet pour gérer les enseignants
- **Gestion des Classes** - Création et gestion des classes
- **Gestion des Paiements** - Suivi des paiements et génération de reçus
- **Historique des Paiements** - Visualisation de l'historique complet

## Technologies Utilisées

- **React 18** - Bibliothèque UI
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Navigation et routing
- **Zustand** - Gestion d'état global
- **Axios** - Client HTTP pour les appels API
- **Lucide React** - Icônes modernes

## docker-compose

```
services:
  frontend:
    image: ghcr.io/herve-ng/rv-projet-ecole:latest  # ton image GHCR
    container_name: frontend_app
    ports:
      - "3003:3000"
```


## Structure du Projet

```
ecole/
├── public/               # Fichiers statiques
├── src/
│   ├── components/       # Composants réutilisables
│   │   ├── common/       # Composants UI (Button, Input, Modal, Card)
│   │   └── layout/       # Composants de mise en page (Sidebar, Header, Layout)
│   ├── pages/            # Pages de l'application
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Students.jsx
│   │   ├── Teachers.jsx
│   │   ├── Classes.jsx
│   │   └── Payments.jsx
│   ├── services/         # Services API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── studentsService.js
│   │   ├── teachersService.js
│   │   └── paymentsService.js
│   ├── store/            # État global Zustand
│   │   ├── authStore.js
│   │   ├── studentsStore.js
│   │   └── teachersStore.js
│   ├── App.jsx           # Composant racine avec routing
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── .env.example          # Variables d'environnement exemple
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Installation

1. **Cloner le projet**
```bash
cd ecole
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```
Modifier `.env` avec vos configurations API

4. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Scripts Disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run preview` - Prévisualiser le build de production

## Configuration Backend

Cette application frontend nécessite un backend API. Assurez-vous que votre API backend :

- Est accessible à l'URL définie dans `VITE_API_URL`
- Fournit les endpoints suivants :
  - `POST /api/auth/login` - Connexion
  - `GET/POST/PUT/DELETE /api/students` - CRUD élèves
  - `GET/POST/PUT/DELETE /api/teachers` - CRUD enseignants
  - `GET/POST /api/payments` - Gestion des paiements
  - Et autres endpoints définis dans les services

## Composants Réutilisables

### Button
```jsx
import Button from '@/components/common/Button';

<Button variant="primary" icon={Plus} onClick={handleClick}>
  Ajouter
</Button>
```

### Input
```jsx
import Input from '@/components/common/Input';

<Input
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  icon={Mail}
  required
/>
```

### Modal
```jsx
import Modal from '@/components/common/Modal';

<Modal isOpen={isOpen} onClose={handleClose} title="Titre" size="md">
  {/* Contenu */}
</Modal>
```

### Card
```jsx
import Card from '@/components/common/Card';

<Card title="Titre" icon={Icon} action={<Button>Action</Button>}>
  {/* Contenu */}
</Card>
```

## Gestion d'État avec Zustand

Exemple d'utilisation du store :

```jsx
import { useAuthStore } from '@/store/authStore';

const Component = () => {
  const { user, login, logout } = useAuthStore();
  // ...
};
```

## Appels API avec Axios

Les services API sont pré-configurés avec intercepteurs pour :
- Ajouter automatiquement le token d'authentification
- Gérer les erreurs 401 (redirection vers login)

```jsx
import { studentsService } from '@/services/studentsService';

const students = await studentsService.getAllStudents();
```

## Personnalisation du Design

Les couleurs principales peuvent être modifiées dans `tailwind.config.js` :

```js
colors: {
  primary: {
    // Personnalisez vos couleurs
  }
}
```

## Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT.

## Support

Pour toute question ou assistance, veuillez ouvrir une issue sur le repository.
