import React, { useState, useEffect, useContext, useRef } from "react";
import "emoji-mart/css/emoji-mart.css";
import { useParams } from "react-router-dom";
import { Picker } from "emoji-mart";

import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import IconButton from "@material-ui/core/IconButton";
import MoodIcon from "@material-ui/icons/Mood";
import PersonIcon from "@material-ui/icons/Person";
import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import ClearIcon from "@material-ui/icons/Clear";
import MicIcon from "@material-ui/icons/Mic";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { FormControlLabel,
	Switch,
	Grid,
	Typography,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar } from "@material-ui/core";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import RecordingTimer from "./RecordingTimer";
import { ReplyMessageContext } from "../../context/ReplyingMessage/ReplyingMessageContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import toastError from "../../errors/toastError";
import MicRecorder from "../../helpers/mic-recorder/mic-recorder";
import ContactSendModal from "../ContactSendModal";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const useStyles = makeStyles(theme => ({
	mainWrapper: {
		backgroundColor: theme.palette.bordabox, //DARK MODE PLW DESIGN//
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		borderTop: "1px solid rgba(0, 0, 0, 0.12)",
	},

	newMessageBox: {
		background: "#eee",
		width: "100%",
		display: "flex",
		padding: "7px",
		alignItems: "center",
	},

	messageInputWrapper: {
		padding: 6,
		marginRight: 7,
		background: "#fff",
		display: "flex",
		borderRadius: 20,
		flex: 1,
	},

	avatar: {
		width: "50px",
		height: "50px",
		borderRadius:"25%"
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
}));

const MessageInput = ({ ticketStatus }) => {
	const classes = useStyles();
	const { ticketId } = useParams();

	const [medias, setMedias] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	const [showEmoji, setShowEmoji] = useState(false);
	const [loading, setLoading] = useState(false);
	const [recording, setRecording] = useState(false);
	const inputRef = useRef();
	const [onDragEnter, setOnDragEnter] = useState(false);
	const { setReplyingMessage, replyingMessage } = useContext(ReplyMessageContext);
	const [senVcardModalOpen, setSenVcardModalOpen] = useState(false);

	const { user } = useContext(AuthContext);

	const [signMessage, setSignMessage] = useLocalStorage("signOption", true);

	useEffect(() => {
		inputRef.current.focus();
	}, [replyingMessage]);

	useEffect(() => {
		inputRef.current.focus();
		return () => {
			setInputMessage("");
			setShowEmoji(false);
			setMedias([]);
			setReplyingMessage(null);
		};
	}, [ticketId, setReplyingMessage]);

	useEffect(() => {
		setTimeout(() => {
		  setOnDragEnter(false);
		}, 10000);
	  }, [onDragEnter === true]);

	const handleChangeInput = e => {
		setInputMessage(e.target.value);
	};

	const handleAddEmoji = e => {
		let emoji = e.native;
		setInputMessage(prevState => prevState + emoji);
	};

	const handleChangeMedias = e => {
		if (!e.target.files) {
			return;
		}

		const selectedMedias = Array.from(e.target.files);
		setMedias(selectedMedias);
	};

	const handleInputPaste = e => {
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

	const handleUploadMedia = async e => {
		setLoading(true);
		if (e) {
			e.preventDefault();
		}

		const formData = new FormData();
		formData.append("fromMe", true);
		medias.forEach(media => {
			formData.append("medias", media);
			formData.append("body", media.name);
		});

		try {
			await api.post(`/messages/${ticketId}`, formData);
		} catch (err) {
			toastError(err);
		}

		setLoading(false);
		setMedias([]);
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
			isPrivate: privateMessage,
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
		//setPrivateMessage(false);
		//setPrivateMessageInputVisible(false)
	};

	const handleSendContactModalOpen = async () => {
		handleMenuItemClick();
		setSenVcardModalOpen(true);
	};

	const handleSendMessage = async () => {
		if (inputMessage.trim() === "") return;
		setLoading(true);

		const message = {
			read: 1,
			fromMe: true,
			mediaUrl: "",
			body: signMessage
				? `*${user?.name}:*\n${inputMessage.trim()}`
				: inputMessage.trim(),
			quotedMsg: replyingMessage,
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
	};

	const handleStartRecording = async () => {
		setLoading(true);
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true });
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
			const filename = `${new Date().getTime()}.mp3`;
			formData.append("medias", blob, filename);
			formData.append("body", filename);
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

	const renderReplyingMessage = message => {
		return (
			<div className={classes.replyginMsgWrapper}>
				<div className={classes.replyginMsgContainer}>
					<span
						className={clsx(classes.replyginContactMsgSideColor, {
							[classes.replyginSelfMsgSideColor]: !message.fromMe,
						})}
					></span>
					<div className={classes.replyginMsgBody}>
						{!message.fromMe && (
							<span className={classes.messageContactName}>
								{message.contact?.name}
							</span>
						)}
						{message.body}
					</div>
				</div>
				<IconButton
					aria-label="showRecorder"
					component="span"
					disabled={loading || ticketStatus !== "open"}
					onClick={() => setReplyingMessage(null)}
				>
					<ClearIcon className={classes.sendMessageIcons} />
				</IconButton>
			</div>
		);
	};

	if (medias.length > 0)
		return (
			<Paper 
			elevation={0}
			square
			className={classes.viewMediaInputWrapper}
			onDragEnter={() => setOnDragEnter(true)}
			onDrop={(e) => handleInputDrop(e)}
		  >
				<IconButton
					aria-label="cancel-upload"
					component="span"
					onClick={e => setMedias([])}
				>
					<CancelIcon className={classes.sendMessageIcons} />
				</IconButton>

				{loading ? (
					<div>
						<CircularProgress className={classes.circleLoading} />
					</div>
				) : (
					<Grid item className={classes.gridFiles}>
					<Typography  variant="h6" component="div">
					  {i18n.t("uploads.titles.titleFileList")} ({medias.length})
					</Typography>
					<List>
					  {medias.map((value, index) => {
						return (
						  <ListItem key={index}>
							<ListItemAvatar>
							  <Avatar className={classes.avatar} alt={value.name} src={URL.createObjectURL(value)}/>
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
					  style={{ width: "0", height: "0" }}
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
					<SendIcon className={classes.sendMessageIcons} />
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
			<Paper 
			square
			elevation={0}
			className={classes.mainWrapper}
			onDragEnter={() => setOnDragEnter(true)}
			onDrop={(e) => handleInputDrop(e)}  
		  >
			<div className={ onDragEnter ? classes.dropInfo : classes.dropInfoOut}>
			  ⬇️ {i18n.t("uploads.titles.titleUploadMsgDragDrop")} ⬇️
			</div>
				{replyingMessage && renderReplyingMessage(replyingMessage)}
				<div className={classes.newMessageBox}>
					<IconButton
						aria-label="emojiPicker"
						component="span"
						disabled={loading || recording || ticketStatus !== "open"}
						onClick={e => setShowEmoji(prevState => !prevState)}
						onMouseOver={() => setOnDragEnter(true)}
					>
						<MoodIcon className={classes.sendMessageIcons} />
					</IconButton>
					<IconButton
						aria-label="sendContact"
						component="span"
						onClick={handleSendContactModalOpen}
						onMouseOver={() => setOnDragEnter(true)}
					>
						<PersonIcon className={classes.sendMessageIcons} />
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

					<input
						multiple
						type="file"
						id="upload-button"
						disabled={loading || recording || ticketStatus !== "open"}
						className={classes.uploadInput}
						onChange={handleChangeMedias}
					/>
					<label htmlFor="upload-button">
						<IconButton
							aria-label="upload"
							component="span"
							disabled={loading || recording || ticketStatus !== "open"}
						>
							<AttachFileIcon className={classes.sendMessageIcons} />
						</IconButton>
					</label>
					<FormControlLabel
						style={{ marginRight: 7, color: "gray" }}
						label={i18n.t("messagesInput.signMessage")}
						labelPlacement="start"
						control={
							<Switch
								size="small"
								checked={signMessage}
								onChange={e => {
									setSignMessage(e.target.checked);
								}}
								name="showAllTickets"
								color="primary"
							/>
						}
					/>
					<div className={classes.messageInputWrapper}>
						<InputBase
							inputRef={input => {
								input && input.focus();
								input && (inputRef.current = input);
							}}
							className={classes.messageInput}
							placeholder={
								ticketStatus === "open"
									? i18n.t("messagesInput.placeholderOpen")
									: i18n.t("messagesInput.placeholderClosed")
							}
							multiline
							maxRows={5}
							value={inputMessage}
							onChange={handleChangeInput}
							disabled={recording || loading || ticketStatus !== "open"}
							onPaste={e => {
								ticketStatus === "open" && handleInputPaste(e);
							}}
							onKeyPress={async e => {
								if (loading || e.shiftKey) return;
								else if (e.key === "Enter") {
									await handleSendMessage();
								}
							}}
						/>
					</div>
					{inputMessage ? (
						<IconButton
							aria-label="sendMessage"
							component="span"
							onClick={handleSendMessage}
							disabled={loading}
						>
							<SendIcon className={classes.sendMessageIcons} />
						</IconButton>
					) : recording ? (
						<div className={classes.recorderWrapper}>
							<IconButton
								aria-label="cancelRecording"
								component="span"
								fontSize="large"
								disabled={loading}
								onClick={handleCancelAudio}
							>
								<HighlightOffIcon className={classes.cancelAudioIcon} />
							</IconButton>
							{loading ? (
								<div>
									<CircularProgress className={classes.audioLoading} />
								</div>
							) : (
								<RecordingTimer />
							)}

							<IconButton
								aria-label="sendRecordedAudio"
								component="span"
								onClick={handleUploadAudio}
								disabled={loading}
							>
								<CheckCircleOutlineIcon className={classes.sendAudioIcon} />
							</IconButton>
						</div>
					) : (
						<IconButton
							aria-label="showRecorder"
							component="span"
							disabled={loading || ticketStatus !== "open"}
							onClick={handleStartRecording}
						>
							<MicIcon className={classes.sendMessageIcons} />
						</IconButton>
					)}
				</div>
			</Paper>

			</>
		);
	}
};

export default MessageInput;