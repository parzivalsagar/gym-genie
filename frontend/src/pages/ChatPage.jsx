import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { io } from 'socket.io-client';
import api from '../api/axios';

let socket = null;

function ChatPage() {
  const { isSignedIn, user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [online, setOnline] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isSignedIn) return;
    socket = io('http://localhost:5000', { transports: ['websocket', 'polling'] });
    socket.on('connect', () => { socket.emit('join', user.id); });
    socket.on('receiveMessage', (msg) => { setMessages(prev => [...prev, msg]); });
    socket.on('onlineUsers', (list) => setOnline(list));
    api.get('/admin/users').then(res => { setUsers(res.data.filter(u => u.clerkId !== user.id)); }).catch(() => {});
    return () => { if (socket) socket.disconnect(); };
  }, [isSignedIn, user]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (!selectedUser || !isSignedIn) return;
    api.get('/chat').then(res => {
      const filtered = res.data.filter(m => {
        const sender = m.senderId?._id || m.senderId;
        const receiver = m.receiverId?._id || m.receiverId;
        return (sender === selectedUser._id && receiver === user.id) || (sender === user.id && receiver === selectedUser._id);
      });
      setMessages(filtered);
    }).catch(() => {});
  }, [selectedUser, isSignedIn, user]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;
    try {
      const res = await api.post('/chat', { message: input, receiverId: selectedUser.clerkId });
      socket.emit('sendMessage', res.data);
      setMessages(prev => [...prev, { ...res.data, senderId: { _id: user.id, name: 'You' } }]);
      setInput('');
    } catch (err) { console.error('Send failed:', err.response?.data || err.message); }
  };

  const selectUser = (u) => { setSelectedUser(u); setSidebarOpen(false); };

  if (!isSignedIn) {
    return (
      <div className="py-8 sm:py-12 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>MESSAGES</h1>
          <p className="text-dark-400 text-sm mb-6">Sign in to start chatting with sellers.</p>
          <a href="/sign-in" className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">Sign In</a>
        </div>
      </div>
    );
  }

  const isMyMessage = (msg) => {
    const sender = msg.senderId?._id || msg.senderId;
    return sender === user.id || sender === user.username;
  };

  const UserList = ({ className = '' }) => (
    <div className={`flex flex-col ${className}`}>
      <div className="p-4 border-b border-border shrink-0">
        <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>USERS</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {users.length === 0 ? (
          <p className="text-[11px] text-dark-500 text-center py-4">No users yet</p>
        ) : users.map(u => (
          <button key={u._id} onClick={() => selectUser(u)} className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm flex items-center gap-2.5 transition-all ${selectedUser?._id === u._id ? 'bg-accent/10 text-accent border border-accent/20' : 'text-dark-300 hover:bg-dark-700 hover:text-white border border-transparent'}`}>
            <div className="w-8 h-8 rounded-full bg-dark-700 border border-border flex items-center justify-center shrink-0 text-xs font-semibold text-accent">{u.name?.charAt(0)?.toUpperCase() || '?'}</div>
            <span className="truncate flex-1">{u.name}</span>
            {online.includes(u.clerkId) && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-4 sm:py-6 max-w-5xl mx-auto flex gap-0 sm:gap-4" style={{ height: 'calc(100vh - 88px)', minHeight: '400px' }}>
      <div className="hidden sm:flex w-60 bg-surface border border-border rounded-xl overflow-hidden flex-shrink-0"><UserList /></div>

      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sm:hidden fixed bottom-20 left-4 z-30 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/30">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      </button>

      {sidebarOpen && <div className="sm:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      <div className={`sm:hidden fixed top-0 left-0 z-30 w-72 h-full bg-surface/80 backdrop-blur-xl border border-border transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>USERS</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-dark-400 hover:text-dark-100 hover:bg-dark-700 p-1 rounded-lg transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <UserList className="h-[calc(100%-57px)]" />
      </div>

      <div className="flex-1 bg-surface border border-border rounded-xl flex flex-col overflow-hidden min-w-0">
        {selectedUser ? (
          <>
            <div className="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
              <button onClick={() => setSidebarOpen(true)} className="sm:hidden text-dark-400 hover:text-dark-100 hover:bg-dark-700 p-1 rounded-lg transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg></button>
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent shrink-0">{selectedUser.name?.charAt(0)?.toUpperCase() || '?'}</div>
              <div className="min-w-0">
                <p className="font-semibold text-white text-sm truncate">{selectedUser.name}</p>
                <p className="text-[10px] text-dark-500">{online.includes(selectedUser.clerkId) ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && <p className="text-center text-dark-500 text-sm py-10">No messages yet. Say hello!</p>}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] sm:max-w-xs px-4 py-2.5 text-sm ${isMyMessage(msg) ? 'bg-accent text-white rounded-2xl rounded-br-md' : 'bg-dark-700 text-dark-100 border border-border rounded-2xl rounded-bl-md'}`}>
                    <p className="leading-relaxed">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${isMyMessage(msg) ? 'text-white/50' : 'text-dark-500'}`}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 sm:p-4 border-t border-border shrink-0">
              <div className="flex gap-2 sm:gap-3">
                <input type="text" placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} className="flex-1 bg-dark-800 border border-border rounded-lg px-3.5 py-2.5 text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all" />
                <button onClick={sendMessage} className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 shrink-0">Send</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-dark-500 px-4">
            <svg className="w-14 h-14 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
            <p className="text-sm">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
