import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { getUserCards } from '../../api/cards';
import { getCardLinks, getLinkAuditLogs, updateLink } from '../../api/links';
import cardWetapImg from '../../assets/images/card_wetap.png';
import emailPictureImg from '../../assets/images/Email_picture.png';
import historyImg from '../../assets/images/history.png';
import noDataImg from '../../assets/images/no_data.png';
import editUserIcon from '../../assets/images/edit_user.svg';
import backWetapIcon from '../../assets/images/back_wetap.svg';
import loaderGif from '../../assets/images/wetap_loader_latest.gif';

const formatLogDate = (creationDate, insertDate) => {
  const d = creationDate
    ? new Date(creationDate)
    : insertDate
      ? new Date(insertDate * 1000)
      : null;
  if (!d || isNaN(d.getTime())) return '';
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = String(d.getFullYear()).slice(-2);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
};

export const UserCardsView = ({ user, onBack }) => {
  const showToast = useToast();
  const { accessToken } = useAuth();
  const outlet = useOutletContext();
  const setCustomHeader = outlet?.setCustomHeader;
  const onBackRef = useRef(onBack);

  const [activeCard, setActiveCard] = useState(null);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(() => Boolean(user?.userId || user?._id));

  const [editingLink, setEditingLink] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', subTitle: '', link: '' });
  const [isSaving, setIsSaving] = useState(false);

  const [historyLink, setHistoryLink] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  // Synchronize header with back button if outlet context exists
  useEffect(() => {
    if (!setCustomHeader) return;
    setCustomHeader({
      onBack: () => onBackRef.current?.(),
    });
    return () => {
      setCustomHeader(null);
    };
  }, [setCustomHeader]);

  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const effectiveUserId = user?.userId || user?._id;
    if (!effectiveUserId) return;

    async function loadCardAndLinks() {
      try {
        // 1. GET /api/card?userId=...
        const cardRes = await getUserCards(accessToken, effectiveUserId, controller.signal);
        if (ignore) return;
        const cardList = cardRes?.cardList || [];
        const primaryCard = cardList[0] || null;
        setActiveCard(primaryCard);

        const effectiveCardId =
          primaryCard?.cardId || user?.cardId;

        // 2. GET /api/link?cardId=...
        if (effectiveCardId) {
          const linkRes = await getCardLinks(accessToken, effectiveCardId, controller.signal);
          if (ignore) return;
          const linkAddedList = linkRes?.linkAddedList || [];

          const formattedLinks = linkAddedList.map((item) => ({
            id: item.linkaddedId || item._id,
            linkaddedId: item.linkaddedId || item._id,
            cardId: effectiveCardId,
            userId: item.userId,
            title: item.title || '',
            subTitle: item.userTitle || item.subTitle || '',
            link: item.link || '',
            icon: item.icon || emailPictureImg,
            isShow: item.isShow,
            raw: item,
          }));

          setLinks(formattedLinks);
        } else {
          setLinks([]);
        }
      } catch (err) {
        if (!ignore && !controller.signal.aborted) {
          showToast(err.message || 'Unable to load card and links');
        }
      } finally {
        if (!ignore && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadCardAndLinks();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [accessToken, user, showToast, reloadCounter]);

  const handleOpenEdit = (linkItem) => {
    setEditingLink(linkItem);
    setEditForm({
      title: linkItem.title || '',
      subTitle: linkItem.subTitle || '',
      link: linkItem.link || '',
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.subTitle.trim() || !editForm.link.trim()) {
      showToast('Please fill in required fields');
      return;
    }

    const cardId =
      editingLink?.cardId ||
      activeCard?.cardId ||
      user?.cardId ||
      user?._id;
    const linkaddedId =
      editingLink?.linkaddedId ||
      editingLink?.linkAddedId ||
      editingLink?._id ||
      editingLink?.id;
    const link = editForm.link.trim();
    const userTitle = editForm.subTitle.trim();

    setIsSaving(true);
    try {
      const data = await updateLink(accessToken, {
        cardId,
        link,
        linkaddedId,
        userTitle,
      });

      const resp = data?.response || {};
      const newSubTitle = resp.userTitle || userTitle;
      const newLink = resp.link || link;

      setLinks((prev) =>
        prev.map((item) =>
          item.id === editingLink.id
            ? {
              ...item,
              subTitle: newSubTitle,
              link: newLink,
            }
            : item
        )
      );

      showToast(data?.message || 'Link updated successfully');
      setEditingLink(null);
    } catch (err) {
      showToast(err.message || 'Unable to update link. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenHistory = async (linkItem) => {
    setHistoryLink(linkItem);
    setIsLoadingLogs(true);
    setLogs([]);

    const linkAddedId =
      linkItem.linkaddedId ||
      linkItem.linkAddedId ||
      linkItem._id ||
      linkItem.id;
    const cardId =
      linkItem.cardId ||
      activeCard?.cardId ||
      user?.cardId ||
      user?._id;

    try {
      const data = await getLinkAuditLogs(accessToken, { linkAddedId, cardId });
      setLogs(data?.linkAddedLogs || []);
    } catch (err) {
      showToast(err.message || 'Unable to fetch audit logs');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const displayName = activeCard?.name || user?.name || user?.userName || '';

  return (
    <div className="wetap-user-cards-view-wrapper">
      {/* Top back button fallback if custom header is inactive */}
      {!outlet?.setCustomHeader && (
        <div className="wetap-cards-view-fallback-bar">
          <button
            type="button"
            className="wetap-header-back-btn"
            onClick={onBack}
            aria-label="Back to Users"
            title="Back to Users"
          >
            <img src={backWetapIcon} alt="Back" />
          </button>
        </div>
      )}

      <div className="wetap-user-cards-main-layout">
        {/* Left Column: User Cards */}
        <div className="wetap-user-cards-col">
          <h2 className="wetap-cards-col-heading">User Cards</h2>

          <div className="wetap-card-visual-container">
            <div className="wetap-card-stack-graphic-wrap">
              <img
                src={cardWetapImg}
                alt="Wetap User Card"
                className="wetap-card-stack-img"
              />
              <div className="wetap-card-center-name">
                {displayName}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: List of Links */}
        <div className="wetap-user-links-col">
          <div className="wetap-links-header-row">
            <h2 className="wetap-cards-col-heading">List of Links</h2>
          </div>

          <div className="wetap-links-table-card">
            {isLoading ? (
              <div className="wetap-logs-loading">
                <img src={loaderGif} alt="Loading" className="wetap-loader-gif" />
              </div>
            ) : links.length > 0 ? (
              <div className="wetap-links-table-scroll">
                <table className="wetap-links-table">
                  <thead>
                    <tr>
                      <th className="col-title">Title</th>
                      <th className="col-subtitle">Sub-Title</th>
                      <th className="col-link">Link</th>
                      <th className="col-icon">Icon</th>
                      <th className="col-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((item) => (
                      <tr key={item.id}>
                        <td className="col-title">{item.title}</td>
                        <td className="col-subtitle">{item.subTitle}</td>
                        <td className="col-link">
                          <span className="wetap-link-text">{item.link}</span>
                        </td>
                        <td className="col-icon">
                          <img
                            src={item.icon || emailPictureImg}
                            alt={item.title}
                            className="wetap-link-badge-icon"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = emailPictureImg;
                            }}
                          />
                        </td>
                        <td className="col-actions">
                          <div className="wetap-link-actions-group">
                            <button
                              type="button"
                              className="wetap-link-action-btn edit"
                              onClick={() => handleOpenEdit(item)}
                              title="Edit Link"
                              aria-label={`Edit ${item.title}`}
                            >
                              <img src={editUserIcon} alt="Edit" />
                            </button>
                            <button
                              type="button"
                              className="wetap-link-action-btn history"
                              onClick={() => handleOpenHistory(item)}
                              title="View History"
                              aria-label={`View history for ${item.title}`}
                            >
                              <img src={historyImg} alt="History" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="wetap-links-no-data-card">
                <img
                  src={noDataImg}
                  alt="No Data"
                  className="wetap-no-data-graphic"
                />
                <h3 className="wetap-no-data-title">No Links Available</h3>
                <p className="wetap-no-data-desc">
                  There are currently no links attached to this user card.
                </p>
                <div className="wetap-no-data-actions">
                  <button
                    type="button"
                    className="wetap-gradient-btn"
                    onClick={() => {
                      setIsLoading(true);
                      setReloadCounter((prev) => prev + 1);
                    }}
                  >
                    Refresh Links
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Links Modal (Pen Icon Click) */}
      {editingLink && (
        <div
          className="wetap-user-status-overlay"
          onClick={() => !isSaving && setEditingLink(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="wetap-modal-card wetap-edit-links-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wetap-modal-header">
              <h3 className="wetap-modal-title">Edit User Links</h3>
              <button
                className="wetap-modal-close-icon"
                onClick={() => !isSaving && setEditingLink(null)}
                aria-label="Close"
                disabled={isSaving}
              >
                <X size={18} strokeWidth={2.8} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="wetap-edit-modal-body">
                {/* Title value is non-editable */}
                <div className="wetap-custom-field">
                  <label className="wetap-custom-label">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    readOnly
                    disabled
                    className="wetap-custom-input wetap-custom-input-readonly"
                    title="Title is non-editable"
                  />
                </div>

                <div className="wetap-custom-field">
                  <label className="wetap-custom-label">Sub-Title</label>
                  <input
                    type="text"
                    value={editForm.subTitle}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subTitle: e.target.value })
                    }
                    className="wetap-custom-input"
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="wetap-custom-field">
                  <label className="wetap-custom-label">Link</label>
                  <input
                    type="text"
                    value={editForm.link}
                    onChange={(e) =>
                      setEditForm({ ...editForm, link: e.target.value })
                    }
                    className="wetap-custom-input"
                    required
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="wetap-modal-footer">
                <button
                  type="submit"
                  className="wetap-btn-outline-green"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="wetap-btn-outline-red"
                  onClick={() => setEditingLink(null)}
                  disabled={isSaving}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Added Logs List Modal (History Icon Click - Matches API & Design) */}
      {historyLink && (
        <div
          className="wetap-user-status-overlay"
          onClick={() => setHistoryLink(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="wetap-modal-card wetap-logs-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wetap-modal-header">
              <h3 className="wetap-modal-title">Added Logs List</h3>
              <button
                className="wetap-modal-close-icon"
                onClick={() => setHistoryLink(null)}
                aria-label="Close"
              >
                <X size={18} strokeWidth={2.8} />
              </button>
            </div>

            <div className="wetap-logs-table-container">
              <div className="wetap-logs-header-columns">
                <span className="col-updated-by">Updated By</span>
                <span className="col-created-on">Created On</span>
                <span className="col-action-type">Type Of Action</span>
                <span className="col-log-link">Link</span>
                <span className="col-log-title">Title</span>
              </div>

              <div className="wetap-logs-body">
                {isLoadingLogs ? (
                  <div className="wetap-logs-loading">
                    <img src={loaderGif} alt="Loading" className="wetap-loader-gif" />
                  </div>
                ) : logs.length > 0 ? (
                  <div className="wetap-logs-rows">
                    {logs.map((log, index) => {
                      const updatedBy = log.name || log.email || '';
                      const createdOn = formatLogDate(log.creationDate, log.insertDate);
                      const typeOfAction = log.typeOfAction || '';
                      const linkValue =
                        log.updatedData?.link || log.previousData?.link || log.link || '';
                      const titleValue =
                        log.updatedData?.userTitle ||
                        log.previousData?.userTitle ||
                        log.title ||
                        '';

                      return (
                        <div key={log._id || index} className="wetap-log-row">
                          <span className="col-updated-by">{updatedBy}</span>
                          <span className="col-created-on">{createdOn}</span>
                          <span className="col-action-type">{typeOfAction}</span>
                          <span className="col-log-link">{linkValue}</span>
                          <span className="col-log-title">{titleValue}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="wetap-logs-empty-view">
                    <img
                      src={noDataImg}
                      alt="No records found"
                      className="wetap-logs-empty-img"
                    />
                    <p className="wetap-logs-empty-text">No records found</p>
                  </div>
                )}
              </div>
            </div>

            <div className="wetap-modal-footer">
              <button
                type="button"
                className="wetap-btn-outline-red"
                onClick={() => setHistoryLink(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCardsView;
