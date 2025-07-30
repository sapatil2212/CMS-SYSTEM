import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Check, Shield, Zap, Layers, 
  Thermometer, Plane, Car, CircuitBoard, 
  Rocket, HardHat, Battery, Factory, 
  Award, ClipboardCheck, Package, Lightbulb
} from 'lucide-react';

const AluminiumPlating = () => {
  const benefits = [
    { icon: <Shield className="h-6 w-6 text-blue-600" />, title: "Lightweight Strength", desc: "Superior strength-to-weight ratio for aerospace and automotive applications" },
    { icon: <Zap className="h-6 w-6 text-blue-600" />, title: "Enhanced Conductivity", desc: "Improved electrical and thermal conductivity with plating" },
    { icon: <Layers className="h-6 w-6 text-blue-600" />, title: "Corrosion Resistance", desc: "Advanced protection against oxidation and environmental damage" },
    { icon: <Thermometer className="h-6 w-6 text-blue-600" />, title: "Thermal Management", desc: "Excellent heat dissipation for electronics and heat exchangers" },
    { icon: <Award className="h-6 w-6 text-blue-600" />, title: "Aesthetic Finishes", desc: "Decorative and functional surface treatments" },
    { icon: <Factory className="h-6 w-6 text-blue-600" />, title: "Chemical Resistance", desc: "Withstands harsh industrial environments" }
  ];

  const industries = [
    { 
      name: "Aerospace & Aviation", 
      icon: <Rocket className="h-6 w-6 text-blue-600" />,
      description: "Critical components requiring lightweight durability and reliability",
      examples: ["Fuselage parts", "Landing gear", "Avionics housings", "Engine components"],
      image: "/uploads/aluminium/aerospace.jpg"
    },
    { 
      name: "Automotive & EV", 
      icon: <Car className="h-6 w-6 text-blue-600" />,
      description: "Lightweighting solutions for modern vehicles and electric cars",
      examples: ["Battery enclosures", "Motor components", "Structural parts", "Heat exchangers"],
      image: "/uploads/aluminium/automotive.jpg"
    },
    { 
      name: "Electronics & Telecommunications", 
      icon: <CircuitBoard className="h-6 w-6 text-blue-600" />,
      description: "Precision components for electrical and communication systems",
      examples: ["Heat sinks", "Connectors", "RF shielding", "Antenna components"],
      image: "/uploads/aluminium/electronics.jpg"
    },
    { 
      name: "Defence & Security", 
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      description: "Mission-critical protection for military and security equipment",
      examples: ["Armor components", "Marine hardware", "Aircraft parts", "Communication systems"],
      image: "/uploads/aluminium/defence.jpg"
    }
  ];

  const techniques = [
    {
      name: "Electroless Nickel",
      properties: ["Uniform coating", "High hardness", "Wear resistance", "Chemical resistance"],
      thickness: "5-50μm",
      applications: ["Gears", "Valves", "Aerospace parts", "Electronics"]
    },
    {
      name: "Silver Plating",
      properties: ["Excellent conductivity", "RF performance", "Solderability", "Low contact resistance"],
      thickness: "2-20μm",
      applications: ["Connectors", "Battery tabs", "Waveguides", "RF components"]
    },
    {
      name: "Tin Plating",
      properties: ["Cost-effective", "Good solderability", "Corrosion protection", "RoHS compliant"],
      thickness: "5-15μm",
      applications: ["PCB contacts", "Terminals", "Busbars", "Electrical components"]
    },
    {
      name: "Gold Plating",
      properties: ["Premium finish", "Superior conductivity", "Oxidation resistance", "High reliability"],
      thickness: "0.5-5μm",
      applications: ["Medical devices", "High-end electronics", "Space components", "Precision instruments"]
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Surface Preparation",
      desc: "Thorough cleaning and degreasing to remove contaminants and oxide layers"
    },
    {
      step: "2",
      title: "Zincating",
      desc: "Specialized zinc immersion process for optimal adhesion to aluminium"
    },
    {
      step: "3",
      title: "Plating Bath",
      desc: "Precision deposition in controlled solutions with temperature monitoring"
    },
    {
      step: "4",
      title: "Quality Control",
      desc: "Rigorous testing for thickness, adhesion, and performance specifications"
    },
    {
      step: "5",
      title: "Packaging",
      desc: "Secure packaging with anti-corrosion protection for transportation"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="mb-20 bg-gradient-to-r from-blue-900 to-gray-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-gray-800/20"></div>
        </div>
        <div className="relative z-10 max-w-4xl">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-xs md:text-sm font-medium px-3 py-1 rounded-full mb-6">
            Advanced Metal Finishing Solutions
          </span>
          <h1 className="text-2xl md:text-5xl font-bold mb-6 leading-tight">
            Specialised Aluminium Plating Services Across India
          </h1>
          <p className="text-sm md:text-xl text-blue-100 mb-8">
            Reliable Protection, Enhanced Functionality, and Precision Finishing for Modern Industries
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Get a Quote <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Aluminium Plating?</h2>
            <p className="text-gray-600 mb-6">
              Aluminium is a lightweight metal known for its exceptional strength-to-weight ratio and natural corrosion resistance. Our specialised plating processes enhance these properties for demanding applications, providing improved durability, conductivity, wear resistance, and decorative finishes.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-800 font-medium">
                Our advanced plating processes overcome aluminium's natural oxide layer challenges to ensure perfect adhesion and long-lasting performance in the most demanding environments.
              </p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-gray-100 p-8">
              <div className="text-center">
                <Lightbulb className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Advantages</h3>
                <p className="text-gray-600 text-sm">Lightweight • Corrosion Resistant • High Conductivity • Versatile Applications</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Benefits of Aluminium Plating</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enhance your components with our specialised plating solutions designed for aluminium's unique properties
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our aluminium plating solutions support critical applications across diverse sectors
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {industries.map((industry, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {industry.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{industry.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{industry.description}</p>
                <h4 className="font-semibold text-gray-900 mb-2">Common Applications:</h4>
                <ul className="space-y-2">
                  {industry.examples.map((example, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Plating Techniques */}
      <section className="mb-20 bg-gray-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Plating Techniques</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Specialised processes optimised for aluminium's unique surface characteristics
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techniques.map((tech, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">{tech.name}</h3>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Properties:</h4>
                <ul className="space-y-2">
                  {tech.properties.map((prop, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{prop}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-1">Thickness Range:</h4>
                <p className="text-gray-600 text-sm">{tech.thickness}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Typical Uses:</h4>
                <div className="flex flex-wrap gap-2">
                  {tech.applications.map((app, i) => (
                    <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Plating Process</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Precision steps optimised for aluminium's unique surface characteristics
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <div className="grid md:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                  {step.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="bg-gradient-to-br from-blue-100 to-gray-100 p-8 rounded-lg">
                <div className="text-center">
                  <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                  <p className="text-gray-600 text-sm">Certified processes meeting international standards</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Alkalyne for Aluminium Plating?</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Aluminium Expertise</h4>
                  <p className="text-gray-600">Specialised knowledge in aluminium surface treatment and plating</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Full-Service Solutions</h4>
                  <p className="text-gray-600">From prototype to high-volume production with quality consistency</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Quality Assurance</h4>
                  <p className="text-gray-600">Stringent testing protocols ensuring consistent results</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <Factory className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Advanced Facilities</h4>
                  <p className="text-gray-600">State-of-the-art plating equipment optimised for aluminium</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-xl md:text-4xl font-bold text-white mb-6">Ready to Enhance Your Aluminium Components?</h2>
          <p className="text-blue-100 mb-8 text-sm md:text-lg">
            Our team is ready to discuss your specific aluminium plating requirements and provide a tailored solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 font-bold py-2 px-5 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Get a Free Quote <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AluminiumPlating;