import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Cloud, Upload, Download, Trash2, LogOut, File, Image as ImageIcon, FileText, FileVideo, Music, Archive, Loader2, FolderOpen, Search, ArrowUpDown, Eye, X, Share2, Check } from 'lucide-react';

const API_URL = 'https://cloudvault-czni.onrender.com/api/files';

function Dashboard({ setToken }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [previewFile, setPreviewFile] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchFiles = async () => {
    try {
      const res = await axios.get(API_URL, config);
      setFiles(res.data);
    } catch (err) {
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
      });
      fetchFiles();
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => uploadFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    uploadFile(e.dataTransfer.files[0]);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this file?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      fetchFiles();
    } catch (err) {
      setError('Delete failed');
    }
  };

  const handleShare = async (file) => {
    try {
      await navigator.clipboard.writeText(file.fileUrl);
      setCopiedId(file._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      setError('Could not copy link');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFileStyle = (type) => {
    if (!type) return { Icon: File, color: '#64748b', bg: '#f1f5f9' };
    if (type.startsWith('image/')) return { Icon: ImageIcon, color: '#16a34a', bg: '#dcfce7' };
    if (type.startsWith('video/')) return { Icon: FileVideo, color: '#9333ea', bg: '#f3e8ff' };
    if (type.startsWith('audio/')) return { Icon: Music, color: '#db2777', bg: '#fce7f3' };
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return { Icon: FileText, color: '#dc2626', bg: '#fee2e2' };
    if (type.includes('zip') || type.includes('rar')) return { Icon: Archive, color: '#ea580c', bg: '#ffedd5' };
    return { Icon: File, color: '#64748b', bg: '#f1f5f9' };
  };

  const canPreview = (type) => {
    if (!type) return false;
    return type.startsWith('image/') || type.includes('pdf');
  };

  const totalSize = files.reduce((sum, f) => sum + (f.fileSize || 0), 0);

  const displayedFiles = files
    .filter((f) => f.fileName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.fileName.localeCompare(b.fileName);
        case 'name-desc':
          return b.fileName.localeCompare(a.fileName);
        case 'size-asc':
          return (a.fileSize || 0) - (b.fileSize || 0);
        case 'size-desc':
          return (b.fileSize || 0) - (a.fileSize || 0);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'date-desc':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50">
      <nav className="bg-white/70 backdrop-blur border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-1.5 rounded-xl shadow-sm">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-indigo-950">CloudVault</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-white/60 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-indigo-950 mb-1">My Files</h1>
          <p className="text-sm text-slate-500">{files.length} files &middot; {formatSize(totalSize)} used</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mb-8 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${dragActive ? 'border-indigo-500 bg-indigo-50/60' : 'border-indigo-200 bg-white/50 hover:border-indigo-400 hover:bg-white/70'}`}
        >
          <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            ) : (
              <div className="bg-indigo-100 p-3 rounded-full">
                <Upload className="w-6 h-6 text-indigo-600" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-indigo-950">
                {uploading ? 'Uploading...' : 'Drop a file here, or click to browse'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Files are stored securely on AWS S3</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && files.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files by name..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>
            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2.5 text-sm bg-white border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition cursor-pointer text-slate-700"
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="size-desc">Largest first</option>
                <option value="size-asc">Smallest first</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="bg-white/70 border border-indigo-100 rounded-2xl p-12 text-center">
            <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-7 h-7 text-indigo-500" />
            </div>
            <h3 className="text-base font-medium text-indigo-950 mb-1">No files yet</h3>
            <p className="text-sm text-slate-500">Upload your first file to get started</p>
          </div>
        ) : displayedFiles.length === 0 ? (
          <div className="bg-white/70 border border-indigo-100 rounded-2xl p-12 text-center">
            <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-indigo-500" />
            </div>
            <h3 className="text-base font-medium text-indigo-950 mb-1">No matching files</h3>
            <p className="text-sm text-slate-500">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedFiles.map((file) => {
              const { Icon, color, bg } = getFileStyle(file.fileType);
              return (
                <div key={file._id} className="group bg-white border border-indigo-100 rounded-2xl p-4 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2.5 rounded-xl flex-shrink-0" style={{ backgroundColor: bg }}>
                      <Icon className="w-5 h-5" style={{ color: color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-900 truncate" title={file.fileName}>
                        {file.fileName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatSize(file.fileSize)} &middot; {formatDate(file.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-medium py-2 rounded-lg transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                    {canPreview(file.fileType) && (
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 px-3 rounded-lg transition"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleShare(file)}
                      className={`flex items-center justify-center py-2 px-3 rounded-lg transition ${copiedId === file._id ? 'bg-green-50 text-green-600' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'}`}
                      title="Copy share link"
                    >
                      {copiedId === file._id ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 py-2 px-3 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {previewFile && (
        <div
          onClick={() => setPreviewFile(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="text-sm font-medium text-slate-900 truncate pr-4" title={previewFile.fileName}>
                {previewFile.fileName}
              </h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center p-4">
              {previewFile.fileType?.startsWith('image/') ? (
                <img
                  src={previewFile.fileUrl}
                  alt={previewFile.fileName}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              ) : previewFile.fileType?.includes('pdf') ? (
                <iframe
                  src={previewFile.fileUrl}
                  title={previewFile.fileName}
                  className="w-full h-[70vh] rounded-lg bg-white"
                />
              ) : (
                <p className="text-sm text-slate-500 py-12">Preview not available for this file type</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
