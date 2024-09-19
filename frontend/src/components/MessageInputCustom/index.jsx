import React, {useState, useEffect, useContext, useRef} from "react";
import withWidth, {isWidthUp} from "@material-ui/core/withWidth";
import "emoji-mart/css/emoji-mart.css";
import {Picker} from "emoji-mart";

import clsx from "clsx";
import {isNil} from "lodash";

import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import CircularProgress from "@material-ui/core/CircularProgress";
import {green} from "@material-ui/core/colors";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import IconButton from "@material-ui/core/IconButton";
import MoodIcon from "@material-ui/icons/Mood";
import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import ClearIcon from "@material-ui/icons/Clear";
import MicIcon from "@material-ui/icons/Mic";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import {
    FormControlLabel, Switch, Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {isString, isEmpty, isObject, has} from "lodash";

import {i18n} from "../../translate/i18n";
import api from "../../services/api";
import axios from "axios";

import RecordingTimer from "./RecordingTimer";
import {ReplyMessageContext} from "../../context/ReplyingMessage/ReplyingMessageContext";
import {AuthContext} from "../../context/Auth/AuthContext";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import toastError from "../../errors/toastError";
import {EditMessageContext} from "../../context/EditingMessage/EditingMessageContext";

import useQuickMessages from "../../hooks/useQuickMessages";
import MicRecorder from "../../helpers/mic-recorder/mic-recorder";
import PersonIcon from "@material-ui/icons/Person";
import ContactSendModal from "../ContactSendModal";

const Mp3Recorder = new MicRecorder({bitRate: 128});

const useStyles = makeStyles((theme) => ({
    mainWrapper: {
        backgroundColor: theme.palette.bordabox,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    },

    newMessageBox: {
        backgroundColor: theme.palette.newmessagebox,
        width: "100%",
        display: "flex",
        padding: "7px",
        alignItems: "center",
    },

    messageInputWrapper: {
        padding: 6,
        marginRight: 7,
        backgroundColor: theme.palette.inputdigita,
        display: "flex",
        borderRadius: 20,
        flex: 1,
    },

    messageInput: {
        paddingLeft: 10,
        flex: 1,
        border: "none",
    },

    sendMessageIcons: {
        color: "grey",
    },

    uploadInput: {
        display: "none",
    },

    viewMediaInputWrapper: {
        maxHeight: "80%",
        display: "flex",
        padding: "10px 13px",
        position: "relative",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#eee",
        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    },

    emojiBox: {
        position: "absolute",
        bottom: 63,
        width: 40,
        borderTop: "1px solid #e8e8e8",
    },

    circleLoading: {
        color: green[500],
        opacity: "70%",
        position: "absolute",
        top: "20%",
        left: "50%",
        marginLeft: -12,
    },

    audioLoading: {
        color: green[500],
        opacity: "70%",
    },

    recorderWrapper: {
        display: "flex",
        alignItems: "center",
        alignContent: "middle",
    },

    cancelAudioIcon: {
        color: "red",
    },

    sendAudioIcon: {
        color: "green",
    },

    replyginMsgWrapper: {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 8,
        paddingLeft: 73,
        paddingRight: 7,
    },

    replyginMsgContainer: {
        flex: 1,
        marginRight: 5,
        overflowY: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: "7.5px",
        display: "flex",
        position: "relative",
    },

    replyginMsgBody: {
        padding: 10,
        height: "auto",
        display: "block",
        whiteSpace: "pre-wrap",
        overflow: "hidden",
    },

    replyginContactMsgSideColor: {
        flex: "none",
        width: "4px",
        backgroundColor: "#35cd96",
    },

    replyginSelfMsgSideColor: {
        flex: "none",
        width: "4px",
        backgroundColor: "#6bcbef",
    },

    messageContactName: {
        display: "flex",
        color: "#6bcbef",
        fontWeight: 500,
    },
    avatar: {
        width: "50px",
        height: "50px",
        borderRadius: "25%"
    },

    dropInfo: {
        background: "#eee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: 15,
        left: 0,
        right: 0,
    },

    dropInfoOut: {
        display: "none",
    },

    gridFiles: {
        maxHeight: "100%",
        overflow: "scroll",
    },
}));

const EmojiOptions = (props) => {
    const {disabled, showEmoji, setShowEmoji, handleAddEmoji} = props;
    const classes = useStyles();
    return (
        <>
            <IconButton
                aria-label="emojiPicker"
                component="span"
                disabled={disabled}
                onClick={(e) => setShowEmoji((prevState) => !prevState)}
            >
                <MoodIcon className={classes.sendMessageIcons}/>
            </IconButton>
            {showEmoji ? (
                <div className={classes.emojiBox}>
                    <Picker
                        perLine={16}
                        showPreview={false}
                        showSkinTones={false}
                        onSelect={handleAddEmoji}
                    />
                </div>
            ) : null}
        </>
    );
};

const SignSwitch = (props) => {
    const {width, setSignMessage, signMessage} = props;
    if (isWidthUp("md", width)) {
        return (
            <FormControlLabel
                style={{marginRight: 7, color: "gray"}}
                label={i18n.t("messagesInput.signMessage")}
                labelPlacement="start"
                control={
                    <Switch
                        size="small"
                        checked={signMessage}
                        onChange={(e) => {
                            setSignMessage(e.target.checked);
                        }}
                        name="showAllTickets"
                        color="primary"
                    />
                }
            />
        );
    }
    return null;
};

const FileInput = (props) => {
    const {handleChangeMedias, disableOption} = props;
    const classes = useStyles();
    return (
        <>
            <input
                multiple
                type="file"
                id="upload-button"
                disabled={disableOption()}
                className={classes.uploadInput}
                onChange={handleChangeMedias}
            />
            <label htmlFor="upload-button">
                <IconButton
                    aria-label="upload"
                    component="span"
                    disabled={disableOption()}
                >
                    <AttachFileIcon className={classes.sendMessageIcons}/>
                </IconButton>
            </label>
        </>
    );
};

const ActionButtons = (props) => {
    const {
        inputMessage,
        loading,
        recording,
        ticketStatus,
        handleSendMessage,
        handleCancelAudio,
        handleUploadAudio,
        handleStartRecording,
    } = props;
    const classes = useStyles();
    if (inputMessage) {
        return (
            <IconButton
                aria-label="sendMessage"
                component="span"
                onClick={handleSendMessage}
                disabled={loading}
            >
                <SendIcon className={classes.sendMessageIcons}/>
            </IconButton>
        );
    } else if (recording) {
        return (
            <div className={classes.recorderWrapper}>
                <IconButton
                    aria-label="cancelRecording"
                    component="span"
                    fontSize="large"
                    disabled={loading}
                    onClick={handleCancelAudio}
                >
                    <HighlightOffIcon className={classes.cancelAudioIcon}/>
                </IconButton>
                {loading ? (
                    <div>
                        <CircularProgress className={classes.audioLoading}/>
                    </div>
                ) : (
                    <RecordingTimer/>
                )}

                <IconButton
                    aria-label="sendRecordedAudio"
                    component="span"
                    onClick={handleUploadAudio}
                    disabled={loading}
                >
                    <CheckCircleOutlineIcon className={classes.sendAudioIcon}/>
                </IconButton>
            </div>
        );
    } else {
        return (
            <IconButton
                aria-label="showRecorder"
                component="span"
                disabled={loading || ticketStatus !== "open"}
                onClick={handleStartRecording}
            >
                <MicIcon className={classes.sendMessageIcons}/>
            </IconButton>
        );
    }
};

const CustomInput = (props) => {
    const {
        loading,
        inputRef,
        ticketStatus,
        inputMessage,
        setInputMessage,
        handleSendMessage,
        sendTypingStatus,
        handleInputPaste,
        disableOption,
        handleQuickAnswersClick,
    } = props;
    const classes = useStyles();
    const [quickMessages, setQuickMessages] = useState([]);
    const [options, setOptions] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);

    const {user} = useContext(AuthContext);

    const {list: listQuickMessages} = useQuickMessages();

    useEffect(() => {
        async function fetchData() {
            const companyId = localStorage.getItem("companyId");
            const messages = await listQuickMessages({companyId, userId: user.id});
            const options = messages.map((m) => {
                let truncatedMessage = m.message;
                if (isString(truncatedMessage) && truncatedMessage.length > 35) {
                    truncatedMessage = m.message.substring(0, 35) + "...";
                }
                return {
                    value: m.message,
                    label: `/${m.shortcode} - ${truncatedMessage}`,
                    mediaPath: m.mediaPath,
                };
            });
            setQuickMessages(options);
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            isString(inputMessage) &&
            !isEmpty(inputMessage) &&
            inputMessage.length > 1
        ) {
            const firstWord = inputMessage.charAt(0);
            setPopupOpen(firstWord.indexOf("/") > -1);

            const filteredOptions = quickMessages.filter(
                (m) => m.label.indexOf(inputMessage) > -1
            );
            setOptions(filteredOptions);
        } else {
            setPopupOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputMessage]);

    function isCharacterKeyPress(evt) {
        if (typeof evt.which == "undefined") {
            return true;
        } else if (typeof evt.which == "number" && evt.which > 0) {
           return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8
               && evt.which != 13 && evt.which != 17 && evt.which != 18 && evt.which != 27;
               ;
        }
        return false;
    }
    const onKeyPress = (e) => {
        if (loading || e.shiftKey) return;
        else if (e.key === "Enter") {
            handleSendMessage();
        } else {
            if (isCharacterKeyPress(e)) {
                sendTypingStatus(true);
            }
        }
    };

    const onPaste = (e) => {
        if (ticketStatus === "open") {
            handleInputPaste(e);
        }
    };

    const renderPlaceholder = () => {
        if (ticketStatus === "open") {
            return i18n.t("messagesInput.placeholderOpen");
        }
        return i18n.t("messagesInput.placeholderClosed");
    };


    const setInputRef = (input) => {
        if (input) {
            input.focus();
            inputRef.current = input;
        }
    };

    return (
        <div className={classes.messageInputWrapper}>
            <Autocomplete
                freeSolo
                open={popupOpen}
                id="grouped-demo"
                value={inputMessage}
                options={options}
                closeIcon={null}
                getOptionLabel={(option) => {
                    if (isObject(option)) {
                        return option.label;
                    } else {
                        return option;
                    }
                }}
                onChange={(event, opt) => {

                    if (isObject(opt) && has(opt, "value") && isNil(opt.mediaPath)) {
                        setInputMessage(opt.value);
                        setTimeout(() => {
                            inputRef.current.scrollTop = inputRef.current.scrollHeight;
                        }, 200);
                    } else if (isObject(opt) && has(opt, "value") && !isNil(opt.mediaPath)) {
                        handleQuickAnswersClick(opt);

                        setTimeout(() => {
                            inputRef.current.scrollTop = inputRef.current.scrollHeight;
                        }, 200);
                    }
                }}
                onInputChange={(event, opt, reason) => {
                    if (reason === "input") {
                        setInputMessage(event.target.value);
                    }
                }}
                onPaste={onPaste}
                onKeyUp={onKeyPress}
                style={{width: "100%"}}
                renderInput={(params) => {
                    const {InputLabelProps, InputProps, ...rest} = params;
                    return (
                        <InputBase
                            {...params.InputProps}
                            {...rest}
                            disabled={disableOption()}
                            inputRef={setInputRef}
                            placeholder={renderPlaceholder()}
                            multiline
                            className={classes.messageInput}
                            maxRows={5}
                        />
                    );
                }}
            />
        </div>
    );
};

const MessageInputCustom = (props) => {
    const {ticketStatus, ticketId} = props;
    const classes = useStyles();

    const [medias, setMedias] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recording, setRecording] = useState(false);
    const inputRef = useRef();
    const [onDragEnter, setOnDragEnter] = useState(false);
    const {setReplyingMessage, replyingMessage} = useContext(ReplyMessageContext);
    const {setEditingMessage, editingMessage} = useContext(EditMessageContext);
    const {user} = useContext(AuthContext);
    const [senVcardModalOpen, setSenVcardModalOpen] = useState(false);

    const [signMessage, setSignMessage] = useLocalStorage("signOption", true);

    const [lastTypingStatus, setLastTypingStatus] = useState(null);

    useEffect(() => {
        inputRef.current.focus();
        if (editingMessage) {
            setInputMessage(editingMessage.body);
        }
    }, [replyingMessage, editingMessage]);

    useEffect(() => {
        inputRef.current.focus();
        return () => {
            sendTypingStatus(false).then(() => {
                setLastTypingStatus(null);
            })
            setInputMessage("");
            setShowEmoji(false);
            setMedias([]);
            setReplyingMessage(null);
            setEditingMessage(null);
        };
    }, [ticketId, setReplyingMessage, setEditingMessage]);

    useEffect(() => {
        setTimeout(() => {
            setOnDragEnter(false);
        }, 10000);
    }, [onDragEnter === true]);

    const handleAddEmoji = (e) => {
        let emoji = e.native;
        setInputMessage((prevState) => prevState + emoji);
    };

    const handleSendContatcMessage = async (vcard) => {
        setSenVcardModalOpen(false);
        setLoading(true);

        if (isNil(vcard)) {
            setLoading(false);
            return;
        }

        const message = {
            read: 1,
            fromMe: true,
            mediaUrl: "",
            body: null,
            quotedMsg: replyingMessage,
            //isPrivate: privateMessage,
            vCard: vcard,
        };
        try {
            await api.post(`/messages/${ticketId}`, message);
        } catch (err) {
            toastError(err);
        }

        setInputMessage("");
        setShowEmoji(false);
        setLoading(false);
        setReplyingMessage(null);
        await sendTypingStatus(false);

        //setPrivateMessage(false);
        //setPrivateMessageInputVisible(false)
    };

    const handleSendContactModalOpen = async () => {
        setSenVcardModalOpen(true);
    };

    const handleChangeMedias = (e) => {
        if (!e.target.files) {
            return;
        }

        const selectedMedias = Array.from(e.target.files);
        setMedias(selectedMedias);
    };

    const handleInputPaste = (e) => {
        if (e.clipboardData.files[0]) {
            const selectedMedias = Array.from(e.clipboardData.files);
            setMedias(selectedMedias);
        }
    };

    const handleInputDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files[0]) {
            const selectedMedias = Array.from(e.dataTransfer.files);
            setMedias(selectedMedias);
        }
    };

    const handleUploadQuickMessageMedia = async (blob, message) => {
        setLoading(true);
        try {
            const extension = blob.type.split("/")[1];

            const formData = new FormData();
            const filename = `${new Date().getTime()}.${extension}`;
            formData.append("medias", blob, filename);
            formData.append("body", message);
            formData.append("fromMe", true);

            await api.post(`/messages/${ticketId}`, formData);
            await sendTypingStatus(false);

        } catch (err) {
            toastError(err);
            setLoading(false);
        }
        setLoading(false);
    };

    const handleQuickAnswersClick = async (value) => {
        if (value.mediaPath) {
            try {
                const {data} = await axios.get(value.mediaPath, {
                    responseType: "blob",
                });

                await handleUploadQuickMessageMedia(data, value.value);
                await sendTypingStatus(false);
                setInputMessage("");
                return;
                //  handleChangeMedias(response)
            } catch (err) {
                toastError(err);
            }
        }

        setInputMessage("");
        setInputMessage(value.value);
        await sendTypingStatus(false);
    };

    const handleUploadMedia = async (e) => {
        setLoading(true);
        if (e) {
            e.preventDefault();
        }

        const formData = new FormData();
        formData.append("fromMe", true);
        medias.forEach((media) => {
            formData.append("medias", media);
            formData.append("body", inputMessage);
        });

        try {
            await api.post(`/messages/${ticketId}`, formData);
        } catch (err) {
            toastError(err);
        }

        setLoading(false);
        setMedias([]);
    };

    const sendTypingStatus = async (status) => {
        try {
            if (!ticketId)
                return;
            if (inputMessage.trim() === "")
                status = false;

            if (lastTypingStatus && new Date().getTime() - lastTypingStatus.getTime() < 3000)
                return;

            if (status)
                setLastTypingStatus(new Date());
            else
                setLastTypingStatus(null);

            await api.post(`/messages/typing/${ticketId}?status=${status}`);

        } catch (err) {
            toastError(err);
        }
    }

    const handleSendMessage = async () => {
        if (inputMessage.trim() === "") return;
        setLoading(true);

        const message = {
            read: 1,
            fromMe: true,
            mediaUrl: "",
            body: !editingMessage && signMessage
                ? `*${user?.name}:*\n${inputMessage.trim()}`
                : inputMessage.trim(),
            quotedMsg: replyingMessage,
        };
        try {
            if (editingMessage !== null) {
                await api.post(`/messages/edit/${editingMessage.id}`, message);
            } else {
                await api.post(`/messages/${ticketId}`, message);
            }
        } catch (err) {
            toastError(err);
        }

        setInputMessage("");
        setShowEmoji(false);
        setLoading(false);
        setReplyingMessage(null);
        setEditingMessage(null);
    };

    const handleStartRecording = async () => {
        setLoading(true);
        try {
            await navigator.mediaDevices.getUserMedia({audio: true});
            await Mp3Recorder.start();
            setRecording(true);
            setLoading(false);
        } catch (err) {
            toastError(err);
            setLoading(false);
        }
    };

    const handleUploadAudio = async () => {
        setLoading(true);
        try {
            const [, blob] = await Mp3Recorder.stop().getMp3();
            if (blob.size < 10000) {
                setLoading(false);
                setRecording(false);
                return;
            }

            const formData = new FormData();
            const filename = `audio-record-site-${new Date().getTime()}.mp3`;
            formData.append("medias", blob, filename);
            formData.append("body", inputMessage);
            formData.append("fromMe", true);

            await api.post(`/messages/${ticketId}`, formData);
        } catch (err) {
            toastError(err);
        }

        setRecording(false);
        setLoading(false);
    };

    const handleCancelAudio = async () => {
        try {
            await Mp3Recorder.stop().getMp3();
            setRecording(false);
        } catch (err) {
            toastError(err);
        }
    };

    const disableOption = () => {
        return loading || recording || ticketStatus !== "open";
    };

    const renderReplyingMessage = (message) => {
        return (
            <div className={classes.replyginMsgWrapper}>
                <div className={classes.replyginMsgContainer}>
          <span
              className={clsx(classes.replyginContactMsgSideColor, {
                  [classes.replyginSelfMsgSideColor]: !message.fromMe,
              })}
          ></span>

                    {replyingMessage && (
                        <div className={classes.replyginMsgBody}>
                            {!message.fromMe && (
                                <span className={classes.messageContactName}>
	                {message.contact?.name}
	              </span>
                            )}
                            {message.body}
                        </div>
                    )}

                </div>
                <IconButton
                    aria-label="showRecorder"
                    component="span"
                    disabled={loading || ticketStatus !== "open"}
                    onClick={() => {
                        setReplyingMessage(null);
                        setEditingMessage(null);
                        setInputMessage("");
                    }}
                >
                    <ClearIcon className={classes.sendMessageIcons}/>
                </IconButton>
            </div>
        );
    };

    if (medias.length > 0)
        return (
            <Paper elevation={0} square className={classes.viewMediaInputWrapper}
                   onDragEnter={() => setOnDragEnter(true)}
                   onDrop={(e) => handleInputDrop(e)}
            >
                <IconButton
                    aria-label="cancel-upload"
                    component="span"
                    onClick={(e) => setMedias([])}
                >
                    <CancelIcon className={classes.sendMessageIcons}/>
                </IconButton>

                {loading ? (
                    <div>
                        <CircularProgress className={classes.circleLoading}/>
                    </div>
                ) : (
                    <Grid item className={classes.gridFiles}>
                        <Typography variant="h6" component="div">
                            {i18n.t("uploads.titles.titleFileList")} ({medias.length})
                        </Typography>
                        <List>
                            {medias.map((value, index) => {
                                return (
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Avatar className={classes.avatar} alt={value.name}
                                                    src={URL.createObjectURL(value)}/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${value.name}`}
                                            secondary={`${parseInt(value.size / 1024)} kB`}
                                            // color="secondary"
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                        <InputBase
                            style={{width: "0", height: "0"}}
                            inputRef={function (input) {
                                if (input != null) {
                                    input.focus();
                                }
                            }}
                            onKeyPress={async (e) => {
                                if (e.key === "Enter") {
                                    await handleUploadMedia();
                                }
                            }}
                            defaultValue={medias[0].name}
                        />
                    </Grid>
                )}
                <IconButton
                    aria-label="send-upload"
                    component="span"
                    onClick={handleUploadMedia}
                    disabled={loading}
                >
                    <SendIcon className={classes.sendMessageIcons}/>
                </IconButton>
            </Paper>
        );
    else {
        return (
            <>
                {senVcardModalOpen && (
                    <ContactSendModal
                        modalOpen={senVcardModalOpen}
                        onClose={async (c) => {
                            await handleSendContatcMessage(c);
                        }}
                    />
                )}
                <Paper square elevation={0} className={classes.mainWrapper}
                       onDragEnter={() => setOnDragEnter(true)}
                       onDrop={(e) => handleInputDrop(e)}
                >
                    {(replyingMessage && renderReplyingMessage(replyingMessage)) || (editingMessage && renderReplyingMessage(editingMessage))}
                    <div className={classes.newMessageBox}>
                        <EmojiOptions
                            disabled={disableOption()}
                            handleAddEmoji={handleAddEmoji}
                            showEmoji={showEmoji}
                            setShowEmoji={setShowEmoji}
                        />

                        <FileInput
                            disableOption={disableOption}
                            onMouseOver={() => setOnDragEnter(true)}
                            handleChangeMedias={handleChangeMedias}
                        />
                        <IconButton
                            aria-label="sendContact"
                            component="span"
                            onClick={handleSendContactModalOpen}
                            onMouseOver={() => setOnDragEnter(true)}
                        >
                            <PersonIcon className={classes.sendMessageIcons}/>
                        </IconButton>

                        <SignSwitch
                            width={props.width}
                            setSignMessage={setSignMessage}
                            signMessage={signMessage}
                        />

                        <CustomInput
                            loading={loading}
                            inputRef={inputRef}
                            ticketStatus={ticketStatus}
                            sendTypingStatus={sendTypingStatus}
                            inputMessage={inputMessage}
                            setInputMessage={setInputMessage}
                            // handleChangeInput={handleChangeInput}
                            handleSendMessage={handleSendMessage}
                            handleInputPaste={handleInputPaste}
                            disableOption={disableOption}
                            handleQuickAnswersClick={handleQuickAnswersClick}
                        />

                        <ActionButtons
                            inputMessage={inputMessage}
                            loading={loading}
                            recording={recording}
                            ticketStatus={ticketStatus}
                            handleSendMessage={handleSendMessage}
                            handleCancelAudio={handleCancelAudio}
                            handleUploadAudio={handleUploadAudio}
                            handleStartRecording={handleStartRecording}
                        />
                    </div>
                </Paper>
            </>
        );
    }
};

export default withWidth()(MessageInputCustom);
