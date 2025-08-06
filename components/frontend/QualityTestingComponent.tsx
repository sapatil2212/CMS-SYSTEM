'use client'

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Shield, 
  CheckCircle, 
  Eye, 
  Zap, 
  Target, 
  Award, 
  Clock, 
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Users,
  Image,
  Beaker,
  FileText,
  BarChart3,
  Building2,
  Camera,
  Settings,
  Wrench,
  Search as MagnifyingGlass,
  Cpu,
  Zap as Bolt,
  Heart,
  Flame,
  Sparkles,
  GraduationCap,
  Briefcase,
  Globe,
  Home,
  Truck,
  Cog,
  Terminal,
  Box,
  Tablet,
  Smartphone,
  Monitor,
  Server,
  Signal,
  Wifi
} from 'lucide-react';
import { logger } from '@/lib/logger';
import QualityTestingSidebar from '@/components/admin/QualityTestingSidebar';;



const QualityTestingComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [content, setContent] = useState<any>(null);
  const [capabilities, setCapabilities] = useState<any[]>([]);
  const [standards, setStandards] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [labImages, setLabImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);





  // Fallback colors for when images are not available
  const labImageColors = [
    'from-blue-500 to-indigo-600',
    'from-green-500 to-emerald-600',
    'from-purple-500 to-violet-600',
    'from-orange-500 to-red-600'
  ];

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

  const toggleCapability = (id: string) => {
    setCapabilities(prev => 
      prev.map(cap => 
        cap.id === id 
          ? { ...cap, isExpanded: !cap.isExpanded }
          : cap
      )
    );
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      // Original icons
      Target: <Target className="h-8 w-8" />,
      Shield: <Shield className="h-8 w-8" />,
      Zap: <Zap className="h-8 w-8" />,
      Eye: <Eye className="h-8 w-8" />,
      Award: <Award className="h-8 w-8" />,
      Star: <Star className="h-8 w-8" />,
      CheckCircle: <CheckCircle className="h-8 w-8" />,
      
      // New icons from admin dropdown
      BeakerIcon: <Beaker className="h-8 w-8" />,
      CheckCircleIcon: <CheckCircle className="h-8 w-8" />,
      DocumentTextIcon: <FileText className="h-8 w-8" />,
      ChartBarIcon: <BarChart3 className="h-8 w-8" />,
      BuildingOfficeIcon: <Building2 className="h-8 w-8" />,
      PhotoIcon: <Camera className="h-8 w-8" />,
      CogIcon: <Settings className="h-8 w-8" />,
      WrenchScrewdriverIcon: <Wrench className="h-8 w-8" />,
      ShieldCheckIcon: <Shield className="h-8 w-8" />,
      MagnifyingGlassIcon: <MagnifyingGlass className="h-8 w-8" />,
      CpuChipIcon: <Cpu className="h-8 w-8" />,
      BoltIcon: <Bolt className="h-8 w-8" />,
      StarIcon: <Star className="h-8 w-8" />,
      HeartIcon: <Heart className="h-8 w-8" />,
      FireIcon: <Flame className="h-8 w-8" />,
      SparklesIcon: <Sparkles className="h-8 w-8" />,
      AcademicCapIcon: <GraduationCap className="h-8 w-8" />,
      BriefcaseIcon: <Briefcase className="h-8 w-8" />,
      GlobeAltIcon: <Globe className="h-8 w-8" />,
      HomeIcon: <Home className="h-8 w-8" />,
      TruckIcon: <Truck className="h-8 w-8" />,
      WrenchIcon: <Wrench className="h-8 w-8" />,
      Cog6ToothIcon: <Cog className="h-8 w-8" />,
      CommandLineIcon: <Terminal className="h-8 w-8" />,
      CubeIcon: <Box className="h-8 w-8" />,
      CubeTransparentIcon: <Box className="h-8 w-8" />,
      DeviceTabletIcon: <Tablet className="h-8 w-8" />,
      DevicePhoneMobileIcon: <Smartphone className="h-8 w-8" />,
      ComputerDesktopIcon: <Monitor className="h-8 w-8" />,
      ServerIcon: <Server className="h-8 w-8" />,
      SignalIcon: <Signal className="h-8 w-8" />,
      WifiIcon: <Wifi className="h-8 w-8" />
    };
    return iconMap[iconName] || <CheckCircle className="h-8 w-8" />;
  };

  useEffect(() => {
    // Auto-change images every 3 seconds
    const interval = setInterval(() => {
      if (labImages.length > 0) {
        setCurrentImageIndex(prev => (prev + 1) % labImages.length);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [labImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Quality Testing Page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <QualityTestingSidebar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {content?.heroTitle || 'Quality Testing'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              {content?.heroSubtitle || 'Ensuring Excellence at Every Stage'}
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
              {content?.heroDescription || 'At Alkalyne, quality is not just a checkpoint — it\'s the foundation of everything we do. Our rigorous quality testing protocols ensure that every component meets or exceeds the industry standards for performance, durability, and reliability.'}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-900 to-transparent"></div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {content?.commitmentTitle || 'Our Commitment to Quality'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content?.commitmentDescription || 'We follow stringent testing procedures across all stages — from raw material inspection to final component approval. Our goal is to ensure zero-defect delivery with measurable performance results.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Equipment</h3>
                  <p className="text-gray-600">State-of-the-art testing equipment for precise measurements</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Skilled Technicians</h3>
                  <p className="text-gray-600">Certified professionals with years of experience</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Strict Process Controls</h3>
                  <p className="text-gray-600">Comprehensive quality control at every stage</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Quality Assurance Process</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span>Raw Material Inspection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span>Process Monitoring</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span>Quality Testing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <span>Final Approval</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testing Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {content?.capabilitiesTitle || 'Quality Testing Capabilities'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content?.capabilitiesDescription || 'Our comprehensive testing capabilities ensure every component meets the highest standards'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability) => (
              <div
                key={capability.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 cursor-pointer group"
                onClick={() => toggleCapability(capability.id)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                      {getIconComponent(capability.icon)}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors group-hover:scale-110">
                      {capability.isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {capability.title}
                  </h3>
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
                    {capability.description}
                  </p>
                  {capability.isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">
                        {capability.details}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

             {/* Statistics Section */}
       <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
                         <h2 className="text-4xl font-bold mb-6">
              {content?.statisticsTitle || 'Quality by the Numbers'}
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {content?.statisticsDescription || 'Our commitment to excellence is reflected in our performance metrics'}
            </p>
           </div>

                       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {statistics.length > 0 ? statistics.map((stat, index) => (
               <div
                 key={index}
                 className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
               >
                 <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                   {getIconComponent(stat.icon)}
                 </div>
                                   <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              )) : (
                <div className="col-span-4 text-center text-blue-100">
                  No statistics available. Add some through the admin panel.
                </div>
              )}
            </div>
         </div>
       </section>

       {/* Industry Standards */}
       <section className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
                         <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {content?.standardsTitle || 'Industry Standards We Follow'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content?.standardsDescription || 'Our testing procedures are aligned with globally recognized standards'}
            </p>
           </div>

                       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {standards.length > 0 ? standards.map((standard) => (
               <div
                 key={standard.id}
                 className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
               >
                 <div className="text-center">
                   <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                     <Award className="h-8 w-8 text-blue-600" />
                   </div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
                     {standard.name}
                   </h3>
                   <p className="text-gray-600 text-sm">
                     {standard.description}
                   </p>
                   <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                     {standard.category}
                   </span>
                 </div>
               </div>
             )) : (
               <div className="col-span-4 text-center text-gray-500">
                 No standards available. Add some through the admin panel.
               </div>
             )}
           </div>
         </div>
       </section>

      {/* Lab Facilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {content?.labTitle || 'In-House Lab Facilities'}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {content?.labDescription || 'Alkalyne\'s in-house quality lab is equipped with modern instrumentation and operated by certified professionals who continuously monitor and calibrate equipment to maintain accuracy.'}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Modern Instrumentation</h3>
                    <p className="text-gray-600">State-of-the-art testing equipment</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Certified Professionals</h3>
                    <p className="text-gray-600">Experienced quality control team</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Continuous Monitoring</h3>
                    <p className="text-gray-600">24/7 quality assurance</p>
                  </div>
                </div>
              </div>
            </div>

                         <div className="relative">
               <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-all duration-300">
                 {labImages.length > 0 ? (
                   <>
                                           <div className={`relative h-80 rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300`}>
                        {labImages[currentImageIndex]?.imagePath ? (
                          <>
                            <img
                              src={labImages[currentImageIndex].imagePath}
                              alt={labImages[currentImageIndex]?.title || 'Lab Image'}
                              className="w-full h-full object-cover"
                            />
                          </>
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${labImageColors[currentImageIndex]} flex items-center justify-center`}>
                            <div className="text-center text-white">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Eye className="h-8 w-8" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                   </>
                 ) : (
                   <div className="h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-all duration-300">
                     <div className="text-center text-white">
                       <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                         <Image className="h-8 w-8" />
                       </div>
                       <h3 className="text-xl font-semibold mb-2">No Lab Images</h3>
                       <p className="text-blue-100">Add lab images through the admin panel</p>
                     </div>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trusted by Industry */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {content?.trustedTitle || 'Trusted by Industry Leaders'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content?.trustedDescription || 'From automotive and aerospace to electronics and medical equipment — our clients rely on our quality commitment for the most demanding applications.'}
            </p>
          </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {industries.length > 0 ? industries.map((industry, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="text-4xl mb-4">{getIconComponent(industry.icon)}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {industry.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {industry.description}
                </p>
              </div>
            )) : (
              <div className="col-span-4 text-center text-gray-500">
                No industries available. Add some through the admin panel.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {content?.ctaTitle || 'Precision. Performance. Proven Results.'}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {content?.ctaDescription || 'Let our testing standards be the reason behind your product reliability.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Contact Us</span>
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center space-x-2">
              <ArrowRight className="h-5 w-5" />
              <span>Learn More</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QualityTestingComponent; 