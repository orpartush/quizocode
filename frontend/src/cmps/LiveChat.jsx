import React, { useState, useEffect, useContext, useRef } from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';
import { UserContext } from '../store/contexts/UserContext';
import { SocketService } from '../services/SocketService.js';
import { useForm } from 'react-hook-form';
import { MdSend } from 'react-icons/md';

function LiveChat({ category }) {
    const { loggedInUser } = useContext(UserContext);
    const [msg, setMsg] = useState('');
    const [chatMsgs, setChatMsgs] = useStateIfMounted([]);
    const { register, handleSubmit } = useForm();
    const msgsContainerRef = useRef(null);

    useEffect(() => {
        const connectSocket = () => {
            SocketService.setup();
        };
        connectSocket();
        return () => SocketService.terminate();
    }, []);

    useEffect(() => {
        const setChatRoom = () => {
            if (!loggedInUser || !category) return;
            setChatMsgs([]);
            let username = loggedInUser.name;
            let room = category;
            SocketService.emit('joinRoom', { username, room });
        };
        setChatRoom();
    }, [loggedInUser, category]);

    useEffect(() => {
        const onNewMsg = () => {
            if (!loggedInUser) return;
            SocketService.on('chat newMsg', newMsg => {
                setChatMsgs([...chatMsgs, newMsg]);
            });
        };
        onNewMsg();
    }, [msg]);

    useEffect(() => {
        msgsContainerRef.current.scrollTo({
            top: msgsContainerRef.current.offsetTop,
        });
    }, [chatMsgs]);

    const onSubmit = ({ msg }) => {
        const newMsg = {
            txt: msg,
            imgUrl: loggedInUser.imgUrl,
        };
        SocketService.emit('chat newMsg', newMsg);
        setMsg('');
    };

    const renderMsgs = () => {
        return chatMsgs.map(({ imgUrl, username, txt, time }, idx) => (
            <section className="msg-container flex align-center" key={idx}>
                <section className="img-container">
                    <img src={imgUrl} alt="User" />
                </section>
                <div>
                    <section className="from-details flex">
                        <p className="username">{username}</p>
                        <small className="time">{time}</small>
                    </section>
                    <section className="msg">
                        <p className="txt">{txt}</p>
                    </section>
                </div>
            </section>
        ));
    };

    return (
        <div className="live-chat flex flex-column space-between">
            <section className="msgs-container" ref={msgsContainerRef}>
                {renderMsgs()}
            </section>
            <form className="flex space-evenly align-center" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    placeholder="Type a message"
                    value={msg}
                    name="msg"
                    ref={register}
                    onChange={e => setMsg(e.target.value)}
                    autoComplete="off"
                    required
                />
                <button className="flex align-center">
                    <MdSend title="Send message" />
                </button>
            </form>
        </div>
    );
}

export default LiveChat;
