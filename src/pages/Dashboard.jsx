import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import { Users, GraduationCap, BookOpen, CreditCard, TrendingUp, TrendingDown, School } from 'lucide-react';
import { useStudentsStore } from '@/store/studentsStore';
import { useUniqueClasses } from '@/store/filtersStore';

const Dashboard = () => {
  const { students } = useStudentsStore();
  const classes = useUniqueClasses(students, (s) => s.class);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalPayments: 0,
    recentStudents: 15,
    pendingPayments: 8,
  });

  // Simulation de chargement des statistiques
  useEffect(() => {
    // Ici, vous feriez un appel API pour récupérer les vraies données
    setStats({
      totalStudents: 245,
      totalTeachers: 32,
      totalClasses: 18,
      totalPayments: 124500,
      recentStudents: 15,
      pendingPayments: 8,
    });
  }, []);

  const statCards = [
    {
      title: 'Élèves',
      value: stats.totalStudents,
      icon: Users,
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
      change: '+12%',
      isPositive: true,
    },
    {
      title: 'Enseignants',
      value: stats.totalTeachers,
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      change: '+5%',
      isPositive: true,
    },
    {
      title: 'Classes',
      value: stats.totalClasses,
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      change: '0%',
      isPositive: true,
    },
    {
      title: 'Paiements',
      value: `${stats.totalPayments.toLocaleString()} FCFA`,
      icon: CreditCard,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-100',
      iconColor: 'text-primary-600',
      change: '+8%',
      isPositive: true,
    },
  ];

  return (
    <Layout title="Dashboard">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const ChangeIcon = card.isPositive ? TrendingUp : TrendingDown;

          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-l-4 border-transparent hover:border-primary-500 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${card.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <ChangeIcon className="w-4 h-4 mr-1" />
                  <span>{card.change}</span>
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wide">{card.title}</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Graphiques et informations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Activités récentes */}
        <Card title="Activités récentes">
          <div className="space-y-4">
            <ActivityItem
              title="Nouvel élève inscrit"
              description="Jean Dupont a été inscrit en Terminale A"
              time="Il y a 2 heures"
              color="bg-blue-500"
            />
            <ActivityItem
              title="Paiement reçu"
              description="Marie Martin - Frais de scolarité - 25,000 FCFA"
              time="Il y a 4 heures"
              color="bg-green-500"
            />
            <ActivityItem
              title="Nouvelle classe créée"
              description="Classe de 1ère S ajoutée au système"
              time="Il y a 1 jour"
              color="bg-purple-500"
            />
            <ActivityItem
              title="Enseignant ajouté"
              description="Dr. Pierre Ndiaye - Mathématiques"
              time="Il y a 2 jours"
              color="bg-orange-500"
            />
          </div>
        </Card>

        {/* Paiements en attente */}
        <Card title="Paiements en attente" action={
          <span className="text-sm text-red-600 font-medium">{stats.pendingPayments} en attente</span>
        }>
          <div className="space-y-4">
            <PaymentItem
              student="Amadou Diallo"
              amount="25,000 FCFA"
              dueDate="15/12/2024"
              status="En retard"
            />
            <PaymentItem
              student="Fatou Sow"
              amount="25,000 FCFA"
              dueDate="20/12/2024"
              status="À venir"
            />
            <PaymentItem
              student="Moussa Kane"
              amount="25,000 FCFA"
              dueDate="22/12/2024"
              status="À venir"
            />
          </div>
        </Card>
      </div>

      {/* Statistiques par classe */}
      <Card title="Statistiques par classe" icon={School}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.length > 0 ? (
            classes.map((classItem, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <School className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{classItem.name}</h3>
                  </div>
                  <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-semibold flex-shrink-0 ml-2">
                    {classItem.count}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Nombre d'élèves:</span>
                    <span className="font-semibold text-gray-900">{classItem.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((classItem.count / 40) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Capacité</span>
                    <span>{classItem.count}/40</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune classe disponible</p>
            </div>
          )}
        </div>
      </Card>

      {/* Graphique de fréquentation */}
      <Card title="Vue d'ensemble mensuelle">
        <div className="h-64 flex items-center justify-center text-gray-400">
          Graphique de statistiques (à intégrer avec une librairie comme Chart.js ou Recharts)
        </div>
      </Card>
    </Layout>
  );
};

// Composant pour les activités récentes
const ActivityItem = ({ title, description, time, color }) => (
  <div className="flex items-start">
    <div className={`${color} w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0`}></div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-gray-800 break-words">{title}</h4>
      <p className="text-sm text-gray-600 break-words">{description}</p>
      <p className="text-xs text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

// Composant pour les paiements en attente
const PaymentItem = ({ student, amount, dueDate, status }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gray-50 rounded-lg">
    <div className="min-w-0 flex-1">
      <h4 className="text-sm font-medium text-gray-800 truncate">{student}</h4>
      <p className="text-xs text-gray-500">Échéance: {dueDate}</p>
    </div>
    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
      <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">{amount}</p>
      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
        status === 'En retard' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {status}
      </span>
    </div>
  </div>
);

export default Dashboard;
