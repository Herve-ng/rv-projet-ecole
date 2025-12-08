# Guide d'utilisation - Système de Gestion des Paiements Partiels

## 📋 Vue d'ensemble

Ce système permet de gérer les paiements partiels (avances) des élèves et de suivre automatiquement leur progression jusqu'au paiement complet.

## 🎯 Objectif

Permettre aux élèves de payer en plusieurs fois et suivre automatiquement :
- Le montant total à payer
- Le montant déjà payé (avances cumulées)
- Le montant restant
- L'historique complet des paiements
- La transition automatique vers "Payé" quand le montant total est atteint

## 📁 Architecture

### Fichiers créés

1. **Store Zustand** : `src/store/feesStore.js`
   - Gestion centralisée des frais scolaires
   - Stockage persistant des données
   - Logique de transition automatique

2. **Composant principal** : `src/components/payments/PendingPayments.jsx`
   - Interface de gestion des paiements en attente
   - Filtres par classe et recherche
   - Modals de paiement et détails

3. **Hook d'initialisation** : `src/hooks/useInitializeData.js`
   - Chargement automatique des données au démarrage
   - Initialisation des frais scolaires mockés

4. **Données de test** : `src/data/mockFees.js`
   - 7 frais scolaires fictifs pour tester le système
   - Différents niveaux d'avancement (20%, 50%, 70%, 90%, 100%)

## 🚀 Utilisation

### 1. Accéder à la section "En attente"

```
Page Paiements → Onglet "En attente (Avances)"
```

### 2. Consulter les paiements en attente

L'interface affiche :
- **Statistiques globales** :
  - Nombre de paiements en attente
  - Total déjà perçu
  - Montant restant total

- **Liste des élèves** avec :
  - Nom et prénom
  - Classe
  - Type de frais
  - Montant total à payer
  - Montant déjà payé (en vert)
  - Montant restant (en rouge)
  - Date du dernier paiement

### 3. Ajouter un paiement partiel

1. Cliquez sur **"Compléter"** sur la ligne de l'élève
2. Le modal affiche un résumé :
   - Montant total
   - Déjà payé
   - Reste à payer
3. Remplissez le formulaire :
   - **Montant** du paiement
   - **Méthode** (Espèces, Virement, Mobile Money, Chèque)
   - **Date** du paiement
4. Cliquez sur **"Enregistrer le paiement"**

### 4. Transition automatique vers "Payé"

Lorsque le total des paiements atteint ou dépasse le montant dû :
- ✅ Une alerte confirme le paiement complet
- 🔄 Le statut passe automatiquement à "Payé"
- 📤 La fiche disparaît de "En attente"
- ✨ Elle apparaît dans la section "Payés (Complets)"

### 5. Consulter l'historique

1. Cliquez sur **"Détails"** sur la ligne de l'élève
2. Le modal affiche :
   - **Informations générales** (élève, classe, type, statut)
   - **Résumé financier** (total, payé, restant)
   - **Historique complet** de tous les paiements avec :
     - Montant de chaque paiement
     - Méthode utilisée
     - Date du paiement
     - Numéro de l'acompte

## 🔍 Fonctionnalités de recherche et filtrage

### Filtre par classe

1. Cliquez sur le sélecteur de classe
2. Choisissez une classe spécifique
3. Seuls les élèves de cette classe sont affichés

### Recherche par nom

1. Tapez le nom de l'élève dans la barre de recherche
2. La liste se filtre en temps réel

### Tri

Utilisez le sélecteur de tri pour organiser par :
- **Montant restant** (défaut) : Les plus grandes dettes en premier
- **Date** : Les paiements les plus récents en premier
- **Nom** : Ordre alphabétique

### Vue groupée ou liste

Basculez entre :
- 🔲 **Vue groupée** : Paiements organisés par classe avec accordéons
- 📋 **Vue liste** : Tous les paiements dans une liste continue

## 💡 Cas d'usage

### Cas 1 : Inscription avec avance

**Situation** : Un élève paie 20 000 FCFA sur 50 000 FCFA de frais de scolarité

**Actions** :
1. Le système enregistre le frais avec statut "En attente"
2. La fiche apparaît dans l'onglet "En attente"
3. Affichage : Total 50 000 / Payé 20 000 / Reste 30 000

### Cas 2 : Paiements multiples

**Situation** : L'élève revient payer 15 000 FCFA, puis 15 000 FCFA

