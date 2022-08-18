import React from 'react';
import { useSelector } from 'react-redux';

export default function SiteFooter() {
  const isLoggedIn = useSelector((state) => !!state.auth.id);

  return isLoggedIn ? (
    <div id="footer">
      <h3>
        <i>Billfold</i>, by Lucas McGill
      </h3>
    </div>
  ) : (
    ''
  );
}
