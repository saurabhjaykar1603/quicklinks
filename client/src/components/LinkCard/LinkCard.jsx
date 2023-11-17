import React from "react";
import "./LinkCard.css";

function LinkCard({ url, slug, clicks, i }) {
  return (
    <div key={i} className="card py-2 px-3 mt-2 shadow  ">
      <p className="m-0 mt-1">
        Orginal Url : <span className="text-primary">{url}</span>{" "}
      </p>
      <p className="m-0 mt-1">
        Short Link :{" "}
        <span className="text-primary" style={{ cursor: "pointer" }}>
          {import.meta.env.VITE_API_BASE_URL}/api/{slug}
        </span>
      </p>
      <hr className="m-0 my-3" />
      <p className="m-0  fw-bold">
        {" "}
        Clicks :
        <span className="px-2 py-1 bg-primary text-white rounded ms-2 fw">
          {clicks}
        </span>
      </p>
    </div>
  );
}

export default LinkCard;
