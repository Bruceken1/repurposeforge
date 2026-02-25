import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, Zap, TrendingUp, Moon, Sun } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { useToast } from '@/hooks/use-toast';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [usage, setUsage] = useState({ used: 0, limit: 5, remaining: 5 });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
    fetchUsage();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchProjects = async () => {
    try {
      const response = await apiServerClient.fetch('/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Fetch projects error:', error);
      toast({
        title: 'Failed to load projects',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsage = async () => {
    try {
      const response = await apiServerClient.fetch('/usage');
      if (!response.ok) throw new Error('Failed to fetch usage');
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error('Fetch usage error:', error);
    }
  };

  const stats = [
    {
      icon: FolderOpen,
      label: 'Total Projects',
      value: projects.length,
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      label: 'Daily Usage',
      value: `${usage.used}/${usage.limit}`,
      color: 'text-purple-500'
    },
    {
      icon: TrendingUp,
      label: 'Subscription',
      value: currentUser?.subscription_tier || 'Free',
      color: 'text-green-500'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{`Dashboard - RepurposeForge.ai`}</title>
        <meta name="description" content="Manage your content repurposing projects" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header showDarkModeToggle />

        <div className="container mx-auto px-4 py-8">
          {/* Header with Dark Mode Toggle */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
              <p className="text-gray-400">Manage your content repurposing projects</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="border-gray-700 hover:bg-gray-800"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-12 w-12 ${stat.color}`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* New Project Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <Button
              onClick={() => navigate('/upload')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Repurpose
            </Button>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
              <p className="text-gray-400 mt-4">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
              <FolderOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-gray-400 mb-6">Create your first project to start repurposing content</p>
              <Button
                onClick={() => navigate('/upload')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create First Project
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/20"
                  onClick={() => navigate(`/asset-preview/${project.id}`)}
                >
                  <h3 className="text-xl font-semibold mb-2">{project.title || 'Untitled Project'}</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Created {new Date(project.created_at || project.created).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full">
                      {project.status || 'Ready'}
                    </span>
                    <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-400">
                      View Assets →
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;