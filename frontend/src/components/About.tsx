import React from 'react';
import { Award, Users, Heart, Zap, Shield, Globe, Stethoscope, Brain, Activity, Sparkles, Bot, Cpu, Network } from 'lucide-react';

const About: React.FC = () => {
  const achievements = [
    {
      icon: Award,
      title: 'Excellence Awards',
      description: 'Recognized for outstanding patient care',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: '200+ certified medical professionals',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Heart,
      title: 'Patient-Centered',
      description: 'Compassionate care at every step',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'AI Innovation',
      description: 'Cutting-edge technology integration',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const features = [
    {
      icon: Stethoscope,
      title: 'Advanced Diagnostics',
      description: 'State-of-the-art medical equipment',
      color: 'from-blue-600 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Care',
      description: 'Intelligent health monitoring systems',
      color: 'from-purple-600 to-pink-500'
    },
    {
      icon: Activity,
      title: '24/7 Monitoring',
      description: 'Continuous patient care and support',
      color: 'from-green-600 to-emerald-500'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-50 via-white to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-teal-200 to-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-200 to-teal-200 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 rounded-full text-sm font-semibold mb-6 shadow-md">
              <Sparkles className="w-4 h-4 mr-2" />
              About Our Hospital
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Redefining
              </span>
              <br />
              <span className="text-gray-800">Healthcare</span>
              <br />
              <span className="text-gray-800">Excellence</span>
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-10">
              <p className="font-medium">
                Welcome to <span className="text-teal-600 font-bold">Srinivasa Hospital</span>—where innovation meets compassion. 
                For over <span className="font-semibold text-gray-900">25 years</span>, we've been transforming healthcare delivery 
                through cutting-edge technology and personalized patient care.
              </p>
              
              <p>
                Our <span className="font-semibold text-blue-600">revolutionary AI-powered appointment system</span> represents 
                the future of healthcare accessibility. We believe exceptional medical care should be convenient, efficient, 
                and tailored to each patient's unique journey.
              </p>
              
              <p>
                From emergency interventions to specialized treatments, our <span className="font-semibold">world-class facilities</span> and 
                <span className="font-semibold"> expert medical team</span> deliver outcomes that exceed expectations while maintaining 
                the highest standards of safety, comfort, and dignity.
              </p>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-2 gap-5">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="group p-5 bg-white rounded-2xl hover:bg-gradient-to-br hover:from-white hover:to-gray-50 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <achievement.icon className="text-white" size={26} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - AI Healthcare Hub */}
          <div className="relative">
            <div className="relative">
              {/* Main AI Healthcare Hub */}
              <div className="relative z-10 bg-gradient-to-br from-slate-900 via-teal-900 to-blue-900 rounded-3xl p-10 shadow-2xl overflow-hidden">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                    {[...Array(64)].map((_, i) => (
                      <div key={i} className="border border-teal-400/30"></div>
                    ))}
                  </div>
                </div>

                {/* AI Brain Circuit Animation */}
                <div className="relative w-full h-80 flex items-center justify-center mb-8">
                  {/* Center AI Icon */}
                  <div className="relative z-20">
                    <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                      <Bot className="w-16 h-16 text-white" />
                    </div>
                    
                    {/* Orbiting Elements */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <Activity className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '18s' }}>
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                          <Cpu className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '22s', animationDirection: 'reverse' }}>
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <Network className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pulsing Rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-4 border-teal-400/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-4 border-blue-400/20 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
                  </div>
                </div>
                
                <div className="text-center relative z-10">
                  <h3 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                    <Sparkles className="w-7 h-7 text-yellow-300 animate-pulse" />
                    AI Healthcare Intelligence
                  </h3>
                  <p className="text-teal-100 text-lg font-medium">
                    Next-generation medical assistance powered by advanced AI
                  </p>
                </div>
              </div>
              
              {/* Feature Cards */}
              <div className="mt-8 space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-5 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:border-teal-200"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      <feature.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border-2 border-teal-200 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">ISO Certified</div>
                    <div className="text-sm text-gray-600 font-medium">Quality Assured</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <Globe className="text-white" size={28} />
                  <div>
                    <div className="font-bold text-lg">Global Standards</div>
                    <div className="text-sm opacity-90">World-Class Care</div>
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 via-blue-400/20 to-purple-400/20 rounded-3xl blur-3xl transform rotate-6 scale-105 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.5;
          }
        }
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0);
          }
          50% { 
            transform: translateY(-10px);
          }
        }
        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  );
};

export default About;