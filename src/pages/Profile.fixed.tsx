import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, Mail, MapPin, Link as LinkIcon, Github, Twitter, Globe, Upload, Plus, X, FileText, Camera } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  skills: string[];
  cv_url?: string;
  avatar_url?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [uploading, setUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [parsedSkills, setParsedSkills] = useState<string[]>([]);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showJobMatchPrompt, setShowJobMatchPrompt] = useState(false);
  
  // Editable profile fields
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    setAvatarUploading(true);
    const file = e.target.files[0];
    const filePath = `${user.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      console.error('Avatar upload error:', uploadError.message);
      alert('Avatar upload failed: ' + uploadError.message);
      setAvatarUploading(false);
      return;
    }
    const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setAvatarUrl(publicUrl.publicUrl);
    await supabase.from('profiles').update({ avatar_url: publicUrl.publicUrl }).eq('id', user.id);
    setUser((prev) => prev ? { ...prev, avatar_url: publicUrl.publicUrl } : prev);
    setAvatarUploading(false);
  };

  // Fetch user profile from Supabase
  const fetchProfile = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    // Fetch profile from 'profiles' table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    if (data) {
      setUser({
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        skills: data.skills || [],
        cv_url: data.cv_url,
        avatar_url: data.avatar_url,
        bio: data.bio,
        linkedin: data.linkedin,
        github: data.github,
        twitter: data.twitter,
        website: data.website,
      });
      setSkills(data.skills || []);
      setCvUrl(data.cv_url);
      setAvatarUrl(data.avatar_url);
      setFullName(data.full_name || '');
      setBio(data.bio || '');
      setLinkedin(data.linkedin || '');
      setGithub(data.github || '');
      setTwitter(data.twitter || '');
      setWebsite(data.website || '');
      // Calculate progress (profile, skills, CV, avatar, bio, social)
      let p = 0;
      if (data.full_name) p += 15;
      if (data.skills && data.skills.length > 0) p += 15;
      if (data.cv_url) p += 15;
      if (data.avatar_url) p += 15;
      if (data.bio) p += 15;
      if (data.linkedin || data.github || data.twitter || data.website) p += 15;
      if (p > 0) p += 10; // Base 10% for having an account
      setProgress(p);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Add skill
  const handleAddSkill = () => {
    if (!newSkill.trim() || !user) return;
    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    setNewSkill('');
    supabase.from('profiles').update({ skills: updatedSkills }).eq('id', user.id);
  };

  // Remove skill
  const handleRemoveSkill = (skill: string) => {
    if (!user) return;
    const updatedSkills = skills.filter(s => s !== skill);
    setSkills(updatedSkills);
    supabase.from('profiles').update({ skills: updatedSkills }).eq('id', user.id);
  };

  // Handle CV upload
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const filePath = `${user.id}/${file.name}`;
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage.from('cvs').upload(filePath, file, { upsert: true });
    if (uploadError) {
      console.error('CV upload error:', uploadError.message);
      alert('CV upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }
    
    // Get public URL
    const { data: publicUrl } = supabase.storage.from('cvs').getPublicUrl(filePath);
    setCvUrl(publicUrl.publicUrl);
    
    // Update profile with CV URL
    await supabase.from('profiles').update({ cv_url: publicUrl.publicUrl }).eq('id', user.id);
    
    // Parse CV for skills (simulated)
    setParsing(true);
    try {
      // In a real app, this would call an AI service to extract skills
      // For demo, we'll simulate with a timeout and predefined skills
      setTimeout(() => {
        const extractedSkills = ['JavaScript', 'React', 'Node.js', 'Communication', 'Project Management'];
        setParsedSkills(extractedSkills);
        setParsing(false);
        setShowJobMatchPrompt(true);
      }, 2000);
    } catch (error) {
      setParsing(false);
      setParseError('Failed to parse CV for skills');
    }
    
    setUploading(false);
  };

  // Save profile information
  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    
    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      bio,
      linkedin,
      github,
      twitter,
      website
    }).eq('id', user.id);
    
    if (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile: ' + error.message);
    } else {
      alert('Profile updated successfully!');
      fetchProfile(); // Refresh data
    }
    
    setSavingProfile(false);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar with profile summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border border-[var(--kenya-green)]/20 sticky top-24">
            {/* Profile avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--kenya-green)] mb-4">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[var(--kenya-green)]/10 flex items-center justify-center">
                      <User className="w-16 h-16 text-[var(--kenya-green)]/50" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-4 right-0 bg-[var(--kenya-green)] text-white p-2 rounded-full shadow-md hover:bg-[var(--kenya-green)]/90 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <h2 className="text-xl font-bold text-[var(--kenya-black)]">{fullName || 'Your Name'}</h2>
              {user?.email && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email}
                </div>
              )}
            </div>
            
            {/* Profile completion */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-[var(--kenya-green)]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--kenya-green)] to-[var(--kenya-black)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Navigation tabs */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'profile' ? 'bg-[var(--kenya-green)] text-white' : 'hover:bg-[var(--kenya-green)]/10 text-[var(--kenya-black)]'}`}
              >
                <User className="mr-3 h-5 w-5" />
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'skills' ? 'bg-[var(--kenya-green)] text-white' : 'hover:bg-[var(--kenya-green)]/10 text-[var(--kenya-black)]'}`}
              >
                <Briefcase className="mr-3 h-5 w-5" />
                Skills & Experience
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'documents' ? 'bg-[var(--kenya-green)] text-white' : 'hover:bg-[var(--kenya-green)]/10 text-[var(--kenya-black)]'}`}
              >
                <FileText className="mr-3 h-5 w-5" />
                Documents & CV
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 md:p-8 border border-[var(--kenya-green)]/20">
            {/* Personal Information Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-[var(--kenya-black)] border-b pb-2 border-[var(--kenya-green)]/20">Personal Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--kenya-black)] mb-1">Full Name</label>
                    <Input 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-[var(--kenya-green)]/20 focus:border-[var(--kenya-green)] focus:ring-[var(--kenya-green)]"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--kenya-black)] mb-1">Bio</label>
                    <textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-md border border-[var(--kenya-green)]/20 focus:border-[var(--kenya-green)] focus:ring-[var(--kenya-green)] p-2 min-h-[100px]"
                      placeholder="Tell us about yourself and your professional background"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--kenya-black)] mb-1">LinkedIn</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kenya-green)]" />
                        <Input 
                          value={linkedin} 
                          onChange={(e) => setLinkedin(e.target.value)}
                          className="pl-10 border-[var(--kenya-green)]/20 focus:border-[var(--kenya-green)] focus:ring-[var(--kenya-green)]"
                          placeholder="LinkedIn profile URL"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--kenya-black)] mb-1">GitHub</label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kenya-green)]" />
                        <Input 
                          value={github} 
                          onChange={(e) => setGithub(e.target.value)}
                          className="pl-10 border-[var(--kenya-green)]/20 focus:border-[var(--kenya-green)] focus:ring-[var(--kenya-green)]"
                          placeholder="GitHub profile URL"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--kenya-black)] mb-1">Twitter</label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kenya-green)]" />
                        <Input 
                          value={twitter} 
                          onChange={(e) => setTwitter(e.target.value)}
                          className="pl-10 border-[var(--kenya-green)]/20 focus:border-[var(--kenya-green)] focus:ring-[var(--kenya-green)]"
                          placeholder="Twitter profile URL"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--kenya-black)] mb-1">Website</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kenya-green)]" />
                        <Input 
                          value={website} 
                          onChange={(e) => setWebsite(e.target.value)}
                          className="pl-10 border-[var(--kenya-green)]/20 focus:border-[var(--kenya-green)] focus:ring-[var(--kenya-green)]"
                          placeholder="Personal website URL"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={savingProfile}
                      className="bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white"
                    >
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-[var(--kenya-black)] border-b pb-2 border-[var(--kenya-green)]/20">Skills & Experience</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--kenya-black)] mb-2">Your Skills</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill) => (
                      <div key={skill} className="flex items-center bg-[var(--kenya-green)]/10 text-[var(--kenya-black)] rounded-full px-3 py-1">
                        <span className="text-sm">{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-[var(--kenya-red)] hover:text-[var(--kenya-red)]/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {skills.length === 0 && (
                      <p className="text-sm text-muted-foreground">No skills added yet. Add some skills to improve your profile.</p>
                    )}
                  </div>
                  
                  <div className="flex">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a new skill"
                      className="border-[var(--kenya-green)]/20 focus:border-[var(--kenya-green)] focus:ring-[var(--kenya-green)]"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button
                      onClick={handleAddSkill}
                      className="ml-2 bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[var(--kenya-black)]">Skill Recommendations</h3>
                  <div className="bg-[var(--kenya-black)]/5 rounded-lg p-4">
                    <p className="text-sm mb-3">Based on the Kenyan job market, these skills are in high demand:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Digital Marketing', 'Data Analysis', 'Project Management', 'Sales', 'Customer Service'].map((skill) => (
                        <Button
                          key={skill}
                          variant="outline"
                          size="sm"
                          className="rounded-full border-[var(--kenya-green)] text-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/10"
                          onClick={() => {
                            if (!skills.includes(skill)) {
                              const updatedSkills = [...skills, skill];
                              setSkills(updatedSkills);
                              if (user) {
                                supabase.from('profiles').update({ skills: updatedSkills }).eq('id', user.id);
                              }
                            }
                          }}
                        >
                          {skills.includes(skill) ? `✓ ${skill}` : `+ ${skill}`}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-[var(--kenya-black)] border-b pb-2 border-[var(--kenya-green)]/20">Documents & CV</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-[var(--kenya-black)]">CV / Resume</h3>
                  
                  {cvUrl ? (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 bg-[var(--kenya-green)]/10 rounded-lg p-4 flex items-center">
                        <FileText className="h-8 w-8 text-[var(--kenya-green)] mr-3" />
                        <div>
                          <p className="font-medium text-[var(--kenya-black)]">CV Uploaded</p>
                          <a 
                            href={cvUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-[var(--kenya-green)] hover:underline"
                          >
                            View CV
                          </a>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (!user) return;
                          const filename = cvUrl.split('/').pop();
                          const filePath = `${user.id}/${filename}`;
                          const { error } = await supabase.storage.from('cvs').remove([filePath]);
                          if (!error) {
                            setCvUrl(undefined);
                            await supabase.from('profiles').update({ cv_url: null }).eq('id', user.id);
                          } else {
                            alert('Failed to delete CV: ' + error.message);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-[var(--kenya-black)]/5 rounded-lg p-6 text-center mb-4">
                      <FileText className="h-12 w-12 text-[var(--kenya-green)]/50 mx-auto mb-3" />
                      <p className="text-[var(--kenya-black)] font-medium mb-2">No CV Uploaded Yet</p>
                      <p className="text-sm text-muted-foreground mb-4">Upload your CV to improve your profile and enable AI skill extraction</p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" /> Upload CV
                      </Button>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    ref={fileInputRef}
                    onChange={handleCvUpload}
                    className="hidden"
                  />
                  
                  {uploading && (
                    <div className="mt-4 bg-[var(--kenya-green)]/10 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-6 h-6 border-2 border-[var(--kenya-green)] border-t-transparent rounded-full animate-spin mr-3"></div>
                        <p className="text-sm text-[var(--kenya-black)]">Uploading your CV...</p>
                      </div>
                    </div>
                  )}
                  
                  {parsing && (
                    <div className="mt-4 bg-[var(--kenya-green)]/10 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-6 h-6 border-2 border-[var(--kenya-green)] border-t-transparent rounded-full animate-spin mr-3"></div>
                        <p className="text-sm text-[var(--kenya-black)]">Analyzing your CV for skills...</p>
                      </div>
                    </div>
                  )}
                  
                  {parseError && (
                    <div className="mt-4 bg-[var(--kenya-red)]/10 text-[var(--kenya-red)] rounded-lg p-4">
                      <p className="text-sm">{parseError}</p>
                    </div>
                  )}
                  
                  {parsedSkills.length > 0 && (
                    <div className="mt-6 bg-[var(--kenya-green)]/10 rounded-lg p-4">
                      <h4 className="font-medium text-[var(--kenya-black)] mb-2">Skills Extracted from CV</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {parsedSkills.map((skill) => (
                          <Button
                            key={skill}
                            variant="outline"
                            size="sm"
                            className={`rounded-full ${skills.includes(skill) ? 'bg-[var(--kenya-green)] text-white' : 'border-[var(--kenya-green)] text-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/10'}`}
                            onClick={() => {
                              if (!skills.includes(skill) && user) {
                                const updatedSkills = [...skills, skill];
                                setSkills(updatedSkills);
                                supabase.from('profiles').update({ skills: updatedSkills }).eq('id', user.id);
                              }
                            }}
                          >
                            {skills.includes(skill) ? `✓ ${skill}` : `+ ${skill}`}
                          </Button>
                        ))}
                      </div>
                      <Button
                        className="w-full bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white"
                        onClick={() => navigate('/job-match')}
                      >
                        Find Job Matches Based on Your Skills
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Job Match Prompt Modal */}
      {showJobMatchPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-3 text-[var(--kenya-green)]">Skills Extracted Successfully!</h3>
            <p className="mb-4 text-[var(--kenya-black)]">Would you like to see job matches based on your skills?</p>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white"
                onClick={() => {
                  setShowJobMatchPrompt(false);
                  navigate('/job-match');
                }}
              >
                Find Matches
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setShowJobMatchPrompt(false)}
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
