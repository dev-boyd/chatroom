import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

initializeApp({
    apiKey: "AIzaSyBtxbKsl1mIZJ1uzIV4Zaiedvz9_qs9aro",

    authDomain: "chatapp-5bd40.firebaseapp.com",

    projectId: "chatapp-5bd40",

    storageBucket: "chatapp-5bd40.appspot.com",

    messagingSenderId: "217848818133",

    appId: "1:217848818133:web:eea2fe727ca0d37c9cb55c"

});

const auth = getAuth();
const firestore = getFirestore();

function App() {
    const [user, setUser] = useState(auth.currentUser);
    const [messages, setMessages] = useState([]);
    const [formValue, setFormValue] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const messagesRef = collection(firestore, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt'), limit(25));

    const dummy = useRef();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            if (user) {
                // Fetch messages when the user is authenticated
                const messagesQuery = query(messagesRef, orderBy('createdAt'), limit(25));
                const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
                    setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                });
                return () => unsubscribeMessages();
            } else {
                // Clear messages when the user logs out
                setMessages([]);
            }
        });
        return unsubscribe;
    }, [messagesRef]);


    const fetchMessages = async () => {
        try {
            const snapshot = await messagesQuery.get();
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!user) return; // Do not send message if user is not signed in
        const { uid } = user;

        try {
            // Add the message to Firestore
            await addDoc(messagesRef, {
                text: formValue,
                createdAt: serverTimestamp(),
                uid
            });

            // Clear the input field after sending
            setFormValue('');
            console.log("sent")
            fetchMessages();
            // Scroll to the bottom of the message list
            dummy.current.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            await setUser(user);
            fetchMessages();
            // Scroll to the bottom of the message list
            dummy.current.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    const signInWithEmailAndPasswordHandler = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setUser(user);
            await setUser(user);
            fetchMessages();
            // Scroll to the bottom of the message list
            dummy.current.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error signing in with email and password', error);
        }
    };

    const signUpWithEmailAndPasswordHandler = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setUser(user);
        } catch (error) {
            console.error('Error signing up with email and password', error);
        }
    };

    const signOutUser = () => {
        signOut(auth).then(() => {
            setUser(null);
        }).catch((error) => {
            console.error('Error signing out', error);
        });
    };

    return (
        <div className="App">
            <header>
                <h1>⚛️🔥💬</h1>
                {user ? (
                    <>
                        <button onClick={signOutUser}>Sign Out</button>
                    </>
                ) : (
                    <>
                        <button onClick={signInWithGoogle}>Sign in with Google</button>
                        <form onSubmit={signInWithEmailAndPasswordHandler}>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                            <button type="submit">Sign In</button>
                        </form>
                        <form onSubmit={signUpWithEmailAndPasswordHandler}>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                            <button type="submit">Sign Up</button>
                        </form>
                    </>
                )}
            </header>
            <main>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} user={user} />)}

                <span ref={dummy}></span>
            </main>
            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" disabled={!user} />
                <button type="submit" disabled={!user || !formValue}>Send</button>
            </form>
        </div>
    );
}
const generateAvatarUrl = (userId) => {
    return `https://api.multiavatar.com/${userId}.png`;
};

function ChatMessage({ message, user }) {
    const { text, uid, displayName } = message;
    const messageClass = uid === user?.uid ? 'sent' : 'received';
    const avatarUrl = generateAvatarUrl(uid); // Generate avatar URL

    return (
        <div className={`message ${messageClass}`}>
            <div className="user-info">
                <img src={avatarUrl} alt="Avatar"/>
            </div>
            <p>{text}</p>
        </div>
    );
}

export default App;