**Actions** :
1. Ajout du 2e paiement : Total 50 000 / Payé 35 000 / Reste 15 000
2. Ajout du 3e paiement : Total 50 000 / Payé 50 000 / Reste 0
3. ✅ **Transition automatique vers "Payé"**
4. Alerte de confirmation
5. La fiche disparaît de "En attente"

### Cas 3 : Paiement excédentaire

**Situation** : Il reste 5 000 FCFA mais l'élève paie 10 000 FCFA

**Actions** :
1. Le système affiche une alerte de confirmation
2. Si vous confirmez, le paiement est enregistré avec le surplus
3. Transition automatique vers "Payé"

## 🔧 Données de test disponibles

### Élèves avec paiements en attente :

1. **Jean Dupont** (Terminale A)
   - Frais de scolarité : 50 000 FCFA
   - Déjà payé : 20 000 FCFA (40%)
   - Reste : 30 000 FCFA

2. **Marie Martin** (Terminale A)
   - Frais de scolarité : 50 000 FCFA
   - Déjà payé : 35 000 FCFA (70%)
   - Reste : 15 000 FCFA

3. **Amadou Diallo** (1ère S)
   - Frais d'examen : 30 000 FCFA
   - Déjà payé : 15 000 FCFA (50%)
   - Reste : 15 000 FCFA
   - Frais de scolarité : 50 000 FCFA
   - Déjà payé : 45 000 FCFA (90%)
   - Reste : 5 000 FCFA

4. **Fatou Sow** (1ère S)
   - Frais de scolarité : 50 000 FCFA
   - Déjà payé : 10 000 FCFA (20%)
   - Reste : 40 000 FCFA

### Élèves avec paiements complets :

5. **Pierre Dubois** (Terminale A)
   - Frais de scolarité : 50 000 FCFA
   - Statut : ✅ Payé

## ⚙️ Configuration technique

### Structure des données

```javascript
{
  id: 1,
  studentId: 1, // ID de l'élève
  type: 'Frais de scolarité',
  totalAmount: 50000, // Montant total à payer
  totalPaid: 20000, // Montant déjà payé
  status: 'En attente', // 'En attente' | 'Payé' | 'Non payé'
  lastPaymentDate: '2024-11-15',
  payments: [ // Historique des paiements
    {
      id: 1,
      amount: 10000,
      method: 'Espèces',
      date: '2024-10-01',
      timestamp: '2024-10-01T10:00:00Z'
    }
  ]
}
```

### Logique de transition

La transition automatique se fait dans `feesStore.js` :

```javascript
addPaymentToFee: (studentId, feeType, payment) => {
  const newTotalPaid = (fee.totalPaid || 0) + payment.amount;
  const newStatus = newTotalPaid >= fee.totalAmount ? 'Payé' : 'En attente';
  // Mise à jour automatique du statut
}
```

## 📊 Statistiques affichées

- **En attente de paiement** : Nombre total de frais avec paiements partiels
- **Total déjà perçu** : Somme de tous les paiements effectués
- **Montant restant total** : Somme de tous les montants restants

## ✨ Avantages du système

1. ✅ **Suivi en temps réel** des paiements partiels
2. ✅ **Transition automatique** vers "Payé"
3. ✅ **Historique complet** de tous les paiements
4. ✅ **Filtrage puissant** par classe et nom
5. ✅ **Organisation claire** avec vues multiples
6. ✅ **Alertes intelligentes** pour les paiements complets ou excédentaires
7. ✅ **Persistance des données** avec Zustand
8. ✅ **Interface intuitive** et responsive

## 🔐 Sécurité

- Validation des montants (ne peut pas être négatif ou zéro)
- Confirmation pour les paiements excédentaires
- Sauvegarde automatique après chaque action
- Données persistantes même après rechargement de la page

## 📝 Notes importantes

- Les données de test sont automatiquement chargées au premier accès
- Les paiements sont enregistrés localement (localStorage via Zustand persist)
- Pour une version production, remplacez les mock data par des appels API réels
- Le système peut gérer plusieurs types de frais par élève (scolarité, examen, fournitures, etc.)

## 🚀 Prochaines étapes possibles

- Génération de reçus PDF pour les paiements partiels
- Notifications automatiques quand un paiement est proche de la complétion
- Rapports mensuels des encaissements par classe
- Export Excel des paiements en attente
- Rappels automatiques pour les paiements en retard
- Calcul automatique des pénalités de retard

---

**Version** : 1.0
**Date** : Décembre 2024
**Auteur** : Système de Gestion Scolaire
