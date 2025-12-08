# 💰 Guide - Gestion des Paiements

## 🎯 Fonctionnalités

### ✅ Page Payments Complète

La page de gestion des paiements inclut :

1. **📊 Statistiques en temps réel**
   - Total des paiements
   - Nombre de paiements du mois
   - Paiements en attente

2. **📋 Liste des paiements**
   - Tableau avec tri et filtres
   - Colonnes : ID, Élève, Classe, Type, Montant, Date, Statut, Actions
   - États : Payé (vert), En attente (jaune), Annulé (rouge)

3. **🔍 Filtres**
   - Tous
   - Payés
   - En attente

4. **➕ Nouveau paiement**
   - Modal avec formulaire complet
   - Champs : Nom élève, Classe, Type, Montant, Méthode, Date
   - Types disponibles :
     - Frais de scolarité
     - Frais d'inscription
     - Frais d'examen
     - Fournitures scolaires
     - Autres

5. **👁️ Voir détails**
   - Modal avec toutes les informations
   - Affichage professionnel

6. **📄 Générer reçu PDF**
   - Téléchargement automatique
   - Design professionnel
   - Informations complètes

---

## 📄 Générateur de Reçu PDF

### Caractéristiques du PDF

Le reçu généré contient :

#### En-tête
- Logo et nom de l'école (fond bleu)
- Titre "REÇU DE PAIEMENT"
- Numéro de reçu unique
- Date d'émission

#### Informations de l'élève
- Nom complet
- Classe

#### Détails du paiement
- Type de paiement
- Méthode de paiement
- Montant (en gros et en couleur)
- Statut (Validé avec ✓)

#### Pied de page
- Mentions légales
- Date de génération
- Cachet/Signature

### Utilisation du Générateur

```javascript
import { generateReceiptPDF } from '@/utils/receiptGenerator';

// Générer et télécharger un reçu
const payment = {
  id: 123,
  studentName: 'Amadou Diallo',
  class: 'Terminale S',
  amount: 25000,
  date: '2024-12-05',
  type: 'Frais de scolarité',
  method: 'Espèces',
  status: 'Payé'
};

generateReceiptPDF(payment);
// → Télécharge: recu_Amadou_Diallo_123.pdf
```

---

## 🎨 Styles Tailwind Utilisés

### Cartes Statistiques
```jsx
<div className="bg-white rounded-lg shadow-md p-6">
  <div className="flex items-center justify-between">
    {/* Contenu */}
  </div>
</div>
```

### Badges de Statut
```jsx
// Payé
<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
  Payé
</span>

// En attente
<span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
  En attente
</span>

// Annulé
<span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
  Annulé
</span>
```

### Table Responsive
```jsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-50 border-b">
      {/* En-têtes */}
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {/* Lignes avec hover:bg-gray-50 */}
    </tbody>
  </table>
</div>
```

### Formulaire Modal
```jsx
<form onSubmit={handleSubmit}>
  <Input label="Nom de l'élève" name="studentName" required />

  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
    <option>Option 1</option>
  </select>

  <div className="flex justify-end space-x-3 mt-6">
    <Button variant="secondary">Annuler</Button>
    <Button variant="primary" type="submit">Enregistrer</Button>
  </div>
</form>
```

---

## 🧪 Tester la Fonctionnalité

### 1. Accéder à la page
```
http://localhost:5174/payments
```

### 2. Créer un paiement
1. Cliquez sur "Nouveau paiement"
2. Remplissez le formulaire :
   - Nom : "Amadou Diallo"
   - Classe : "Terminale S"
   - Type : "Frais de scolarité"
   - Montant : 25000
   - Méthode : "Espèces"
   - Date : Aujourd'hui
3. Cliquez "Enregistrer"

### 3. Générer un reçu
1. Trouvez un paiement avec statut "Payé"
2. Cliquez sur l'icône 📥 (Download)
3. Le PDF se télécharge automatiquement

### 4. Voir les détails
1. Cliquez sur l'icône 👁️ (Eye)
2. Un modal s'ouvre avec tous les détails
3. Bouton "Télécharger le reçu" également disponible

### 5. Filtrer
- Cliquez sur "Tous", "Payés", ou "En attente"
- La liste se met à jour automatiquement

---

## 🔧 API Endpoints (Mode DEV)

En mode développement, les données sont stockées localement. Pour connecter à une vraie API :

```javascript
// Dans paymentsService.js, changez DEV_MODE à false

const DEV_MODE = false; // Utiliser la vraie API

// Endpoints attendus par le service :
GET    /payments              → Liste tous les paiements
GET    /payments/:id          → Détails d'un paiement
POST   /payments              → Créer un paiement
GET    /payments/student/:id  → Paiements d'un élève
GET    /payments/:id/receipt  → Générer reçu (blob)
PUT    /payments/:id/confirm  → Confirmer un paiement
```

---

## 🎨 Personnalisation du PDF

### Modifier les couleurs

Éditez [src/utils/receiptGenerator.js](src/utils/receiptGenerator.js) :

```javascript
// Ligne 15-17
const primaryColor = [14, 165, 233]; // Bleu primary-600
const grayColor = [107, 114, 128];   // Gris
const darkColor = [17, 24, 39];      // Noir
```

### Ajouter un logo

```javascript
// Après la ligne 25
const imgData = 'data:image/png;base64,...'; // Votre logo en base64
doc.addImage(imgData, 'PNG', 20, 10, 30, 30);
```

### Changer la police

```javascript
// jsPDF supporte : helvetica, times, courier
doc.setFont('times', 'bold');
```

---

## 📦 Dépendances

```json
{
  "jspdf": "^2.5.2"
}
```

### Installation
```bash
npm install jspdf
```

---

## 🚀 Prochaines Améliorations

- [ ] Envoi automatique par email
- [ ] QR Code sur le reçu
- [ ] Graphique des paiements mensuels
- [ ] Export Excel de l'historique
- [ ] Rappels automatiques pour paiements en attente
- [ ] Calcul automatique des pénalités de retard

---

**Tout est prêt à l'emploi! 🎉**
