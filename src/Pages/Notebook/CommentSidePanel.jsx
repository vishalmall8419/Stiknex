import React, { useState } from 'react';
import Style from './CommentSidePanel.module.css';

const CommentSidePanel = ({
  isOpen,
  onClose,
  darkMode,
  comments = [],
  activeSelectionText = '',
  onAddComment,
  onResolveComment,
  onDeleteComment,
  onJumpToComment,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'resolved'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (onAddComment) {
      onAddComment(newCommentText.trim());
      setNewCommentText('');
    }
  };

  const filteredComments = comments.filter((c) => {
    if (filter === 'active') return !c.resolved;
    if (filter === 'resolved') return c.resolved;
    return true;
  });

  return (
    <aside
      className={`${Style.panel} ${darkMode ? Style.darkPanel : ''}`}
      aria-label="Comments margin panel"
    >
      {/* Header */}
      <div className={Style.header}>
        <div className={Style.headerTitle}>
          <i className="fa-solid fa-comments" style={{ color: '#6366f1' }}></i>
          <span>Comments ({comments.length})</span>
        </div>
        <button
          type="button"
          className={Style.closeBtn}
          onClick={onClose}
          aria-label="Close comments panel"
          title="Close panel (Esc)"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className={Style.filterTabs}>
        <button
          type="button"
          className={`${Style.filterBtn} ${filter === 'all' ? Style.activeFilter : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({comments.length})
        </button>
        <button
          type="button"
          className={`${Style.filterBtn} ${filter === 'active' ? Style.activeFilter : ''}`}
          onClick={() => setFilter('active')}
        >
          Open ({comments.filter((c) => !c.resolved).length})
        </button>
        <button
          type="button"
          className={`${Style.filterBtn} ${filter === 'resolved' ? Style.activeFilter : ''}`}
          onClick={() => setFilter('resolved')}
        >
          Resolved ({comments.filter((c) => c.resolved).length})
        </button>
      </div>

      {/* Add New Comment Box */}
      <form className={Style.addCommentBox} onSubmit={handleSubmit}>
        {activeSelectionText ? (
          <div className={Style.selectedSnippet}>
            <i className="fa-solid fa-quote-left"></i>
            <span>
              "{activeSelectionText.length > 60
                ? activeSelectionText.slice(0, 60) + '...'
                : activeSelectionText}"
            </span>
          </div>
        ) : (
          <div className={Style.noSelectionTip}>
            <i className="fa-solid fa-circle-info"></i>
            <span>Select text in notebook to anchor your comment</span>
          </div>
        )}

        <textarea
          autoFocus
          className={Style.input}
          placeholder="Add a comment or note..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          rows={3}
        />

        <div className={Style.addBtnRow}>
          <button
            type="submit"
            className={Style.submitBtn}
            disabled={!newCommentText.trim()}
          >
            <i className="fa-solid fa-paper-plane"></i>
            <span>Post Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className={Style.commentsList}>
        {filteredComments.length === 0 ? (
          <div className={Style.emptyState}>
            <i className="fa-regular fa-comment-dots"></i>
            <p>No comments here yet</p>
            <span>Highlight text in the notebook and click "Add Comment" to annotate.</span>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`${Style.commentCard} ${comment.resolved ? Style.resolvedCard : ''}`}
              onClick={() => onJumpToComment && onJumpToComment(comment.id)}
            >
              {(comment.quote || comment.selectedText) && (
                <div className={Style.cardSnippet}>
                  <i className="fa-solid fa-highlighter"></i>
                  <span>"{comment.quote || comment.selectedText}"</span>
                </div>
              )}

              <p className={Style.cardText}>{comment.text}</p>

              <div className={Style.cardFooter}>
                <span className={Style.cardTime}>
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Recent'}
                </span>

                <div className={Style.cardActions} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className={`${Style.actionBtn} ${comment.resolved ? Style.activeResolve : ''}`}
                    onClick={() => onResolveComment && onResolveComment(comment.id)}
                    title={comment.resolved ? 'Reopen comment' : 'Mark as resolved'}
                  >
                    <i className="fa-solid fa-check"></i>
                    <span>{comment.resolved ? 'Resolved' : 'Resolve'}</span>
                  </button>

                  <button
                    type="button"
                    className={`${Style.actionBtn} ${Style.deleteBtn}`}
                    onClick={() => onDeleteComment && onDeleteComment(comment.id)}
                    title="Delete comment"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default CommentSidePanel;

