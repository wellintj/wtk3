import React, {useState, useEffect, useContext} from "react";
import {useParams, useHistory} from "react-router-dom";

import {toast} from "react-toastify";
import clsx from "clsx";

import {Paper, makeStyles} from "@material-ui/core";

import ContactDrawer from "../ContactDrawer";
import MessageInput from "../MessageInputCustom/";
import TicketHeader from "../TicketHeader";
import TicketInfo from "../TicketInfo";
import TicketActionButtons from "../TicketActionButtonsCustom";
import MessagesList from "../MessagesList";
import api from "../../services/api";
import {ReplyMessageProvider} from "../../context/ReplyingMessage/ReplyingMessageContext";
import {EditMessageProvider} from "../../context/EditingMessage/EditingMessageContext";
import toastError from "../../errors/toastError";
import {AuthContext} from "../../context/Auth/AuthContext";
import {TagsContainer} from "../TagsContainer";
import {SocketContext} from "../../context/Socket/SocketContext";

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        height: "100%",
        position: "relative",
        overflow: "hidden",
    },

    mainWrapper: {
        flex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderLeft: "0",
        marginRight: -drawerWidth,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },

    mainWrapperShift: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
}));

const Ticket = () => {
    const {ticketId} = useParams();
    const history = useHistory();
    const classes = useStyles();

    const {user} = useContext(AuthContext);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [contact, setContact] = useState({});
    const [ticket, setTicket] = useState({});
    const [showSelectMessageCheckbox, setShowSelectMessageCheckbox] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [forwardMessageModalOpen, setForwardMessageModalOpen] = useState(false);

    const socketManager = useContext(SocketContext);

    useEffect(async () => {
        setLoading(true);
        try {
            const {data} = await api.get("/tickets/u/" + ticketId);
            const {queueId} = data;
            const {queues, profile} = user;

            // Verifique se o usuário tem permissão para acessar a fila do ticket
            const queueAllowed = queues.find((q) => q.id === queueId);
            if (!queueAllowed && profile !== "admin") {
                // Verifique se o usuário tem permissão para visualizar todos os tickets
                const userHasGlobalAccess = user.allTicket === "enabled";
                if (!userHasGlobalAccess) {
                    toast.error("Acesso não permitido");
                    history.push("/tickets");
                    return;
                }
            }

            setContact(data.contact);
            setTicket(data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
            toastError(err);
        }
        }, [ticketId, user, history]);

    useEffect(() => {
        const companyId = localStorage.getItem("companyId");
        const socket = socketManager.GetSocket(companyId);

        const onConnectTicket = () => {
            socket.emit("joinChatBox", `${ticket.id}`);
        }

        socketManager.onConnect(onConnectTicket);

        const onCompanyTicket = (data) => {
            console.log("onCompanyTicket", data);

            if (data.action === "update" && data.ticket.id === ticket.id) {
                setTicket(data.ticket);
            }

            if (data.action === "delete" && data.ticketId === ticket.id) {
                toast.success("Ticket deleted sucessfully.");
                history.push("/tickets");
            }
        };

        const onCompanyContact = (data) => {
            if (data.action === "update") {
                setContact((prevState) => {
                    if (prevState.id === data.contact?.id) {
                        return {...prevState, ...data.contact};
                    }
                    return prevState;
                });
            }
        };

        socket.on(`company-${companyId}-ticket`, onCompanyTicket);
        socket.on(`company-${companyId}-contact`, onCompanyContact);

        return () => {
            socket.off(`company-${companyId}-ticket`, onCompanyTicket);
            socket.off(`company-${companyId}-contact`, onCompanyContact);
        };
    }, [ticketId, ticket, history, socketManager]);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const renderTicketInfo = () => {
        if (ticket.user !== undefined) {
            return (
                <TicketInfo
                    contact={contact}
                    ticket={ticket}
                    onClick={handleDrawerOpen}
                />
            );
        }
    };

    const renderMessagesList = () => {
        return (
            <>
                <MessagesList
                    ticket={ticket}
                    ticketId={ticket.id}
                    isGroup={ticket.isGroup}
                    showSelectMessageCheckbox={showSelectMessageCheckbox}
                    setShowSelectMessageCheckbox={setShowSelectMessageCheckbox}
                    setSelectedMessagesList={setSelectedMessages}
                    selectedMessagesList={selectedMessages}
                    forwardMessageModalOpen={forwardMessageModalOpen}
                    setForwardMessageModalOpen={setForwardMessageModalOpen}
                ></MessagesList>
                <MessageInput ticketId={ticket.id} ticketStatus={ticket.status}/>
            </>
        );
    };

    return (
        <div className={classes.root} id="drawer-container">
            <Paper
                variant="outlined"
                elevation={0}
                className={clsx(classes.mainWrapper, {
                    [classes.mainWrapperShift]: drawerOpen,
                })}
            >
                <TicketHeader loading={loading}>
                    <div id="TicketHeader">
                        {renderTicketInfo()}
                    </div>
                    <TicketActionButtons
                        ticket={ticket}
                        showSelectMessageCheckbox={showSelectMessageCheckbox}
                        selectedMessages={selectedMessages}
                        forwardMessageModalOpen={forwardMessageModalOpen}
                        setForwardMessageModalOpen={setForwardMessageModalOpen}
                    />
                </TicketHeader>
                <Paper>
                    <TagsContainer ticket={ticket}/>
                </Paper>
                <ReplyMessageProvider>
                    <EditMessageProvider>
                        {renderMessagesList()}
                    </EditMessageProvider>
                </ReplyMessageProvider>
            </Paper>
            <ContactDrawer
                open={drawerOpen}
                handleDrawerClose={handleDrawerClose}
                contact={contact}
                loading={loading}
                ticket={ticket}
            />
        </div>
    );
};

export default Ticket;