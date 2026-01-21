
import React from 'react';
import Button from './ui/Button';

interface RoleChatModalProps {
  role: string;
  category: string;
  onClose: () => void;
}

interface RoleInfo {
  description: string;
  skills: string[];
  salary: string;
  demand: 'Moderate' | 'High' | 'Very High' | 'Explosive' | 'Stable' | 'Growing';
}

const ROLE_DATABASE: Record<string, Record<string, RoleInfo>> = {
  'Development': {
    'Full-Stack': {
      description: "You are the Swiss Army knife of development. You build both the user-facing interface and the server-side logic that powers it. You'll work with databases, APIs, and frontend frameworks to deliver complete web applications.",
      skills: ["React/Next.js", "Node.js", "SQL & NoSQL", "System Design", "Cloud Basics"],
      salary: "₹8L - ₹24L",
      demand: "Very High"
    },
    'Backend': {
      description: "The engine room of software. You design and build the core logic, databases, and APIs that make applications function. Performance, scalability, and security are your main concerns.",
      skills: ["Java/Python/Go", "PostgreSQL", "Redis", "Microservices", "API Design"],
      salary: "₹10L - ₹28L",
      demand: "High"
    },
    'Frontend': {
      description: "You shape how the world interacts with the web. You translate designs into responsive, high-performance code, ensuring seamless user experiences across all devices.",
      skills: ["React/Vue", "TypeScript", "Tailwind CSS", "Web Performance", "State Mgmt"],
      salary: "₹6L - ₹20L",
      demand: "High"
    },
    'Mobile': {
      description: "You put the product in the user's pocket. Whether native (iOS/Android) or cross-platform, you build performant mobile apps with smooth animations and offline capabilities.",
      skills: ["Flutter/React Native", "Swift/Kotlin", "Mobile Lifecycle", "App Publishing"],
      salary: "₹8L - ₹22L",
      demand: "High"
    },
    'SDET': {
      description: "You write code to break code. As a Software Development Engineer in Test, you build automated testing frameworks to ensure software reliability and quality before release.",
      skills: ["Selenium/Cypress", "Java/Python", "CI/CD Pipelines", "API Testing", "JMeter"],
      salary: "₹7L - ₹18L",
      demand: "Moderate"
    }
  },
  'Data Science': {
    'Analyst': {
      description: "You turn raw data into business answers. Using statistical tools and visualization, you identify trends and provide actionable insights to stakeholders.",
      skills: ["SQL", "Excel (Advanced)", "Tableau/PowerBI", "Python (Pandas)", "Statistics"],
      salary: "₹5L - ₹12L",
      demand: "High"
    },
    'Data Scientist': {
      description: "You predict the future with data. Using machine learning and advanced statistics, you build models to solve complex business problems like recommendation engines or fraud detection.",
      skills: ["Python/R", "Machine Learning", "TensorFlow/Scikit", "NLP", "Math/Stats"],
      salary: "₹12L - ₹35L",
      demand: "Very High"
    },
    'BI Analyst': {
      description: "You bridge the gap between data and strategy. You design and maintain business intelligence dashboards that track key performance indicators for the organization.",
      skills: ["PowerBI", "SQL", "Data Warehousing", "ETL Processes", "Business Acumen"],
      salary: "₹6L - ₹15L",
      demand: "Stable"
    },
    'ML Engineer': {
      description: "You bring AI to production. You take experimental models and deploy them into scalable, real-world applications using robust engineering practices.",
      skills: ["ML Ops", "Docker/K8s", "Python", "Model Deployment", "Cloud Platforms"],
      salary: "₹15L - ₹40L",
      demand: "Explosive"
    },
    'Data Engineer': {
      description: "You are the plumber of big data. You design and build the pipelines that collect, store, and process massive amounts of data for analysis.",
      skills: ["Spark/Hadoop", "Kafka", "SQL/NoSQL", "Python/Scala", "Data Lakes"],
      salary: "₹10L - ₹30L",
      demand: "High"
    }
  },
  'Cloud': {
    'DevOps': {
      description: "You remove the friction between coding and deployment. You automate infrastructure, manage CI/CD pipelines, and ensure smooth delivery of software.",
      skills: ["Jenkins/GitHub Actions", "Docker", "Kubernetes", "Terraform", "Linux"],
      salary: "₹10L - ₹25L",
      demand: "High"
    },
    'Cloud Engineer': {
      description: "You architect the cloud. You design secure, scalable, and cost-effective cloud infrastructure on platforms like AWS, Azure, or Google Cloud.",
      skills: ["AWS/Azure/GCP", "Networking", "IAM Security", "Serverless", "Cost Mgmt"],
      salary: "₹8L - ₹22L",
      demand: "High"
    },
    'SRE': {
      description: "You keep the lights on. Site Reliability Engineers treat operations as a software problem, ensuring large-scale systems remain reliable and efficient.",
      skills: ["Go/Python", "Prometheus/Grafana", "Incident Response", "Distributed Systems"],
      salary: "₹18L - ₹45L",
      demand: "High"
    },
    'Platform Engineer': {
      description: "You build the internal tools for other developers. You create self-service platforms that allow product teams to ship code faster and more safely.",
      skills: ["Kubernetes", "Golang", "Infrastructure as Code", "System Architecture"],
      salary: "₹15L - ₹35L",
      demand: "Growing"
    }
  },
  'Security': {
    'Analyst': {
      description: "You are the guardian of the network. You monitor security alerts, investigate suspicious activities, and configure firewalls to protect organizational assets.",
      skills: ["SIEM Tools", "Network Security", "Incident Handling", "CompTIA Security+"],
      salary: "₹6L - ₹15L",
      demand: "High"
    },
    'Pen Tester': {
      description: "You are the ethical hacker. You simulate cyberattacks on your own organization's systems to find and fix vulnerabilities before the bad guys do.",
      skills: ["Metasploit", "Burp Suite", "Python Scripting", "OWASP Top 10", "Networking"],
      salary: "₹10L - ₹28L",
      demand: "High"
    },
    'Consultant': {
      description: "You are the security advisor. You help organizations assess their risk posture, ensure compliance with regulations, and design security roadmaps.",
      skills: ["Risk Assessment", "ISO 27001", "Governance", "Communication", "Auditing"],
      salary: "₹12L - ₹30L",
      demand: "Moderate"
    },
    'Responder': {
      description: "You are the digital firefighter. When a breach occurs, you are the first on the scene to contain the threat, analyze the attack, and restore operations.",
      skills: ["Digital Forensics", "Malware Analysis", "Log Analysis", "Crisis Mgmt"],
      salary: "₹10L - ₹25L",
      demand: "High"
    }
  }
};

const RoleChatModal: React.FC<RoleChatModalProps> = ({ role, category, onClose }) => {
  const categoryData = ROLE_DATABASE[category];
  const data = categoryData ? categoryData[role] : null;

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 p-8 border-b border-gray-100 flex justify-between items-start">
          <div>
             <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-3">
               {category}
             </div>
             <h3 className="font-serif text-4xl text-slate-900">{role}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-slate-900 hover:border-gray-300 flex items-center justify-center transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto">
          
          <div className="mb-10">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">What you'll do</h4>
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              {data.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-10">
             <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Key Skillset</h4>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
             </div>
             
             <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Market Demand</h4>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${data.demand === 'Very High' || data.demand === 'Explosive' ? 'bg-green-500' : 'bg-primary'}`}></div>
                    <span className="text-slate-900 font-serif text-xl">{data.demand}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Avg. Salary (Entry-Mid)</h4>
                  <span className="text-slate-900 font-serif text-xl">{data.salary}</span>
                </div>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-slate-50 flex justify-end">
           <Button onClick={onClose} variant="primary" className="w-full md:w-auto px-8 rounded-xl">
             Got it
           </Button>
        </div>

      </div>
    </div>
  );
};

export default RoleChatModal;
