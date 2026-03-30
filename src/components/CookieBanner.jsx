import { useState, useEffect } from "react";

const STORAGE_KEY = "cec_cookies_ok";

export default function CookieBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setVisible(false);
    } catch {
      /* ignore */
    }
  }, []);

  function accept() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!visible) return null;

  return (
    <div className="cookie-bar" role="dialog" aria-label="Cookie notice">
      <p className="cookie-text">
        We use cookies to ensure that we give you the best experience on our
        website. If you continue to use this site we will assume that you are
        happy with it.
      </p>
      <div className="cookie-actions">
        <button type="button" className="btn-cookie" onClick={accept}>
          Accept &amp; Close
        </button>
        <a href="#" className="btn-cookie btn-cookie--ghost">Privacy Policy</a>
      </div>
    </div>
  );
}
