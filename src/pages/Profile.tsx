import React from 'react';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    const filePath = `avatars/${user.id}/${file.name}`;
    const { data, error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (!error) {
      const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(publicUrl.publicUrl);
      await supabase.from('profiles').update({ avatar_url: publicUrl.publicUrl }).eq('id', user.id);
      setUser((prev) => prev ? { ...prev, avatar_url: publicUrl.publicUrl } : prev);
    }
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
    const filePath = `cvs/${user.id}/${file.name}`;
    const { data, error } = await supabase.storage.from('cvs').upload(filePath, file, { upsert: true });
    if (!error) {
      const { data: publicUrl } = supabase.storage.from('cvs').getPublicUrl(filePath);
      setCvUrl(publicUrl.publicUrl);
      await supabase.from('profiles').update({ cv_url: publicUrl.publicUrl }).eq('id', user.id);
      // Call analyze-resume function with the uploaded CV
      setParsing(true);
      setParseError(null);
      setParsedSkills([]);
      try {
        const response = await fetch('/functions/v1/analyze-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: `Analyze this CV and extract key skills. CV URL: ${publicUrl.publicUrl}` }),
        });
        if (!response.ok) throw new Error('Failed to analyze CV');
        const analysis = await response.json();
        setParsedSkills(analysis.keySkills || []);
      } catch (err: any) {
        setParseError(err.message || 'Failed to analyze CV');
      }
      setParsing(false);
    }
    setUploading(false);
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      {/* Onboarding/progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <div className="bg-green-500 h-4 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      {/* Avatar upload & preview */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400 border-2 border-gray-300 shadow">
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
          <Button
            size="sm"
            variant="outline"
            className="absolute bottom-0 right-0"
            onClick={() => avatarInputRef.current?.click()}
            disabled={avatarUploading}
          >
            {avatarUploading ? 'Uploading...' : 'Change'}
          </Button>
        </div>
        <div>
          {user ? (
            <>
              <p className="mb-1"><span className="font-semibold">Email:</span> {user.email}</p>
              {user.full_name && <p className="mb-1"><span className="font-semibold">Name:</span> {user.full_name}</p>}
            </>
          ) : (
            <div>Loading profile...</div>
          )}
        </div>
      </div>
      {/* Bio and Social Links */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">About You</h2>
        <textarea
          className="w-full border border-gray-300 rounded p-2 mb-2"
          placeholder="Add a short bio about yourself..."
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={3}
        />
        <div className="flex flex-col gap-2 mb-2">
          <Input
            type="url"
            placeholder="LinkedIn URL"
            value={linkedin}
            onChange={e => setLinkedin(e.target.value)}
          />
          <Input
            type="url"
            placeholder="GitHub URL"
            value={github}
            onChange={e => setGithub(e.target.value)}
          />
          <Input
            type="url"
            placeholder="Twitter URL"
            value={twitter}
            onChange={e => setTwitter(e.target.value)}
          />
          <Input
            type="url"
            placeholder="Personal Website"
            value={website}
            onChange={e => setWebsite(e.target.value)}
          />
        </div>
        <Button
          onClick={async () => {
            if (!user) return;
            setSavingProfile(true);
            await supabase.from('profiles').update({
              bio,
              linkedin,
              github,
              twitter,
              website,
            }).eq('id', user.id);
            setSavingProfile(false);
          }}
          disabled={savingProfile}
        >
          {savingProfile ? 'Saving...' : 'Save Bio & Links'}
        </Button>
      </div>

      {/* Skills management */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {skill}
              <button
                className="ml-1 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveSkill(skill)}
                aria-label={`Remove ${skill}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="w-40"
          />
          <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
            Add
          </Button>
        </div>
      </div>


        {cvUrl ? (
          <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            View Uploaded CV
          </a>
        ) : null}
        <div className="mt-2">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={handleCvUpload}
            disabled={uploading}
          />
          {uploading && <span className="ml-2 text-sm text-gray-500">Uploading...</span>}
        </div>
        {/* Show parsing status/errors */}
        {parsing && <div className="text-sm text-gray-700 mt-2">Analyzing CV for skills...</div>}
        {parseError && <div className="text-sm text-red-600 mt-2">{parseError}</div>}
        {/* Show extracted skills and allow adding to profile */}
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
  );
};

export default Profile;
