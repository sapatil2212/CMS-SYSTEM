'use client'

import { logger } from '@/lib/logger';
import React, { useState, useEffect } from 'react';;
import { 
  Settings, 
  Edit, 
  Plus, 
  Trash2, 
  Eye, 
  Target, 
  Award, 
  BarChart3, 
  Building2, 
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
  Save,
  X
} from 'lucide-react';

interface QualityTestingContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  commitmentTitle: string;
  commitmentDescription: string;
  capabilitiesTitle: string;
  capabilitiesDescription: string;
  statisticsTitle: string;
  statisticsDescription: string;
  standardsTitle: string;
  standardsDescription: string;
  labTitle: string;
  labDescription: string;
  trustedTitle: string;
  trustedDescription: string;
  ctaTitle: string;
  ctaDescription: string;
}

interface Capability {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface Standard {
  id: string;
  name: string;
  description: string;
  category: string;
  order: number;
  isActive: boolean;
}

interface Statistic {
  id: string;
  number: string;
  label: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface LabImage {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  order: number;
  isActive: boolean;
}

const QualityTestingSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Expose the showSidebar method globally
  useEffect(() => {
    (window as any).showQualityTestingSidebar = () => setIsOpen(true);
  }, []);
  const [content, setContent] = useState<QualityTestingContent | null>(null);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [labImages, setLabImages] = useState<LabImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contentRes, capabilitiesRes, standardsRes, statisticsRes, industriesRes, labImagesRes] = await Promise.all([
        fetch('/api/content/quality-testing'),
        fetch('/api/content/quality-testing/capabilities'),
        fetch('/api/content/quality-testing/standards'),
        fetch('/api/content/quality-testing/statistics'),
        fetch('/api/content/quality-testing/industries'),
        fetch('/api/content/quality-testing/lab-images')
      ]);

      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setContent(contentData);
      }

      if (capabilitiesRes.ok) {
        const capabilitiesData = await capabilitiesRes.json();
        setCapabilities(capabilitiesData);
      }

      if (standardsRes.ok) {
        const standardsData = await standardsRes.json();
        setStandards(standardsData);
      }

      if (statisticsRes.ok) {
        const statisticsData = await statisticsRes.json();
        setStatistics(statisticsData);
      }

      if (industriesRes.ok) {
        const industriesData = await industriesRes.json();
        setIndustries(industriesData);
      }

      if (labImagesRes.ok) {
        const labImagesData = await labImagesRes.json();
        setLabImages(labImagesData);
      }
    } catch (error) {
      logger.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async () => {
    if (!content) return;

    try {
      const response = await fetch('/api/content/quality-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      if (response.ok) {
        alert('Content saved successfully!');
        setEditMode(false);
      }
    } catch (error) {
      logger.error('Error saving content:', error);
      alert('Error saving content');
    }
  };

  const handleSaveItem = async (type: string, item: any) => {
    try {
      const url = `/api/content/quality-testing/${type}${item.id ? `/${item.id}` : ''}`;
      const method = item.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        alert(`${type} saved successfully!`);
        setEditingItem(null);
        fetchData();
      }
    } catch (error) {
      logger.error(`Error saving ${type}:`, error);
      alert(`Error saving ${type}`);
    }
  };

  const handleDeleteItem = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/content/quality-testing/${type}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert(`${type} deleted successfully!`);
        fetchData();
      }
    } catch (error) {
      logger.error(`Error deleting ${type}:`, error);
      alert(`Error deleting ${type}`);
    }
  };

  const renderContentEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
        <input
          type="text"
          value={content?.heroTitle || ''}
          onChange={(e) => setContent(prev => prev ? { ...prev, heroTitle: e.target.value } : null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
        <input
          type="text"
          value={content?.heroSubtitle || ''}
          onChange={(e) => setContent(prev => prev ? { ...prev, heroSubtitle: e.target.value } : null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Description</label>
        <textarea
          value={content?.heroDescription || ''}
          onChange={(e) => setContent(prev => prev ? { ...prev, heroDescription: e.target.value } : null)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleSaveContent}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </button>
        <button
          onClick={() => setEditMode(false)}
          className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </button>
      </div>
    </div>
  );

  const renderItemEditor = (type: string, item: any) => (
    <div className="space-y-4 p-4 bg-gray-50 rounded-md">
      {Object.keys(item).map((key) => {
        if (key === 'id' || key === 'contentId' || key === 'createdAt' || key === 'updatedAt') return null;
        
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            {key === 'description' || key === 'details' ? (
              <textarea
                value={item[key] || ''}
                onChange={(e) => setEditingItem((prev: any) => ({ ...prev, [key]: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            ) : key === 'isActive' ? (
              <select
                value={item[key] ? 'true' : 'false'}
                onChange={(e) => setEditingItem((prev: any) => ({ ...prev, [key]: e.target.value === 'true' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            ) : (
              <input
                type="text"
                value={item[key] || ''}
                onChange={(e) => setEditingItem((prev: any) => ({ ...prev, [key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
          </div>
        );
      })}
      <div className="flex space-x-2">
        <button
          onClick={() => handleSaveItem(type, editingItem)}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </button>
        <button
          onClick={() => setEditingItem(null)}
          className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </button>
      </div>
    </div>
  );

  const renderItemList = (items: any[], type: string, title: string, icon: React.ReactNode) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveSection(activeSection === type ? null : type)}
          className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          {icon}
          <span>{title}</span>
          {activeSection === type ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <button
          onClick={() => setEditingItem({ title: '', description: '', icon: '', order: 0, isActive: true })}
          className="p-1 text-blue-600 hover:text-blue-800"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      {activeSection === type && (
        <div className="space-y-2 ml-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm truncate">{item.title || item.name}</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleDeleteItem(type, item.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="fixed right-4 top-4 w-80 bg-white shadow-lg rounded-lg p-4">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quality Testing Admin</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Page Content</h4>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              {editMode && renderContentEditor()}
            </div>

            {/* Capabilities */}
            {renderItemList(capabilities, 'capabilities', 'Capabilities', <Target className="h-4 w-4" />)}

            {/* Standards */}
            {renderItemList(standards, 'standards', 'Standards', <Award className="h-4 w-4" />)}

            {/* Statistics */}
            {renderItemList(statistics, 'statistics', 'Statistics', <BarChart3 className="h-4 w-4" />)}

            {/* Industries */}
            {renderItemList(industries, 'industries', 'Industries', <Building2 className="h-4 w-4" />)}

            {/* Lab Images */}
            {renderItemList(labImages, 'lab-images', 'Lab Images', <ImageIcon className="h-4 w-4" />)}

            {/* Item Editor */}
            {editingItem && (
              <div className="mt-4 p-4 border-t">
                <h4 className="font-medium mb-2">Edit Item</h4>
                {renderItemEditor('', editingItem)}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QualityTestingSidebar; 