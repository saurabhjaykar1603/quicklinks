import React from "react";
import "./LinkCard.css";
import showToast from "crunchy-toast";
import axios from "axios";

function LinkCard({ url, slug, clicks, i, onDelete }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      try {
        await axios.delete(`/api/links/${slug}`);
        onDelete && onDelete(slug); // Call the parent's onDelete function
        showToast("Link deleted successfully!", "success", 3000);
      } catch (error) {
        console.error("Error deleting link:", error);
        showToast("Error deleting link. Please try again.", "error", 3000);
      }
    }
  };

  return (
    <div key={i} className="card py-2 px-3 mt-3 link-card-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <p className="m-0 mt-1 url">
            Original Url : <span className="text-primary url">{url}</span>{ " "}
          </p>
          <p className="m-0 mt-1 url">
            Short Link :{ " " }
            <span className="text-primary url" style={{ cursor: "pointer" }}>
              {import.meta.env.VITE_API_BASE_URL}/api/{slug}
            </span>
          </p>
          <hr className="m-0 my-2 my-sm-1" />
          <p className="m-0 url fw-bold">
            { " " }
            Clicks :<span className="url rounded ms-2 fw">{clicks}</span>
          </p>
        </div>
        <div>
          <button 
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            style={{
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

export default LinkCard;
