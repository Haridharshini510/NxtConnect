import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Save, Sparkles, Plus, Trash2, ChevronDown, ChevronUp, Loader, AlertCircle, CheckCircle, Upload, Download } from 'lucide-react';

const SectionHeader = ({ title, open, onToggle }) => (
  <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-t-xl">
    <span className="font-semibold text-slate-800">{title}</span>
    {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
  </button>
);

export default function ResumeBuilder() {
  const [resume, setResume] = useState(null);
  const [loadingResume, setLoadingResume] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [downloadingUploadedPdf, setDownloadingUploadedPdf] = useState(false);
  const [openSection, setOpenSection] = useState('Personal Info');
  const [generatingBullet, setGeneratingBullet] = useState(null);
  const [bulletTask, setBulletTask] = useState({});

  useEffect(() => {
    api.get('/resume').then((r) => {
      setResume(r.data.resume);
      if (r.data.resume.aiAnalysis?.analyzedAt) setAnalysis(r.data.resume.aiAnalysis);
    }).catch(() => toast.error('Failed to load resume'))
      .finally(() => setLoadingResume(false));
  }, []);

  const persistResume = async (showToast = true) => {
    setSaving(true);
    try {
      const res = await api.put('/resume', resume);
      setResume(res.data.resume);
      if (showToast) toast.success('Resume saved!');
      return res.data.resume;
    } catch {
      toast.error('Failed to save');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    await persistResume(true);
  };

  const analyze = async () => {
    setAnalyzing(true);
    try {
      await api.put('/resume', resume); // save first
      const res = await api.post('/resume/analyze');
      setAnalysis(res.data.analysis);
      toast.success('AI analysis complete!');
    } catch (err) { toast.error(err.response?.data?.message || 'Analysis failed'); }
    finally { setAnalyzing(false); }
  };

  const uploadPdf = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') return toast.error('Please upload a PDF file');
    if (file.size > 5 * 1024 * 1024) return toast.error('PDF must be under 5MB');

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(res.data.resume);
      toast.success('Resume PDF uploaded and saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  const downloadUploadedPdf = async () => {
    if (!resume?.uploadedResume?.url && !resume?.uploadedResume?.publicId) {
      toast.error('No uploaded resume found');
      return;
    }

    setDownloadingUploadedPdf(true);
    let fileUrl = resume?.uploadedResume?.url || '';
    try {
      const signed = await api.get('/resume/uploaded-url');
      fileUrl = signed.data?.url || fileUrl;
      const outFileName = signed.data?.fileName || resume?.uploadedResume?.fileName || 'resume.pdf';
      if (!fileUrl) throw new Error('Missing signed download URL');

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Could not fetch uploaded resume');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Uploaded resume downloaded');
    } catch {
      if (fileUrl) {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
        toast.success('Opened uploaded resume');
      } else {
        toast.error('Failed to download uploaded resume');
      }
    } finally {
      setDownloadingUploadedPdf(false);
    }
  };

  const generateBullet = async (expIndex) => {
    const exp = resume.experience[expIndex];
    const task = bulletTask[expIndex];
    if (!task?.trim()) return toast.error('Describe what you did first');
    setGeneratingBullet(expIndex);
    try {
      const res = await api.post('/resume/generate-bullet', { role: exp.role, company: exp.company, task });
      const updated = [...resume.experience];
      updated[expIndex].bullets = [...(updated[expIndex].bullets || []), res.data.bullet];
      setResume({ ...resume, experience: updated });
      setBulletTask({ ...bulletTask, [expIndex]: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to generate'); }
    finally { setGeneratingBullet(null); }
  };

  const setInfo = (field, val) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, [field]: val } });
  const addExp = () => setResume({ ...resume, experience: [...(resume.experience || []), { company: '', role: '', location: '', duration: '', description: '', bullets: [] }] });
  const removeExp = (i) => setResume({ ...resume, experience: resume.experience.filter((_, idx) => idx !== i) });
  const setExp = (i, field, val) => { const e = [...resume.experience]; e[i] = { ...e[i], [field]: val }; setResume({ ...resume, experience: e }); };
  const addEdu = () => setResume({ ...resume, education: [...(resume.education || []), { institution: '', degree: '', field: '', year: '', cgpa: '' }] });
  const removeEdu = (i) => setResume({ ...resume, education: resume.education.filter((_, idx) => idx !== i) });
  const setEdu = (i, field, val) => { const e = [...resume.education]; e[i] = { ...e[i], [field]: val }; setResume({ ...resume, education: e }); };
  const addProj = () => setResume({ ...resume, projects: [...(resume.projects || []), { name: '', description: '', techStack: [], link: '' }] });
  const removeProj = (i) => setResume({ ...resume, projects: resume.projects.filter((_, idx) => idx !== i) });
  const setProj = (i, field, val) => { const p = [...resume.projects]; p[i] = { ...p[i], [field]: val }; setResume({ ...resume, projects: p }); };


  if (loadingResume) {
    return (
      <main className="max-w-5xl mr-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="section-headline">Resume builder</h1>
            <p className="section-subtle">Build your resume section by section and get AI feedback.</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="card flex h-40 items-center justify-center text-slate-500">
              <Loader className="animate-spin mr-2" />
              Loading resume...
            </div>
            <div className="card h-64" />
          </div>
          <div className="card h-52" />
        </div>
      </main>
    );
  }

  if (!resume) {
    return (
      <main className="max-w-5xl mr-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <div className="card flex h-40 items-center justify-center text-slate-500">
          Could not load resume data.
        </div>
      </main>
    );
  }

  const toggle = (s) => setOpenSection(openSection === s ? '' : s);
  const inp = "input text-sm";

  return (
    <main className="max-w-5xl mr-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-headline">Resume builder</h1>
          <p className="section-subtle">Build your resume section by section and get AI feedback.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="btn-secondary flex items-center gap-2 text-sm">
            <Save size={15} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={analyze} disabled={analyzing} className="btn-primary flex items-center gap-2 text-sm">
            <Sparkles size={15} /> {analyzing ? 'Analyzing...' : 'AI Analyze'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Builder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">Resume PDF (optional)</p>
                <p className="text-xs text-slate-500 leading-relaxed">Upload a PDF or continue filling the form below. AI can analyze either.</p>
                {resume.uploadedResume?.fileName && (
                  <p className="text-xs text-slate-600 mt-1">
                    Uploaded: <span className="font-medium">{resume.uploadedResume.fileName}</span>
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center sm:justify-end sm:ml-auto">
                <label className="btn-secondary text-sm inline-flex items-center gap-2 cursor-pointer">
                  {uploadingPdf ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    disabled={uploadingPdf}
                    onChange={(e) => uploadPdf(e.target.files?.[0])}
                  />
                </label>
                <button
                  type="button"
                  onClick={downloadUploadedPdf}
                  disabled={!resume.uploadedResume?.url || downloadingUploadedPdf}
                  className="btn-secondary text-sm inline-flex items-center gap-2"
                >
                  {downloadingUploadedPdf ? <Loader size={14} className="animate-spin" /> : <Download size={14} />}
                  {downloadingUploadedPdf ? 'Downloading...' : 'Download PDF'}
                </button>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="card p-0 overflow-hidden">
            <SectionHeader title="Personal information" open={openSection === 'Personal Info'} onToggle={() => toggle('Personal Info')} />
            {openSection === 'Personal Info' && (
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                {[['name','Full Name'],['email','Email'],['phone','Phone'],['location','Location'],['linkedin','LinkedIn URL'],['github','GitHub URL'],['portfolio','Portfolio URL']].map(([f, label]) => (
                  <div key={f}>
                    <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
                    <input className={inp} value={resume.personalInfo?.[f] || ''} onChange={(e) => setInfo(f, e.target.value)} placeholder={label} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card p-0 overflow-hidden">
            <SectionHeader title="Professional summary" open={openSection === 'Summary'} onToggle={() => toggle('Summary')} />
            {openSection === 'Summary' && (
              <div className="p-5">
                <textarea className={`${inp} resize-none`} rows={4} maxLength={1000}
                  placeholder="A brief 3-4 sentence summary of your skills, goals, and what you bring to the table..."
                  value={resume.summary || ''}
                  onChange={(e) => setResume({ ...resume, summary: e.target.value })} />
                <p className="text-xs text-slate-400 mt-1 text-right">{(resume.summary || '').length}/1000</p>
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="card p-0 overflow-hidden">
            <SectionHeader title="Experience" open={openSection === 'Experience'} onToggle={() => toggle('Experience')} />
            {openSection === 'Experience' && (
              <div className="p-5 space-y-6">
                {(resume.experience || []).map((exp, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800">Experience #{i + 1}</span>
                      <button onClick={() => removeExp(i)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[['role','Job Title'],['company','Company'],['location','Location'],['duration','Duration (e.g. Jun 2023 – Present)']].map(([f, label]) => (
                        <div key={f}>
                          <label className="block text-xs text-slate-600 mb-1">{label}</label>
                          <input className={inp} value={exp[f] || ''} onChange={(e) => setExp(i, f, e.target.value)} placeholder={label} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Description</label>
                      <textarea className={`${inp} resize-none`} rows={2} value={exp.description || ''} onChange={(e) => setExp(i, 'description', e.target.value)} placeholder="Brief overview of your role..." />
                    </div>
                    {/* Bullet points */}
                    {exp.bullets?.length > 0 && (
                      <div className="space-y-1">
                        {exp.bullets.map((b, bi) => (
                          <div key={bi} className="flex items-start gap-2 text-sm">
                            <span className="text-primary-400 mt-1">•</span>
                            <span className="flex-1 text-slate-800">{b}</span>
                            <button onClick={() => { const e = [...resume.experience]; e[i].bullets = e[i].bullets.filter((_, x) => x !== bi); setResume({ ...resume, experience: e }); }}
                              className="text-slate-400 hover:text-red-400 flex-shrink-0"><Trash2 size={12} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* AI bullet generator */}
                    <div className="bg-primary-50 rounded-lg p-3 space-y-2">
                      <p className="text-xs font-medium text-primary-700 flex items-center gap-1"><Sparkles size={12} /> AI Bullet Generator</p>
                      <input className={inp} placeholder="Describe what you did (e.g. built a REST API for user auth)"
                        value={bulletTask[i] || ''} onChange={(e) => setBulletTask({ ...bulletTask, [i]: e.target.value })} />
                      <button onClick={() => generateBullet(i)} disabled={generatingBullet === i}
                        className="btn-primary text-xs flex items-center gap-1 py-1.5">
                        {generatingBullet === i ? <><Loader size={11} className="animate-spin" /> Generating...</> : <><Sparkles size={11} /> Generate Bullet</>}
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addExp} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                  <Plus size={15} /> Add Experience
                </button>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="card p-0 overflow-hidden">
            <SectionHeader title="Education" open={openSection === 'Education'} onToggle={() => toggle('Education')} />
            {openSection === 'Education' && (
              <div className="p-5 space-y-4">
                {(resume.education || []).map((edu, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800">Education #{i + 1}</span>
                      <button onClick={() => removeEdu(i)} className="text-slate-400 hover:text-red-400"><Trash2 size={15} /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[['institution','Institution'],['degree','Degree'],['field','Field of Study'],['year','Year'],['cgpa','CGPA / Percentage']].map(([f, label]) => (
                        <div key={f}>
                          <label className="block text-xs text-slate-600 mb-1">{label}</label>
                          <input className={inp} value={edu[f] || ''} onChange={(e) => setEdu(i, f, e.target.value)} placeholder={label} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={addEdu} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                  <Plus size={15} /> Add Education
                </button>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="card p-0 overflow-hidden">
            <SectionHeader title="Skills" open={openSection === 'Skills'} onToggle={() => toggle('Skills')} />
            {openSection === 'Skills' && (
              <div className="p-5">
                <label className="block text-xs font-medium text-slate-700 mb-2">Skills (comma separated)</label>
                <input className={inp} placeholder="React, Node.js, Python, MongoDB, Figma..."
                  value={(resume.skills || []).join(', ')}
                  onChange={(e) => setResume({ ...resume, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
                <div className="flex flex-wrap gap-2 mt-3">
                  {(resume.skills || []).map((s) => (
                    <span key={s} className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                      {s}
                      <button onClick={() => setResume({ ...resume, skills: resume.skills.filter((sk) => sk !== s) })}><Trash2 size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="card p-0 overflow-hidden">
            <SectionHeader title="Projects" open={openSection === 'Projects'} onToggle={() => toggle('Projects')} />
            {openSection === 'Projects' && (
              <div className="p-5 space-y-4">
                {(resume.projects || []).map((proj, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800">Project #{i + 1}</span>
                      <button onClick={() => removeProj(i)} className="text-slate-400 hover:text-red-400"><Trash2 size={15} /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div><label className="block text-xs text-slate-600 mb-1">Project Name</label><input className={inp} value={proj.name || ''} onChange={(e) => setProj(i, 'name', e.target.value)} /></div>
                      <div><label className="block text-xs text-slate-600 mb-1">Live / GitHub Link</label><input className={inp} value={proj.link || ''} onChange={(e) => setProj(i, 'link', e.target.value)} /></div>
                    </div>
                    <div><label className="block text-xs text-slate-600 mb-1">Description</label>
                      <textarea className={`${inp} resize-none`} rows={2} value={proj.description || ''} onChange={(e) => setProj(i, 'description', e.target.value)} /></div>
                    <div><label className="block text-xs text-slate-600 mb-1">Tech Stack (comma separated)</label>
                      <input className={inp} value={(proj.techStack || []).join(', ')} onChange={(e) => setProj(i, 'techStack', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} /></div>
                  </div>
                ))}
                <button onClick={addProj} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                  <Plus size={15} /> Add Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Analysis sidebar */}
        <div className="space-y-4">
          {analyzing && (
            <div className="card text-center py-8">
              <Loader size={32} className="animate-spin text-primary-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-800">Analyzing your resume...</p>
              <p className="text-xs text-slate-400 mt-1">This usually takes 10-20 seconds</p>
            </div>
          )}

          {!analyzing && !analysis && (
            <div className="card text-center py-8 border-dashed border-2 border-slate-200">
              <Sparkles size={32} className="text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">No analysis yet</p>
              <p className="text-xs text-slate-400 mt-1">Upload a PDF or fill in your resume, then click "AI Analyze"</p>
            </div>
          )}

          {analysis && !analyzing && (
            <>
              {/* Score card */}
              <div className="card text-center">
                <p className="text-xs text-slate-400 uppercase font-medium mb-2">Overall Score</p>
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                      stroke={analysis.overallScore >= 70 ? '#22c55e' : analysis.overallScore >= 50 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="3" strokeDasharray={`${analysis.overallScore}, 100`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">{analysis.overallScore}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{analysis.summary}</p>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-1">ATS Score</p>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${analysis.atsScore}%` }} />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{analysis.atsScore}/100</p>
                </div>
              </div>

              {/* Strengths */}
              {analysis.strengths?.length > 0 && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><CheckCircle size={15} className="text-green-500" /> Strengths</h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {analysis.improvements?.length > 0 && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><AlertCircle size={15} className="text-orange-500" /> Improvements</h3>
                  <ul className="space-y-2">
                    {analysis.improvements.map((s, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2"><span className="text-orange-400 mt-0.5">→</span>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Keywords */}
              {analysis.missingKeywords?.length > 0 && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((k) => (
                      <span key={k} className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ATS Tips */}
              {analysis.atsTips?.length > 0 && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">ATS Tips</h3>
                  <ul className="space-y-2">
                    {analysis.atsTips.map((t, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2"><span className="text-primary-400 mt-0.5">•</span>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-slate-400 text-center">
                Analyzed from {analysis.source === 'pdf' ? 'uploaded PDF' : 'form data'} on {new Date(analysis.analyzedAt).toLocaleString()}
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}







