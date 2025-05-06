import React from 'react';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

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
  useEffect(() => {
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
        if (data.linkedin || data.github || data.twitter || data.website) p += 25;
        setProgress(p);
      }
    };
    fetchProfile();
  }, []);

  // Add skill
  const handleAddSkill = async () => {
    if (!newSkill.trim() || !user) return;
    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    setNewSkill('');
    await supabase.from('profiles').update({ skills: updatedSkills }).eq('id', user.id);
  };

  // Remove skill
  const handleRemoveSkill = async (skill: string) => {
    if (!user) return;
    const updatedSkills = skills.filter((s) => s !== skill);
    setSkills(updatedSkills);
    await supabase.from('profiles').update({ skills: updatedSkills }).eq('id', user.id);
  };

  // Handle CV upload
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const filePath = `${user.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage.from('cvs').upload(filePath, file, { upsert: true });
    if (uploadError) {
      console.error('CV upload error:', uploadError.message);
      alert('CV upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }
    const { data: publicUrl } = supabase.storage.from('cvs').getPublicUrl(filePath);
    setCvUrl(publicUrl.publicUrl);
    await supabase.from('profiles').update({ cv_url: publicUrl.publicUrl }).eq('id', user.id);
    // Call analyze-resume function with the uploaded CV
    setParsing(true);
    setParseError(null);
    setParsedSkills([]);
    try {
      // Use environment variable for the analyze-resume endpoint, fallback to Supabase Edge Function URL
      const analyzeResumeEndpoint = import.meta.env.VITE_ANALYZE_RESUME_URL || 'https://<project-ref>.functions.supabase.co/analyze-resume';
      const response = await fetch(analyzeResumeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  messages: [
    {
      role: "user",
      content: `Analyze this CV and extract key skills. CV URL: ${publicUrl.publicUrl}\nRespond ONLY in the following JSON format:\n{\n  \"strengths\": [array of strings],\n  \"weaknesses\": [array of strings],\n  \"suggestedImprovements\": [array of strings],\n  \"keySkills\": [array of strings]\n}\nDo not include any explanation or text outside the JSON.`
    }
  ]
}),
      });
      if (!response.ok) throw new Error('Failed to analyze CV: ' + response.statusText);
      const analysis = await response.json();
      const newSkills = analysis.keySkills || [];
      setParsedSkills(newSkills);
      // Save extracted skills to user profile
      if (user && newSkills.length > 0) {
        try {
          await supabase.from('profiles').update({ skills: newSkills }).eq('id', user.id);
          setSkills(newSkills);
          setShowJobMatchPrompt(true);
        } catch (saveErr: any) {
          alert('Failed to save extracted skills to your profile: ' + (saveErr.message || saveErr));
        }
      }
    } catch (err: any) {
      setParseError(err.message || 'Failed to analyze CV');
    }
    setParsing(false);
    setUploading(false);
  };

  // State for Job Match redirect prompt
  const [showJobMatchPrompt, setShowJobMatchPrompt] = useState(false);

  return (
  <div className="container mx-auto py-10 max-w-2xl">
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 md:p-10 border border-zinc-200 dark:border-zinc-800">
      <h1 className="text-3xl font-extrabold mb-6 text-center tracking-tight">Profile</h1>
      {/* Profile Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Profile Completion</span>
          <span className="text-xs font-semibold text-green-600">{progress}%</span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3">
          <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      {/* Avatar Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative group">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-green-500 shadow-lg transition-all duration-300"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-5xl text-zinc-400 border-4 border-green-500 shadow-lg">
              <span role="img" aria-label="Avatar">👤</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={avatarInputRef}
            onChange={handleAvatarUpload}
            className="hidden"
            disabled={avatarUploading}
          />
          <button
            type="button"
            className="absolute bottom-2 right-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full px-3 py-1 text-xs font-semibold shadow hover:bg-green-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => avatarInputRef.current?.click()}
            disabled={avatarUploading}
            aria-label="Upload profile image"
          >
            {avatarUploading ? 'Uploading...' : 'Change'}
          </button>
          {avatarUrl && (
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs font-semibold shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={async () => {
                if (!user) return;
                const filename = avatarUrl.split('/').pop();
                const filePath = `${user.id}/${filename}`;
                const { error } = await supabase.storage.from('avatars').remove([filePath]);
                if (!error) {
                  setAvatarUrl(undefined);
                  await supabase.from('profiles').update({ avatar_url: null }).eq('id', user.id);
                  setUser((prev) => prev ? { ...prev, avatar_url: undefined } : prev);
                } else {
                  alert('Failed to delete avatar: ' + error.message);
                }
              }}
              aria-label="Delete profile image"
            >
              Delete
            </button>
          )}
        </div>
        <div className="flex-1 w-full">
          {user ? (
            <>
              <div className="mb-2 text-zinc-800 dark:text-zinc-200 font-semibold text-lg">{user.full_name || fullName || 'Your Name'}</div>
              <div className="mb-2 text-zinc-500 dark:text-zinc-400 text-sm">{user.email}</div>
            </>
          ) : (
            <div className="text-zinc-400">Loading profile...</div>
          )}
        </div>
      </div>
      {/* Name, Bio & Social Links Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><span>About You</span></h2>
        <Input
          type="text"
          placeholder="Your Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="mb-2"
          aria-label="Full Name"
          autoComplete="name"
        />
        <div className="text-xs text-zinc-500 mb-2">Enter your full name as you want it to appear on your profile. This will be visible to employers and in your job applications.</div>
        <textarea
          className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg p-3 mb-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          placeholder="Add a short bio about yourself..."
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={3}
          aria-label="Short bio"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
          <Input
            type="url"
            placeholder="LinkedIn URL"
            value={linkedin}
            onChange={e => setLinkedin(e.target.value)}
            aria-label="LinkedIn URL"
          />
          <Input
            type="url"
            placeholder="GitHub URL"
            value={github}
            onChange={e => setGithub(e.target.value)}
            aria-label="GitHub URL"
          />
          <Input
            type="url"
            placeholder="Twitter URL"
            value={twitter}
            onChange={e => setTwitter(e.target.value)}
            aria-label="Twitter URL"
          />
          <Input
            type="url"
            placeholder="Personal Website"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            aria-label="Personal Website"
          />
        </div>
        <Button
          onClick={async () => {
            if (!user) return;
            setSavingProfile(true);
            await supabase.from('profiles').update({
              full_name: fullName,
              bio,
              linkedin,
              github,
              twitter,
              website,
            }).eq('id', user.id);
            setSavingProfile(false);
          }}
          disabled={savingProfile}
          className="mt-2 w-full md:w-auto"
        >
          {savingProfile ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
      {/* Skills Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><span>Skills</span></h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.length === 0 && <span className="text-zinc-400">No skills added yet.</span>}
          {skills.map((skill) => (
            <span key={skill} className="bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              {skill}
              <button
                type="button"
                className="ml-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                onClick={() => handleRemoveSkill(skill)}
                aria-label={`Remove skill ${skill}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a skill"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddSkill(); }}
            className="flex-grow"
            aria-label="Add skill"
          />
          <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>Add</Button>
        </div>
      </div>

      {/* Loading Bar/Spinner Overlay for CV Analysis */}
      {parsing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 flex flex-col items-center w-80">
            <div className="mb-4">
              <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
            <div className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">Analyzing your CV...</div>
            <div className="text-zinc-600 dark:text-zinc-200 text-sm text-center">Extracting your skills and applying job match. Please wait...</div>
            <div className="w-full bg-zinc-200 rounded-full h-2 mt-6">
              <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Job Match Redirect Prompt */}
      {showJobMatchPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 max-w-md w-full flex flex-col items-center">
            <h3 className="text-lg font-bold mb-3 text-green-700 dark:text-green-300">Skills extracted and saved!</h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-200">Would you like to see job matches based on your new skills?</p>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/job-match')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Go to Job Match
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowJobMatchPrompt(false)}
              >
                Stay on Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CV Upload Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><span>CV / Resume</span></h2>
        {cvUrl ? (
          <div className="flex items-center gap-2">
            <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-medium">
              View Uploaded CV
            </a>
            <button
              type="button"
              className="bg-red-600 text-white rounded-full px-2 py-1 text-xs font-semibold shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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
              aria-label="Delete CV"
            >
              Delete
            </button>
          </div>
        ) : null}
        <div className="mt-2 flex items-center gap-2">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={handleCvUpload}
            disabled={uploading}
            aria-label="Upload CV"
            className="border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 bg-zinc-50 dark:bg-zinc-800"
          />
          {uploading && <span className="ml-2 text-sm text-zinc-500">Uploading...</span>}
        </div>
        {parsing && <div className="text-sm text-zinc-700 dark:text-zinc-200 mt-2">Analyzing CV for skills...</div>}
        {parseError && <div className="text-sm text-red-600 mt-2">{parseError}</div>}
        {parsedSkills.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Skills extracted from CV:</h3>
            <div className="flex flex-wrap gap-2">
              {parsedSkills.map((skill) => (
                <Button
                  key={skill}
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  onClick={async () => {
                    if (!user) return;
                    const updatedSkills = [...skills, skill];
                    setSkills(updatedSkills);
                    await supabase.from('profiles').update({ skills: updatedSkills }).eq('id', user.id);
                  }}
                  disabled={skills.includes(skill)}
                >
                  {skills.includes(skill) ? `Added: ${skill}` : `Add: ${skill}`}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default Profile;
