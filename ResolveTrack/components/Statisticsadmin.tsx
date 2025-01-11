'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaCalendarDay, FaRegFileAlt, FaArrowLeft, FaArrowRight, FaPrint } from 'react-icons/fa';

interface ReclamationData {
  _id: string;
  email: string;
  updateDate: string;
  responseDate?: string;
  date: string;
  models: string[];
  reference: string;
  etat: string;
  message: string;
}

const StatisticsAdmin: React.FC = () => {
  const [data, setData] = useState<ReclamationData[] | null>(null);
  const [latestData, setLatestData] = useState<ReclamationData[] | null>(null);
  const [filterType, setFilterType] = useState<'date' | 'email' | 'reference'>('email');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [consultSearchTerm, setConsultSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/reclamations/listereclamations');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const latestUpdates = data.reduce((acc: Record<string, ReclamationData>, item) => {
        if (!acc[item.email] || new Date(item.updateDate) > new Date(acc[item.email].updateDate)) {
          acc[item.email] = item;
        }
        return acc;
      }, {});

      setLatestData(Object.values(latestUpdates));
    }
  }, [data]);

  const formatDate = (dateInput: Date | string | null): string => {
    if (!dateInput) return 'N/A';
    const dateString = dateInput instanceof Date ? dateInput.toISOString() : dateInput;
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const calculateDifference = (startDate: Date, endDate: Date | null) => {
    if (!endDate) return 'N/A';
    const diff = endDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffDays}d ${diffHours}h ${diffMinutes}m`;
  };

  const filterOutPending = (data: ReclamationData[]) => {
    return data.filter(item => item.etat !== 'en attente');
  };

  const groupBy = (data: ReclamationData[], key: 'date' | 'email' | 'reference') => {
    return data.reduce((acc: Record<string, ReclamationData[]>, item) => {
      const groupKey = key === 'date'
        ? formatDate(item[key as keyof ReclamationData] as string)
        : (item[key as keyof ReclamationData] || 'N/A').toString();

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {});
  };

  const filteredLatestData = latestData ? filterOutPending(latestData).filter(item => {
    const searchValue = searchTerm.toLowerCase();
    return item[filterType].toString().toLowerCase().includes(searchValue);
  }) : [];

  const groupedData = groupBy(filteredLatestData, filterType);

  const consultFilteredData = data ? filterOutPending(data).filter(item => {
    const searchValue = consultSearchTerm.toLowerCase();
    return (
      item.email.toLowerCase().includes(searchValue) ||
      item.reference.toLowerCase().includes(searchValue) ||
      formatDate(item.date).toLowerCase().includes(searchValue) ||
      item.etat.toLowerCase().includes(searchValue)
    );
  }) : [];

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleHideAll = () => {
    setShowAll(false);
  };

  const toggleItem = (id: string) => {
    setExpandedItem(prev => (prev === id ? null : id));
  };

  const printSection = (reclamation: ReclamationData) => {
    const { email, updateDate, responseDate, date, models, reference, etat, message } = reclamation;
  
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write('<html><head><title>Print Reclamation</title>');
      // Add styling for printing
      printWindow.document.write('<style>');
      printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
      printWindow.document.write('h1 { color: #333; }');
      printWindow.document.write('p { margin: 5px 0; }');
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1> Details de Reclamation</h1>');
      printWindow.document.write('<p><strong>Email:</strong> ' + email + '</p>');
      printWindow.document.write('<p><strong>Description:</strong> ' + message + '</p>');
      printWindow.document.write('<p><strong>Etat:</strong> ' + etat + '</p>');
      printWindow.document.write('<p><strong>Date de mise en reclamation:</strong> ' + formatDate(date) + '</p>');
      printWindow.document.write('<p><strong>derniere mis a jour :</strong> ' + formatDate(updateDate) + '</p>');
      printWindow.document.write('<p><strong> Date de response:</strong> ' + (responseDate ? formatDate(responseDate) : 'N/A') + '</p>');
      printWindow.document.write('<p><strong>Modele:</strong> ' + models + '</p>');
      printWindow.document.write('<p><strong>Reference:</strong> ' + reference + '</p>');
      printWindow.document.write('<p><strong>Duree de reponse</strong> ' + calculateDifference(new Date(date), responseDate ? new Date(responseDate) : null) + '</p>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };
  

  return (
    <div className="p-8 bg-gray-100 text-gray-900 rounded-lg shadow-md">
    <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center space-x-2">
      <FaRegFileAlt className="text-blue-600 text-3xl" />
      <span> Statistics Admin</span>
    </h2>

      <div className={`mb-6 ${showAll ? 'hidden' : ''}`}>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <label htmlFor="latest-filter" className="block text-sm font-medium text-gray-700">Filter par:</label>
            <select
              id="latest-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'date' | 'email' | 'reference')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="email">Email</option>
              <option value="date">Date</option>
              <option value="reference">Reference</option>
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="latest-search" className="block text-sm font-medium text-gray-700">Chercher:</label>
            <div className="relative">
              <input
                id="latest-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <FaSearch className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
            </div>
          </div>
        </div>

        <button
          onClick={handleShowAll}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2"
        >
          <FaArrowRight />
          <span>Consulter</span>
        </button>
        <span>Dernières mises à jour...</span>
      </div>

      {!showAll ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(groupedData).length > 0 ? (
            Object.keys(groupedData).map(key => (
              <div key={key} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaCalendarDay className="mr-2 text-blue-500" />
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}: {key}
                </h3>
                <div className="space-y-4">
                  {groupedData[key].map(reclamation => {
                    const { _id, updateDate, responseDate, date, models, reference, etat, email, message } = reclamation;
                    const updateDateObj = new Date(updateDate);
                    const responseDateObj = responseDate ? new Date(responseDate) : null;
                    const dateObj = new Date(date);

                    return (
                      <div key={_id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col space-y-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700 text-yellow-500"><strong>Email:</strong></span>
                            <span>{email}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700 text-yellow-500"><strong>Description:</strong></span>
                            <span>{message}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700 text-yellow-500"><strong>Etat:</strong></span>
                            <span>{etat}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaCalendarDay className="text-gray-400" />
                            <span className="text-gray-600">{formatDate(date)}</span>
                          </div>
                          <button
                            onClick={() => toggleItem(_id)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            {expandedItem === _id ? 'Fermer' : ' Details'}
                          </button>
                          {expandedItem === _id && (
                            <div className="mt-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-700 text-yellow-500"><strong>Dernière mise à jour:</strong></span>
                                <span>{formatDate(updateDate)}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-700 text-yellow-500"><strong>Modèle:</strong></span>
                                <span>{models}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-700 text-yellow-500"><strong>Référence:</strong></span>
                                <span>{reference}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-700 text-yellow-500"><strong>Date de réponse:</strong></span>
                                <span>{responseDateObj ? formatDate(responseDateObj) : 'N/A'}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-700 text-yellow-500"><strong>Durée de réponse:</strong></span>
                                <span>{calculateDifference(dateObj, responseDateObj)}</span>
                              </div>
                              <button
  onClick={() => printSection(reclamation)}
  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md flex items-center space-x-2"
>
  <FaPrint />
</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div>Aucune mise à jour disponible.</div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <label htmlFor="consult-filter" className="block text-sm font-medium text-gray-700">Filter par:</label>
              <select
                id="consult-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'date' | 'email' | 'reference')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="email">Email</option>
                <option value="date">Date</option>
                <option value="reference">Reference</option>
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="consult-search" className="block text-sm font-medium text-gray-700">Chercher:</label>
              <div className="relative">
                <input
                  id="consult-search"
                  type="text"
                  value={consultSearchTerm}
                  onChange={(e) => setConsultSearchTerm(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <FaSearch className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
              </div>
            </div>
          </div>

          <button
            onClick={handleHideAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2"
          >
            <FaArrowLeft />
           
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultFilteredData.map(reclamation => {
              const { _id, updateDate, responseDate, date, models, reference, etat, email, message } = reclamation;
              const updateDateObj = new Date(updateDate);
              const responseDateObj = responseDate ? new Date(responseDate) : null;
              const dateObj = new Date(date);

              return (
                <div key={_id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700 text-yellow-500"><strong>Email:</strong></span>
                      <span>{email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700 text-yellow-500"><strong>Description:</strong></span>
                      <span>{message}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700 text-yellow-500"><strong>Etat:</strong></span>
                      <span>{etat}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCalendarDay className="text-gray-400" />
                      <span className="text-gray-600">{formatDate(date)}</span>
                    </div>
                    <button
                      onClick={() => toggleItem(_id)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      {expandedItem === _id ? 'Fermer' : ' Details'}
                    </button>
                    {expandedItem === _id && (
                      <div className="mt-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 text-yellow-500"><strong>Dernière mise à jour:</strong></span>
                          <span>{formatDate(updateDate)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 text-yellow-500"><strong>Modèle:</strong></span>
                          <span>{models}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 text-yellow-500"><strong>Référence:</strong></span>
                          <span>{reference}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 text-yellow-500"><strong>Date de réponse:</strong></span>
                          <span>{responseDateObj ? formatDate(responseDateObj) : 'N/A'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 text-yellow-500"><strong>Durée de réponse:</strong></span>
                          <span>{calculateDifference(dateObj, responseDateObj)}</span>
                        </div>
                        <button
  onClick={() => printSection(reclamation)}
  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md flex items-center space-x-2"
>
  <FaPrint />
</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsAdmin;
