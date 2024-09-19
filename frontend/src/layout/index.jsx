import React, { useState, useContext, useEffect } from "react";
import clsx from "clsx";
import moment from "moment";
import {
  makeStyles,
  Drawer,
  AppBar,
  Toolbar,
  Tooltip,
  List,
  Typography,
  Divider,
  MenuItem,
  IconButton,
  Menu,
  useTheme,
  useMediaQuery
} from "@material-ui/core";
import ReactCountryFlag from "react-country-flag"
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CachedIcon from "@material-ui/icons/Cached";

import MainListItems from "./MainListItems";
import NotificationsPopOver from "../components/NotificationsPopOver";
import NotificationsVolume from "../components/NotificationsVolume";
import UserModal from "../components/UserModal";
import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading";
import { i18n } from "../translate/i18n";
import { messages } from "../translate/languages";
import toastError from "../errors/toastError";
import AnnouncementsPopover from "../components/AnnouncementsPopover";

import { SocketContext } from "../context/Socket/SocketContext";
import ChatPopover from "../pages/Chat/ChatPopover";
import useSettings from "../hooks/useSettings";

import { useDate } from "../hooks/useDate";
import useAuth from "../hooks/useAuth.js";

import ColorModeContext from "../layout/themeContext";

import NestedMenuItem from "material-ui-nested-menu-item";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",

    backgroundColor: theme.palette.fancyBackground,
    "& .MuiButton-outlinedPrimary": {
      color: theme.palette.primary,
      border:
        theme.mode === "light"
          ? "1px solid #00bfff"
          : "1px solid #00bfff!important",
    },
    "& .MuiTab-textColorPrimary.Mui-selected": {
      color: theme.palette.primary,
    },
  },
  avatar: {
    width: "100%",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    color: theme.palette.dark.main,
    background: theme.palette.barraSuperior,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8px",
    minHeight: "48px",
    [theme.breakpoints.down("sm")]: {
      height: "48px",
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    fontSize: 14,
    color: "white",
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    ...theme.scrollbarStylesSoft,
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(8),
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  appBarSpacer: {
    minHeight: "48px",
  },
  content: {
    flex: 1,
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  containerWithScroll: {
    flex: 1,
    padding: theme.spacing(0.5),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  NotificationsPopOver: {
    // color: theme.barraSuperior.secondary.main,
  },
  logo: {
    width: "192px",
    maxHeight: "72px",
    logo: theme.logo,
    content: "url(" + (theme.mode === "light" ? theme.calculatedLogoLight() : theme.calculatedLogoDark()) + ")"
  },
  hideLogo: {
    display: "none",
  },
}));

const LoggedInLayout = ({ children, themeToggle }) => {
  const classes = useStyles();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { handleLogout, loading } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerVariant, setDrawerVariant] = useState("permanent");
  // const [dueDate, setDueDate] = useState("");
  const { user } = useContext(AuthContext);

  const theme = useTheme();
  const { colorMode } = useContext(ColorModeContext);
  const greaterThenSm = useMediaQuery(theme.breakpoints.up("sm"));

  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const { getCurrentUserInfo } = useAuth();
  const [currentUser, setCurrentUser] = useState({});
  const [volume, setVolume] = useState(localStorage.getItem("volume") || 1);

  const { dateToClient } = useDate();

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    if (document.body.offsetWidth > 600) {
      if (user.defaultMenu === "closed") {
        setDrawerOpen(false);
      } else {
        setDrawerOpen(true);
      }
    }
  }, [user]);

  useEffect(() => {
    getCurrentUserInfo().then((user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    if (document.body.offsetWidth < 600) {
      setDrawerVariant("temporary");
    } else {
      setDrawerVariant("permanent");
    }
  }, [drawerOpen]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const userId = localStorage.getItem("userId");

    const socket = socketManager.GetSocket(companyId);

    const onCompanyAuthLayout = (data) => {
      if (data.user.id === +userId) {
        toastError("Sua conta foi acessada em outro computador.");
        setTimeout(() => {
          localStorage.clear();
          window.location.reload();
        }, 1000);
      }
    };

    socket.on(`company-${companyId}-auth`, onCompanyAuthLayout);

    socket.emit("userStatus");
    const interval = setInterval(() => {
      socket.emit("userStatus");
    }, 1000 * 60 * 5);

    return () => {
      socket.off(`company-${companyId}-auth`, onCompanyAuthLayout);

      clearInterval(interval);
    };
  }, [socketManager]);

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleCloseLanguageMenu = () => {
    setAnchorEl(null);
    setLanguageOpen(false);
  };

  const handleOpenUserModal = () => {
    setUserModalOpen(true);
    handleCloseProfileMenu();
  };

  const handleClickLogout = () => {
    handleCloseProfileMenu();
    handleLogout();
  };

  const drawerClose = () => {
    if (document.body.offsetWidth < 600 || user.defaultMenu === "closed") {
      setDrawerOpen(false);
    }
  };

  const handleRefreshPage = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
    window.location.reload(false);
  };

  const handleMenuItemClick = () => {
    const { innerWidth: width } = window;
    if (width <= 600) {
      setDrawerOpen(false);
    }
  };

  const toggleColorMode = () => {
    colorMode.toggleColorMode();
  };

  const handleChooseLanguage = (language) => {
    localStorage.setItem("language", language);
    window.location.reload(false);
  };

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <div className={classes.root}>
      <Drawer
        variant={drawerVariant}
        className={drawerOpen ? classes.drawerPaper : classes.drawerPaperClose}
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !drawerOpen && classes.drawerPaperClose
          ),
        }}
        open={drawerOpen}
      >
        <div className={classes.toolbarIcon}>
          <img
            className={drawerOpen ? classes.logo : classes.hideLogo}
            alt="logo"
          />
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List className={classes.containerWithScroll}>
          <MainListItems drawerClose={drawerClose} collapsed={!drawerOpen} />
        </List>
        <Divider />
      </Drawer>
      <UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        userId={user?.id}
      />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
        color="primary"
      >
        <Toolbar variant="dense" className={classes.toolbar}>
          <IconButton
            edge="start"
            variant="contained"
            aria-label="open drawer"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={clsx(
              classes.menuButton,
              drawerOpen && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="h2"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {greaterThenSm &&
            user?.profile === "admin" &&
            user?.company?.dueDate ? (
              <>
                {i18n.t("mainDrawer.appBar.greetings.one")}
                <b>{user.name}</b>, {i18n.t("mainDrawer.appBar.greetings.two")}
                <b>{user?.company?.name}</b>! (
                {i18n.t("mainDrawer.appBar.greetings.three")}{" "}
                {dateToClient(user?.company?.dueDate)})
              </>
            ) : (
              <>
                {i18n.t("mainDrawer.appBar.greetings.one")}
                <b>{user.name}</b>, {i18n.t("mainDrawer.appBar.greetings.two")}
                <b>{user?.company?.name}</b>!
              </>
            )}
          </Typography>

          <NotificationsVolume setVolume={setVolume} volume={volume} />
          <Tooltip title="Limpar cache e atualizar página" arrow>
            <IconButton
              onClick={handleRefreshPage}
              aria-label={i18n.t("mainDrawer.appBar.refresh")}
              color="inherit"
            >
              <CachedIcon style={{ color: "white" }} />
            </IconButton>
          </Tooltip>

          {user.id && <NotificationsPopOver volume={volume} />}

          <AnnouncementsPopover />

          <ChatPopover />
          <div>
            <Menu
              id="language-appbar"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={languageOpen}
              onClose={handleCloseLanguageMenu}
            >
              {Object.keys(messages).map((m) => (
                <MenuItem onClick={() => handleChooseLanguage(m)}>
                <ReactCountryFlag
                  countryCode={messages[m]?.translations?.mainDrawer?.appBar?.i18n?.language_short}
                  svg
                  style={{
                    width: '1.5em',
                    height: '1.5em',
                    marginRight: '0.5em'
                  }}
                />
                {messages[m]?.translations?.mainDrawer?.appBar?.i18n?.language ?? "Undefined Language"}
              </MenuItem>
              ))}
            </Menu>
          </div>
          <div>
            <Tooltip title="Conta do Usuário" arrow>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenu}
                variant="contained"
                style={{ color: "white" }}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={menuOpen}
              onClose={handleCloseProfileMenu}
            >
              <MenuItem onClick={handleOpenUserModal}>
                {i18n.t("mainDrawer.appBar.user.profile")}
              </MenuItem>
              <MenuItem onClick={toggleColorMode}>
                {theme.mode === "dark"
                  ? i18n.t("mainDrawer.appBar.user.lightmode")
                  : i18n.t("mainDrawer.appBar.user.darkmode")}
              </MenuItem>
              <NestedMenuItem
                label={i18n.t("mainDrawer.appBar.user.language")}
                parentMenuOpen={menuOpen}
              >
                {Object.keys(messages).map((m) => (
                  <MenuItem onClick={() => handleChooseLanguage(m)}>
                    <ReactCountryFlag
                      countryCode={messages[m]?.translations?.mainDrawer?.appBar?.i18n?.language_short}
                      svg
                      style={{
                        width: '1.5em',
                        height: '1.5em',
                        marginRight: '0.5em'
                      }}
                    />
                    {messages[m].translations.mainDrawer.appBar.i18n.language}
                  </MenuItem>
                ))}
              </NestedMenuItem>
              <MenuItem onClick={handleClickLogout}>
                {i18n.t("mainDrawer.appBar.user.logout")}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        {children ? children : null}
      </main>
    </div>
  );
};

export default LoggedInLayout;
