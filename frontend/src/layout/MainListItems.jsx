import React, {useContext, useEffect, useReducer, useState} from "react";
import {Link as RouterLink, useHistory} from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import {Avatar, Badge, Collapse, FormControl, List} from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import ViewKanban from "@mui/icons-material/ViewKanban";
import Schedule from "@material-ui/icons/Schedule";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeopleIcon from "@material-ui/icons/People";
import ListIcon from "@material-ui/icons/ListAlt";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import ForumIcon from "@material-ui/icons/Forum";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import BusinessIcon from '@material-ui/icons/Business';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import {
    AllInclusive,
    Assignment,
    AttachFile,
    CalendarToday,
    DeviceHubOutlined,
    PhonelinkSetup
} from '@material-ui/icons';
import ImportExportRoundedIcon from '@material-ui/icons/ImportExportRounded';
import ScheduleRoundedIcon from '@material-ui/icons/ScheduleRounded';
import EventRoundedIcon from '@material-ui/icons/EventRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import RotateRight from "@material-ui/icons/RotateRight";
import MemoryRoundedIcon from '@material-ui/icons/MemoryRounded';
import {i18n} from "../translate/i18n";
import {WhatsAppsContext} from "../context/WhatsApp/WhatsAppsContext";
import {AuthContext} from "../context/Auth/AuthContext";
import {Can} from "../components/Can";
import {SocketContext} from "../context/Socket/SocketContext";
import {isArray} from "lodash";
import api from "../services/api";
import toastError from "../errors/toastError";
import {makeStyles} from "@material-ui/core/styles";
import usePlans from "../hooks/usePlans";

import Typography from "@material-ui/core/Typography";
import useVersion from "../hooks/useVersion";
import useSettings from "../hooks/useSettings"; // Corrigir o caminho do import

const useStyles = makeStyles((theme) => ({
    ListSubheader: {
        height: 26,
        marginTop: "-15px",
        marginBottom: "-10px",
    }
}));

function ListItemLink(props) {
    const {icon, primary, to, className} = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef((itemProps, ref) => (
                <RouterLink to={to} ref={ref} {...itemProps} />
            )),
        [to]
    );

    return (
        <li>
            <ListItem button dense component={renderLink} className={className}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary}/>
            </ListItem>
        </li>
    );
}

const reducer = (state, action) => {
    if (action.type === "LOAD_CHATS") {
        const chats = action.payload;
        const newChats = [];

        if (isArray(chats)) {
            chats.forEach((chat) => {
                const chatIndex = state.findIndex((u) => u.id === chat.id);
                if (chatIndex !== -1) {
                    state[chatIndex] = chat;
                } else {
                    newChats.push(chat);
                }
            });
        }

        return [...state, ...newChats];
    }

    if (action.type === "UPDATE_CHATS") {
        const chat = action.payload;
        const chatIndex = state.findIndex((u) => u.id === chat.id);

        if (chatIndex !== -1) {
            state[chatIndex] = chat;
            return [...state];
        } else {
            return [chat, ...state];
        }
    }

    if (action.type === "DELETE_CHAT") {
        const chatId = action.payload;

        const chatIndex = state.findIndex((u) => u.id === chatId);
        if (chatIndex !== -1) {
            state.splice(chatIndex, 1);
        }
        return [...state];
    }

    if (action.type === "RESET") {
        return [];
    }

    if (action.type === "CHANGE_CHAT") {
        const changedChats = state.map((chat) => {
            if (chat.id === action.payload.chat.id) {
                return action.payload.chat;
            }
            return chat;
        });
        return changedChats;
    }
};

