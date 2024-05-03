import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Message = ({ message }) => {
    const [user] = useAuthState(auth);

    const avatarUrl = generateAvatarUrl(message.uid);

    return (
        <div
            className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
            <img
                className="chat-bubble__left"
                src={avatarUrl}
                alt="user avatar"
            />
            <div className="chat-bubble__right">
               {/*<p className="user-name">{message.name}</p>*/}
                <p className="user-message">{message.text}</p>
            </div>
        </div>
    );
};

const generateAvatarUrl = (userId) => {
    return `https://api.multiavatar.com/${userId}.png`;
};

export default Message;