const MainListItems = (props) => {
    const classes = useStyles();
    const {drawerClose, collapsed} = props;
    const {whatsApps} = useContext(WhatsAppsContext);
    const {user, handleLogout} = useContext(AuthContext);
    const [connectionWarning, setConnectionWarning] = useState(false);
    const [openCampaignSubmenu, setOpenCampaignSubmenu] = useState(false);
    const [showCampaigns, setShowCampaigns] = useState(false);
    const [showEmail, setShowEmail] = useState(false);

    const [showOpenAi, setShowOpenAi] = useState(false);
    const [showIntegrations, setShowIntegrations] = useState(false);
    const history = useHistory();
    const [showSchedules, setShowSchedules] = useState(false);
    const [showInternalChat, setShowInternalChat] = useState(false);
    const [showExternalApi, setShowExternalApi] = useState(false);
    const [showKanban, setShowKanban] = useState(false);
    const [openKanbanSubmenu, setOpenKanbanSubmenu] = useState(false);
    const [showTypeBotInMainMenu, setShowTypeBotInMainMenu] = useState(false);

    const [invisible, setInvisible] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchParam] = useState("");
    const [chats, dispatch] = useReducer(reducer, []);
    //const [openKanbanSubmenu, setOpenKanbanSubmenu] = useState(false);
    const [openEmailSubmenu, setOpenEmailSubmenu] = useState(false);
    const [openIntegrationsSubmenu, setOpenIntegrationsSubmenu] = useState(false);
    const [version, setVersion] = useState(false);
    const {getPlanCompany} = usePlans();
    const {getVersion} = useVersion();
    const { settings } = useSettings();

    const socketManager = useContext(SocketContext);

    useEffect(async () => {
        async function fetchVersion() {
            const _version = await getVersion();
            setVersion(_version.version);
        }

        await fetchVersion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        api.get(`/settings`).then(({ data }) => {
        if (Array.isArray(data)) {
            const showTypeBotInMainMenu = data.find((d) => d.key === "showTypeBotInMainMenu");
            if (showTypeBotInMainMenu) {
            setShowTypeBotInMainMenu(showTypeBotInMainMenu.value);
            }
        }
        });
    }, []);

    useEffect(() => {
        dispatch({type: "RESET"});
        setPageNumber(1);
    }, [searchParam]);

    useEffect(async () => {
        await fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(async () => {
        await fetchChats();
    }, [searchParam, pageNumber]);

    useEffect(() => {
        const companyId = localStorage.getItem("companyId");
        const socket = socketManager.GetSocket(companyId);

        const onCompanyChatMainListItems = (data) => {
            if (data.action === "new-message") {
                dispatch({type: "CHANGE_CHAT", payload: data});
            }
            if (data.action === "update") {
                dispatch({type: "CHANGE_CHAT", payload: data});
            }
        }

        socket.on(`company-${companyId}-chat`, onCompanyChatMainListItems);
        return () => {
            socket.off(`company-${companyId}-chat`, onCompanyChatMainListItems);
        };
    }, []);

    useEffect(() => {
        let unreadsCount = 0;
        if (chats.length > 0) {
            for (let chat of chats) {
                for (let chatUser of chat.users) {
                    if (chatUser.userId === user.id) {
                        unreadsCount += chatUser.unreads;
                    }
                }
            }
        }
        if (unreadsCount > 0) {
            setInvisible(false);
        } else {
            setInvisible(true);
        }
    }, [chats, user.id]);

    useEffect(() => {
        if (localStorage.getItem("cshow")) {
            setShowCampaigns(true);
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem("eshow")) {
            setShowEmail(true);
        }
    }, []);

    useEffect(() => {
        if (whatsApps.length > 0) {
            const offlineWhats = whatsApps.filter((whats) => {
                return (
                    whats.status === "qrcode" ||
                    whats.status === "PAIRING" ||
                    whats.status === "DISCONNECTED" ||
                    whats.status === "TIMEOUT" ||
                    whats.status === "OPENING"
                );
            });
            if (offlineWhats.length > 0) {
                setConnectionWarning(true);
            } else {
                setConnectionWarning(false);
            }
        }
    }, [whatsApps]);

    async function fetchData() {
        if (window.location.pathname === "/login") return;

        const companyId = user.companyId;
        const planConfigs = await getPlanCompany(undefined, companyId);

        setShowCampaigns(planConfigs.plan.useCampaigns);
        setShowKanban(planConfigs.plan.useKanban)
        setShowOpenAi(planConfigs.plan.useOpenAi);
        setShowIntegrations(planConfigs.plan.useIntegrations);
        setShowSchedules(planConfigs.plan.useSchedules);
        setShowInternalChat(planConfigs.plan.useInternalChat);
        setShowExternalApi(planConfigs.plan.useExternalApi);
        setShowEmail(planConfigs.plan.useEmail);
    }

    const fetchChats = async () => {
        try {
            const {data} = await api.get("/chats/", {
                params: {searchParam, pageNumber},
            });
            dispatch({type: "LOAD_CHATS", payload: data.records});
        } catch (err) {
            toastError(err);
        }
    };

    const handleClickLogout = () => {
        //handleCloseMenu();
        handleLogout();
    };

    const handleOpenIntegrationsSubmenu = () => {
        setOpenIntegrationsSubmenu(!openIntegrationsSubmenu);
    };

    return (
        <div>
            <Can
                role={user.profile}
                perform={"dashboard:view"}
                yes={() => (
                    <>
                        <ListSubheader
                            hidden={collapsed}
                            style={{
                                position: "relative",
                                fontSize: "17px",
                                textAlign: "left",
                                paddingLeft: 20
                            }}
                            inset
                            color="inherit">
                            {i18n.t("mainDrawer.listTitle.management")}
                        </ListSubheader>
                        <div>
                            <ListItemLink
                                small
                                to="/"
                                primary="Dashboard"
                                icon={<DashboardOutlinedIcon/>}
                            />
                            <ListItemLink
                                to="/export"
                                primary={i18n.t("mainDrawer.listItems.export")}
                                icon={<ImportExportRoundedIcon/>}
                            />
                        </div>
                    </>
                )}
            />
            <Can
                role={user.profile}
                perform={"drawer-service-items:view"}
                style={{
                    overflowY: "scroll",
                }}
                no={() => (
                    <>
                        <ListSubheader
                            hidden={collapsed}
                            style={{
                                position: "relative",
                                fontSize: "17px",
                                textAlign: "left",
                                paddingLeft: 20
                            }}
                            inset
                            color="inherit">
                            {i18n.t("mainDrawer.listTitle.service")}
                        </ListSubheader>
                        <>
                            <div>
                                <ListItemLink
                                    to="/tickets"
                                    primary={i18n.t("mainDrawer.listItems.tickets")}
                                    icon={<WhatsAppIcon/>}
                                />
                                {/*
                                    <ListItemLink
                                        to="/moments"
                                        primary={i18n.t("mainDrawer.listItems.chatsTempoReal")}
                                        icon={<Assignment />}
                                    />
                                */}
                                <ListItemLink
                                    to="/quick-messages"
                                    primary={i18n.t("mainDrawer.listItems.quickMessages")}
                                    icon={<FlashOnIcon/>}
                                />
                                {showKanban && (
                                <>
                                    <ListItem button onClick={() => setOpenKanbanSubmenu((prev) => !prev)} className={classes.listItem}>
                                      <ListItemIcon>
                                        <DashboardOutlinedIcon />
                                      </ListItemIcon>
                                      <ListItemText primary={i18n.t("Kanban")} />
                                      {openKanbanSubmenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </ListItem>
                                    <Collapse in={openKanbanSubmenu} timeout="auto" unmountOnExit>
                                      <List component="div" disablePadding>
                                        <ListItemLink
                                          to="/kanban"
                                          primary={i18n.t("Painel")}
                                          icon={<ListIcon />}
                                          className={classes.nested}
                                        />
                                        {/*<ListItemLink
                                          to="/tagsKanban"
                                          primary={i18n.t("Tags")}
                                          icon={<CalendarToday />}
                                          className={classes.nested}
                                        />*/}
                                        <ListItemLink
                                          to="/kanban-schedules"
                                          primary={i18n.t("Em Andamento")}
                                          icon={<EventAvailableIcon />}
                                          className={classes.nested}
                                        />
                                      </List>
                                    </Collapse>
                                    </>
                                )}
                            </div>
                            {showEmail && (
                                <>
                                    <ListItem
                                        button dense onClick={() => setOpenEmailSubmenu((prev) => !prev)}
                                    >
                                        <ListItemIcon>
                                            <EmailRoundedIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={i18n.t('mainDrawer.listItems.email')}/>
                                        {openEmailSubmenu ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                    </ListItem>

                                    <Collapse
                                        style={{paddingLeft: 15}}
                                        in={openEmailSubmenu} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            <ListItemLink to={"/Email"} primary={i18n.t("email.subMenus.send")}
                                                          icon={<SendRoundedIcon/>}/>
                                            <ListItemLink to={"/EmailLis"} primary={i18n.t("email.subMenus.sent")}
                                                          icon={<SendRoundedIcon/>}/>
                                            <ListItemLink to={"/EmailScheduler"}
                                                          primary={i18n.t("email.subMenus.schedule")}
                                                          icon={<EventRoundedIcon/>}/>
                                            <ListItemLink to={"/EmailsAgendado"}
                                                          primary={i18n.t("email.subMenus.scheduled")}
                                                          icon={<ScheduleRoundedIcon/>}/>

                                        </List>
                                    </Collapse>
                                </>
                            )}
                            <div>
                                <ListItemLink
                                    to="/todolist"

                                    primary={i18n.t("mainDrawer.listItems.tasks")}
                                    icon={<EventAvailableIcon/>}
                                />
                                <ListItemLink
                                    to="/contacts"

                                    primary={i18n.t("mainDrawer.listItems.contacts")}
                                    icon={<ContactPhoneOutlinedIcon/>}
                                />
                                {showSchedules && (
                                    <>
                                        <ListItemLink
                                            to="/schedules"

                                            primary={i18n.t("mainDrawer.listItems.schedules")}
                                            icon={<Schedule/>}
                                        />
                                    </>
                                )}
                                <ListItemLink
                                    to="/tags"

                                    primary={i18n.t("mainDrawer.listItems.tags")}
                                    icon={<LocalOfferIcon/>}
                                />
                                {showInternalChat && (
                                    <>
                                        <ListItemLink
                                            to="/chats"
                                            primary={i18n.t("mainDrawer.listItems.chats")}
                                            icon={
                                                <Badge color="secondary" variant="dot" invisible={invisible}>
                                                    <ForumIcon/>
                                                </Badge>
                                            }
                                        />
                                    </>
                                )}
                                {showTypeBotInMainMenu === "enabled" && (
                                    <ListItemLink
                                        to="/typebot"
                                        primary={i18n.t("mainDrawer.listItems.typebot")}
                                        icon={<MergeTypeIcon />}
                                    />
                                )}
                                <ListItemLink
                                    to="/helps"
                                    primary={i18n.t("mainDrawer.listItems.helps")}
                                    icon={<HelpOutlineIcon/>}
                                />
                            </div>
                        </>
                    </>
                )}
            />
            <Can
                role={user.profile}
                perform="drawer-admin-items:view"
                yes={() => (
                    <>
                        <Divider/>
                        <ListSubheader
                            hidden={collapsed}
                            style={{
                                position: "relative",
                                fontSize: "17px",
                                textAlign: "left",
                                paddingLeft: 20
                            }}
                            inset
                            color="inherit">
                            {i18n.t("mainDrawer.listTitle.administration")}
                        </ListSubheader>

                        {showCampaigns && (
                            <>
                                <ListItem
                                    button dense
                                    onClick={() => setOpenCampaignSubmenu((prev) => !prev)}
                                >
                                    <ListItemIcon>
                                        <EventAvailableIcon/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={i18n.t("mainDrawer.listItems.campaigns.menu")}
                                    />
                                    {openCampaignSubmenu ? (
                                        <ExpandLessIcon/>
                                    ) : (
                                        <ExpandMoreIcon/>
                                    )}
                                </ListItem>
                                <Collapse
                                    style={{paddingLeft: 15}}
                                    in={openCampaignSubmenu}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <List component="div" disablePadding>
                                        <ListItemLink to="/campaigns"
                                                      primary={i18n.t("mainDrawer.listItems.campaigns.listing")}
                                                      icon={<ListIcon/>}/>
                                        <ListItemLink to="/contact-lists"
                                                      primary={i18n.t("mainDrawer.listItems.campaigns.contactList")}
                                                      icon={<PeopleIcon/>}/>
                                        <ListItemLink to="/files" primary={i18n.t("mainDrawer.listItems.files")}
                                                      icon={<AttachFile/>}/>
                                        <ListItemLink to="/campaigns-config"
                                                      primary={i18n.t("mainDrawer.listItems.campaigns.config")}
                                                      icon={<SettingsOutlinedIcon/>}/>
                                    </List>
                                </Collapse>
                            </>
                        )}
                        <div>
                            {user.super && (
                                <ListItemLink
                                    to="/announcements"
                                    primary={i18n.t("mainDrawer.listItems.annoucements")}
                                    icon={<AnnouncementIcon/>}
                                />
                            )}
                            {showIntegrations && (
                                <>
                                    <ListItem
                                        button dense
                                        onClick={handleOpenIntegrationsSubmenu}
                                    >
                                        <ListItemIcon>
                                            <DeviceHubOutlined/>
                                        </ListItemIcon>
                                        <ListItemText primary={i18n.t("mainDrawer.listItems.integrations.menu")}/>
                                        {openIntegrationsSubmenu ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                    </ListItem>
                                    <Collapse
                                        style={{paddingLeft: 15}}
                                        in={openIntegrationsSubmenu}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <List component="div" disablePadding>
                                            <ListItemLink to={"/prompts"}
                                                          primary={i18n.t("mainDrawer.listItems.prompts")}
                                                          icon={<AllInclusive/>}/>
                                            <ListItemLink to={"/messages-api"}
                                                          primary={i18n.t("mainDrawer.listItems.messagesAPI")}
                                                          icon={<CodeRoundedIcon/>}/>
                                            <ListItemLink to={"/queue-integration"}
                                                          primary={i18n.t("mainDrawer.listItems.queueIntegration")}
                                                          icon={<DeviceHubOutlined/>}/>
                                        </List>
                                    </Collapse>
                                </>
                            )}
                            <ListItemLink
                                to="/connections"
                                primary={i18n.t("mainDrawer.listItems.connections")}
                                icon={
                                    <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
                                        <SyncAltIcon/>
                                    </Badge>
                                }
                            />
                            {user.super && (
                                <ListItemLink
                                    to="/allConnections"
                                    primary={i18n.t("mainDrawer.listItems.allConnections")}
                                    icon={<PhonelinkSetup />}
                                />
                            )}
                            <ListItemLink
                                to="/queues"
                                primary={i18n.t("mainDrawer.listItems.queues")}
                                icon={<AccountTreeOutlinedIcon/>}
                            />
                            <ListItemLink
                                to="/users"
                                primary={i18n.t("mainDrawer.listItems.users")}
                                icon={<PeopleAltOutlinedIcon/>}
                            />
                            <ListItemLink
                                to="/financeiro"
                                primary={i18n.t("mainDrawer.listItems.financeiro")}
                                icon={<LocalAtmIcon/>}
                            />

                            <ListItemLink
                                to="/settings"
                                primary={i18n.t("mainDrawer.listItems.settings")}
                                icon={<SettingsOutlinedIcon/>}
                            />

                            {user.super && (
                                <ListItemLink
                                    to="/companies"
                                    primary={i18n.t("mainDrawer.listItems.companies")}
                                    icon={<BusinessIcon/>}
                                />)}
                            {}
                        </div>
                    </>
                )}
            />
            <Can
                role={user.profile}
                perform="drawer-superv-items:view"
                yes={() => (
                    <>
                        <Divider/>
                        <ListSubheader
                            hidden={collapsed}
                            style={{
                                position: "relative",
                                fontSize: "17px",
                                textAlign: "left",
                                paddingLeft: 20
                            }}
                            inset
                            color="inherit"
                        >
                            {i18n.t("mainDrawer.listTitle.administration")}
                        </ListSubheader>

                        <ListItemLink to="/connections" primary={i18n.t("mainDrawer.listItems.connections")}
                                      icon={<SyncAltIcon/>}/>

                        <ListItemLink to="/users" primary={i18n.t("mainDrawer.listItems.users")}
                                      icon={<PeopleAltOutlinedIcon/>}/>
                    </>
                )}
            />
            <Divider/>
            {!collapsed && <React.Fragment>
                <Typography style={{fontSize: "12px", padding: "10px", textAlign: "right", fontWeight: "bold"}}>
                    {i18n.t("mainDrawer.listItems.version")} : {version}
                </Typography>
            </React.Fragment>
            }

            <li>
                <ListItem
                    button
                    dense
                    onClick={handleClickLogout}>
                    <ListItemIcon><RotateRight/></ListItemIcon>
                    <ListItemText primary={i18n.t("mainDrawer.listItems.exit")}/>
                </ListItem>
            </li>
        </div>
    );
};

export default MainListItems;